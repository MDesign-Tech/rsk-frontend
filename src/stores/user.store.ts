import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userService } from "@/services/user.service";
import type { User } from "@/types";

interface UserState {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "admin";
  }) => Promise<void>;
  updateUser: (
    id: string,
    data: {
      name: string;
      email: string;
      phone?: string;
      role?: "admin";
      password?: string;
    }
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      isLoading: false,
      fetchUsers: async () => {
        set({ isLoading: true });
        try {
          const res = await userService.getAll();
          const users = res.data.users.map((u) => JSON.parse(JSON.stringify(u)));
          set({ users });
        } finally {
          set({ isLoading: false });
        }
      },
      createUser: async (data) => {
        const res = await userService.create(data);
        const user = JSON.parse(JSON.stringify(res.data.user));
        set({ users: [user, ...get().users] });
      },
      updateUser: async (id, data) => {
        const res = await userService.update(id, data);
        const user = JSON.parse(JSON.stringify(res.data.user));
        set({ users: get().users.map((u) => (u._id === id ? user : u)) });
      },
      deleteUser: async (id) => {
        await userService.remove(id);
        set({ users: get().users.filter((u) => u._id !== id) });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ users: state.users }),
    }
  )
);
