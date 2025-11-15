import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

import { defaultMetadata } from '@/config';

import './globals.css';
import { Providers } from './providers';
import { AuthLayout } from './auth-layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthLayout>
          <Providers>{children}</Providers>
        </AuthLayout>
      </body>
    </html>
  );
}
