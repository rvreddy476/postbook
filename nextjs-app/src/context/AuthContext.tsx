"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "postbook_token";
const AUTH_USER_KEY = "postbook_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (emailOrPhone: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      router.push("/feed");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const result = await response.json();
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user));
      router.push("/feed");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    router.push("/");
  }, [router]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          logout();
        }
      } catch {
        logout();
      }
    };

    verifyToken();
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
