'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getUser } from '@/utils';
import { ROUTES } from '@/config';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.replace(ROUTES.AUTH.LOGIN);
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
