import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/auth.service";
import { permissionService } from "@/services/permission.service";
import type { AuthUser, Permission } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  hasPermission: (moduleName: string, action: "create" | "read" | "update" | "delete") => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,   
      initialized: false,
      login: async (email, password) => {
        const res = await authService.login({ email, password });
        const user = JSON.parse(JSON.stringify(res.data.user));
        set({ user, isAuthenticated: true });
        return user;
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
          const user = JSON.parse(JSON.stringify(res.data.user));

          // Ensure permissions are loaded (some /auth/me responses may not include them)
          if (user && user._id && (!user.permissions || user.permissions.length === 0)) {
            try {
              const permRes = await permissionService.getUserPermissions(user._id);
              user.permissions = permRes.data.permissions;
            } catch {
              // Permission fetch failed; continue with empty permissions
            }
          }

          set({ user, isAuthenticated: true, initialized: true });
        } catch (error) {
          // If we already have a user in the store (from localStorage), keep them
          // authenticated. The backend will reject requests if the token is invalid.
          const existingUser = get().user;
          if (existingUser) {
            set({ isAuthenticated: true, initialized: true });
          } else {
            set({ user: null, isAuthenticated: false, initialized: true });
          }
        } finally {
          set({ isLoading: false });
        }
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      hasPermission: (moduleName, action) => {
        const { user } = get();
        if (!user) return false;

        // Admin has full access
        if (user.role === "admin") return true;

        const permission = user.permissions?.find((p: Permission) => p.module?.name === moduleName);
        if (!permission) return false;

        const actionKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof Permission;
        return Boolean(permission[actionKey]);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
