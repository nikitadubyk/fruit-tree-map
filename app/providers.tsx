'use client';

import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';
import { PropsWithChildren } from 'react';

export const Providers = ({ children }: PropsWithChildren) => (
  <Theme>
    {children}
    <Toaster position="top-right" />
  </Theme>
);
