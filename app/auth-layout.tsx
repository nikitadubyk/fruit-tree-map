'use client';

import { useEffect, PropsWithChildren } from 'react';

import { getUser } from '@/utils';
import { useUserStore } from '@/store';

export const AuthLayout = ({ children }: PropsWithChildren) => {
  const updateUser = useUserStore((state) => state.updateUser);

  useEffect(() => {
    const user = getUser();
    if (user) {
      updateUser(user);
    }
  }, [updateUser]);

  return <>{children}</>;
};
