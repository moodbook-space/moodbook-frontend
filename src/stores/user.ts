import { Role } from '@/apis/user';
import { Mood } from '@/pages/SelectMood/constants';
import { create } from 'zustand';

interface UserStore {
  id: number;
  setId: (id: number) => void;
  role: Role;
  setRole: (role: Role) => void;
  moods: Mood[];
  setMoods: (moods: Mood[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  id: 0,
  setId: (id: number) => set({ id }),
  role: 'USER',
  setRole: (role: Role) => set({ role }),
  moods: [],
  setMoods: (moods: Mood[]) => set({ moods }),
}));

