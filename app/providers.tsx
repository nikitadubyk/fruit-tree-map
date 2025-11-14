'use client';

import { useState } from 'react';
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';
import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        {children}
        <Toaster position="top-right" />
      </Theme>
    </QueryClientProvider>
  );
};
