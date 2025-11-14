import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser && authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            authService.logout();
          }
        } catch (err) {
          authService.logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: response.message };
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.success) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: response.message };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
