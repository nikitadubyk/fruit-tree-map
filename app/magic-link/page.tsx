'use client';

import axios from 'axios';
import Link from 'next/link';
import { Button } from '@radix-ui/themes';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { ROUTES, URL } from '@/config';
import { saveTokens, saveUser } from '@/utils';

interface AuthResponse {
  success: boolean;
  user: {
    id: number;
    email: string;
    name?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export default function MagicLinkPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const verifyToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<AuthResponse>(
        URL.LINK_CALLBACK.replace(':token', token!)
      );

      const { user, tokens } = response.data;

      saveUser(user);
      saveTokens(tokens);

      router.push(ROUTES.HOME);
    } catch (err) {
      let errorMessage = 'Неизвестная ошибка';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || 'Ошибка аутентификации';
      }

      setError(errorMessage);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) {
      return router.push(ROUTES.HOME);
    }

    verifyToken();
  }, [router, token, verifyToken]);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Завершаем вход в систему...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4 items-center">
          <ExclamationTriangleIcon className="text-red-600 w-10 h-10" />
          <h2 className="text-xl font-semibold text-gray-900 ">Ошибка входа</h2>
          <p className="text-gray-600 ">{error}</p>

          <Button asChild color="blue" size="3">
            <Link href={ROUTES.HOME}>Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Проверяем ссылку...</p>
      </div>
    </div>
  );
}
