'use client';

import { create } from 'zustand';

import { User } from '@/types';
import { clearAll } from '@/utils';

export interface UserState {
  user?: User;
  logOut: () => void;
  isLoggedIn: boolean;
  updateUser: (user?: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  isLoggedIn: false,
  updateUser: (user) => set(() => ({ user, isLoggedIn: !!user })),
  logOut: () => {
    set(() => ({ user: undefined, isLoggedIn: false }));
    clearAll();
  },
}));
