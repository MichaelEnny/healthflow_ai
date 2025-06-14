"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STATUS_KEY = 'healthflow_auth_status';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuthStatus = localStorage.getItem(AUTH_STATUS_KEY);
      if (storedAuthStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      // localStorage might not be available (e.g. SSR, private browsing)
      console.warn("Could not access localStorage for auth status:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((_token?: string) => {
    try {
      localStorage.setItem(AUTH_STATUS_KEY, 'true');
    } catch (error) {
      console.warn("Could not set localStorage for auth status:", error);
    }
    setIsAuthenticated(true);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STATUS_KEY);
    } catch (error) {
      console.warn("Could not remove localStorage for auth status:", error);
    }
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
