import { useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/axios';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Start with loading = true so the app can verify existing sessions before rendering
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lifecycle: On initial mount, we attempt to restore the session
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
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

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
