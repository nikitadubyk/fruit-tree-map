import { api } from '@/api';
import { User } from '@/types';
import { URL } from '@/config';

import { UpdateProfileData } from './types';
export * from './types';

export const userApi = {
  updateProfile: async (
    userData: UpdateProfileData
  ): Promise<{ user: User }> => {
    const { data } = await api.post(URL.UPDATE_PROFILE, userData);
    return data;
  },
};
