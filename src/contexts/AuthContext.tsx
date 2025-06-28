
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { RegisteredUser } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: Pick<RegisteredUser, 'email'> | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  deleteAccount: () => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STATUS_KEY = 'healthflow_auth_status';
const USERS_KEY = 'healthflow_users'; // For storing registered users
const CURRENT_USER_KEY = 'healthflow_current_user'; // For storing current user's email
const HEALTH_RECORDS_KEY = 'healthflow_health_records';
const APPOINTMENTS_KEY = 'healthflow_appointments';


// Basic password hashing simulation (DO NOT USE IN PRODUCTION)
// A real app would use a strong hashing library like bcrypt on the backend.
async function mockHashPassword(password: string): Promise<string> {
  // Simulate async hashing
  await new Promise(resolve => setTimeout(resolve, 50));
  // This is NOT secure. Just for demonstration.
  return `hashed_${password}_mock`;
}

async function mockVerifyPassword(password: string, hash: string): Promise<boolean> {
  // Simulate async verification
  await new Promise(resolve => setTimeout(resolve, 50));
  return hash === `hashed_${password}_mock`;
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Pick<RegisteredUser, 'email'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuthStatus = localStorage.getItem(AUTH_STATUS_KEY);
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedAuthStatus === 'true' && storedUser) {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.warn("Could not access localStorage for auth status:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const existingUsersRaw = localStorage.getItem(USERS_KEY);
      const existingUsers: RegisteredUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
      
      if (existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        setIsLoading(false);
        return { success: false, message: "Email already registered." };
      }

      const passwordHash = await mockHashPassword(password);
      const newUser: RegisteredUser = { email: email.toLowerCase(), passwordHash, userId: `user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}` };
      existingUsers.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return { success: false, message: "Registration failed. Please try again." };
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const existingUsersRaw = localStorage.getItem(USERS_KEY);
      const existingUsers: RegisteredUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
      
      const user = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user) {
        const passwordMatches = await mockVerifyPassword(password, user.passwordHash);
        if (passwordMatches) {
          localStorage.setItem(AUTH_STATUS_KEY, 'true');
          const userData = { email: user.email, userId: user.userId };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
          setIsAuthenticated(true);
          setCurrentUser(userData);
          router.push('/dashboard');
          setIsLoading(false);
          return { success: true };
        }
      }
      setIsLoading(false);
      return { success: false, message: "Invalid email or password." };
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return { success: false, message: "Login failed. Please try again." };
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STATUS_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      // Optionally clear app-specific data on logout if it's user-specific
      // localStorage.removeItem(HEALTH_RECORDS_KEY); 
      // localStorage.removeItem(APPOINTMENTS_KEY);
    } catch (error) {
      console.warn("Could not remove localStorage for auth status:", error);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push('/login');
  }, [router]);

  const deleteAccount = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    if (!currentUser || !currentUser.email) {
      setIsLoading(false);
      return { success: false, message: "No user logged in to delete." };
    }
    try {
      const existingUsersRaw = localStorage.getItem(USERS_KEY);
      let existingUsers: RegisteredUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
      
      // Filter out the current user
      existingUsers = existingUsers.filter(u => u.email.toLowerCase() !== currentUser.email.toLowerCase());
      localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));

      // For a real app, you'd also delete all user-specific data from a database.
      // Here, we'll clear the example localStorage items if they were user-specific.
      // If health records and appointments are tied to users, they should be cleared too.
      // This part needs careful consideration based on how data is structured.
      // For simplicity, let's assume they are global for now or handled per user if userId was stored with them.
      // If HEALTH_RECORDS_KEY and APPOINTMENTS_KEY store data for ALL users, don't remove them.
      // If they store data ONLY for the logged-in user, or are filtered by userId, then remove/filter them.
      // For this prototype, we are not associating health records/appointments with specific user IDs.
      // So, we won't clear them here as it would affect all users in the prototype.
      // A real implementation would filter/delete based on user.userId.

      logout(); // This will clear auth status, current user, and redirect
      setIsLoading(false);
      return { success: true, message: "Account deleted successfully." };
    } catch (error) {
      console.error("Delete account error:", error);
      setIsLoading(false);
      return { success: false, message: "Account deletion failed. Please try again." };
    }
  }, [currentUser, logout]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, register, deleteAccount, isLoading }}>
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

