'use client';

import { Theme } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';

export const Providers = ({ children }: PropsWithChildren) => (
  <SessionProvider>
    <Theme>{children}</Theme>
  </SessionProvider>
);
