'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@radix-ui/themes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { useUserStore } from '@/store';
import { InputField } from '@/components';

import { schema, FormValues } from './config';

export default function Profile() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = form;

  const onSubmit = (values: FormValues) =>
    updateProfile({ ...user, ...values });

  return (
    <div className="relative min-h-screen flex justify-center items-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/60 shadow-lg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Button
              color="gray"
              variant="ghost"
              className="p-2"
              onClick={() => router.back()}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Профиль
            </h1>
          </div>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <InputField
                name="name"
                label="Имя"
                placeholder="Введите имя"
                className="bg-white/80 dark:bg-gray-800/70"
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="px-6"
                  disabled={!isDirty || isSubmitting}
                >
                  Сохранить
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
}
