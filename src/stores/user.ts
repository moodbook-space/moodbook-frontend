import { create } from 'zustand';

interface UserStore {
  id: number;
  setId: (id: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  id: 0,
  setId: (id: number) => set({ id }),
}));
