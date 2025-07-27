import { Mood } from '@/pages/SelectMood/constants';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserStore {
  id: number;
  setId: (id: number) => void;
  moods: Mood[];
  setMoods: (moods: Mood[]) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: 0,
      setId: (id: number) => set({ id }),
      moods: [],
      setMoods: (moods: Mood[]) => set({ moods }),
    }),
    {
      name: 'user-store-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
