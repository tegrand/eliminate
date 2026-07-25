import { useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Start with loading = true so the app can verify existing sessions before rendering
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lifecycle: On initial mount, we attempt to restore the session
    const initAuth = async () => {
      // TODO: Future API integration
      // 1. Check if backend validates the current HttpOnly cookie via a /me or /session endpoint.
      // 2. If valid, set user and isAuthenticated to true.
      
      // Temporary placeholder: simulate a network delay
      setTimeout(() => {
        setIsLoading(false); // Done checking session
      }, 500);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshSession = async () => {
    // TODO: Future refresh logic if handling manual token rotation
    console.log("Refresh session placeholder called");
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
