import { create } from "zustand";
import { authService } from "@/services/auth.service";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  initialized: false,
  login: async (email, password) => {
    const res = await authService.login({ email, password });
    set({ user: res.data.user, isAuthenticated: true });
    return res.data.user;
  },
  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await authService.getMe();
      set({ user: res.data.user, isAuthenticated: true, initialized: true });
    } catch {
      set({ user: null, isAuthenticated: false, initialized: true });
    } finally {
      set({ isLoading: false });
    }
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
