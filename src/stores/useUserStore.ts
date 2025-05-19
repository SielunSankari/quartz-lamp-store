// stores/useUserStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type User = {
  username: string;
};

type State = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<State>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
    }),
    {
      name: 'user-storage', // Уникальный ключ для localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
