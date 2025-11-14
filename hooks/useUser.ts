import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { MESSAGES } from '@/config';
import { useUserStore } from '@/store';
import { handleErrorMessage, saveUser } from '@/utils';
import { userApi, UpdateProfileData } from '@/lib/api/user';

export const USER_QUERY_KEY = ['user'] as const;

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useUserStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userApi.updateProfile(data),
    onSuccess: (response) => {
      if (response?.user) {
        updateUser(response.user);
        saveUser(response.user);
        toast.success(`Профиль ${MESSAGES.SUCCESS_UPDATED}`);
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      }
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error));
    },
  });
};
