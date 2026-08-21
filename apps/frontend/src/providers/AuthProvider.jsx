import { useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/axios';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../config/firebase';
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Start with loading = true so the app can verify existing sessions before rendering
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lifecycle: On initial mount, we attempt to restore the session
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        
        if (storedUser && storedToken) {
          // Set initial state from storage for instant UI render
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Fetch fresh user data in background
          try {
            const { data } = await api.get('/auth/me');
            if (data?.data) {
              setUser(data.data);
              // Update storage with fresh data
              if (localStorage.getItem('user')) {
                localStorage.setItem('user', JSON.stringify(data.data));
              } else if (sessionStorage.getItem('user')) {
                sessionStorage.setItem('user', JSON.stringify(data.data));
              }
            }
          } catch (meError) {
            console.error("Failed to fetch fresh user data", meError);
          }
        }
      } catch (err) {
        console.error("Failed to restore session", err);
      } finally {
        setIsLoading(false); // Done checking session
      }
    };

    initAuth();

    // Listen for global logout events (e.g., from Axios interceptors)
    const handleGlobalLogout = () => {
      logout();
    };
    
    window.addEventListener('auth:logout', handleGlobalLogout);

    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout);
    };
  }, []);

  const login = (userData, token, rememberMe = false) => {
    setIsAuthenticated(true);
    setUser(userData);
    
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('accessToken', token);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
  };

  const refreshSession = async () => {
    // Relying on Axios interceptor for transparent refresh,
    // but can be called manually if required.
    try {
      const { data } = await api.post("/auth/refresh-token");
      const newToken = data.data.accessToken;
      
      if (localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', newToken);
      } else if (sessionStorage.getItem('accessToken')) {
        sessionStorage.setItem('accessToken', newToken);
      }
    } catch (err) {
      logout();
    }
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else if (sessionStorage.getItem('user')) {
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  };

  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
  };

  const requestOTP = async (phoneNumber, containerId = 'recaptcha-container') => {
    setupRecaptcha(containerId);
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  };

  const verifyOTP = async (otp) => {
    if (!window.confirmationResult) throw new Error("No confirmation result available.");
    const result = await window.confirmationResult.confirm(otp);
    return result;
  };

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshSession,
      updateUser,
      loginWithGoogle,
      requestOTP,
      verifyOTP
    }),
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
