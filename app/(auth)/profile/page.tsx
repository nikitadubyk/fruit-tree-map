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
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            color="gray"
            variant="ghost"
            className="p-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-xl font-semibold">Профиль</h1>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField name="name" placeholder="Введите имя" label="Имя" />

            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                Сохранить
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
