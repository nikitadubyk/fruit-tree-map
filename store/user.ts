'use client';

import { create } from 'zustand';
import toast from 'react-hot-toast';

import { api } from '@/api';
import { User } from '@/types';
import { MESSAGES, URL } from '@/config';
import { clearAll, saveUser } from '@/utils';

export interface UserState {
  user?: User;
  logOut: () => void;
  isLoggedIn: boolean;
  updateUser: (user?: User) => void;
  updateProfile: (user: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  isLoggedIn: false,
  updateUser: (user) => set(() => ({ user, isLoggedIn: !!user })),
  updateProfile: async (user) => {
    try {
      const { data } = await api.post(URL.UPDATE_PROFILE, user);
      if (data?.user) {
        set(() => ({ user: data.user, isLoggedIn: true }));
        saveUser(data.user);
        toast.success(`Профиль ${MESSAGES.SUCCESS_UPDATED}`);
      }

      return data;
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    }
  },
  logOut: () => {
    set(() => ({ user: undefined, isLoggedIn: false }));
    clearAll();
  },
}));
