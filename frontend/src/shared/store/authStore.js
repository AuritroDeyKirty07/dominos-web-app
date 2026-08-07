import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      login: (userData, token) => set({
        user: userData,
        token: token,
        role: userData.roleId?.name || userData.role, 
        isAuthenticated: true,
      }),

      logout: () => set({
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
      }),
      
      updateUser: (userData) => set({
        user: userData,
      }),
    }),
    {
      name: 'auth-storage', 
    }
  )
);
