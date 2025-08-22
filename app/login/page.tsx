'use client';

import axios from 'axios';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Text, Card, Box } from '@radix-ui/themes';
import { EnvelopeClosedIcon, PaperPlaneIcon } from '@radix-ui/react-icons';

import { InputField } from '@/components';
import { MESSAGES, URL } from '@/config';

import { schema, FormValues } from './config';

export default function LoginPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await axios.post(URL.SEND_LINK, { email: values.email });

      if (data?.data?.id) {
        toast.success(`Письмо на почту ${MESSAGES.SUCCESS_SEND}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Произошла ошибка при отправке письма');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <FormProvider {...form}>
        <Card className="w-full sm:max-w-md m-4 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col mb-6 items-center">
              <Box className="mb-4 p-3 rounded-full bg-blue-100">
                <EnvelopeClosedIcon className="w-8 h-8 text-blue-600" />
              </Box>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Вход в приложение
              </h1>
              <Text size="2" className="text-gray-600 text-center">
                Введите ваш email, и мы отправим ссылку для входа
              </Text>
            </div>

            <InputField
              name="email"
              type="email"
              label="Email адрес"
              placeholder="Введите ваш email"
            />

            <Box className="mt-6">
              <Button
                size="3"
                color="blue"
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={!isDirty || isSubmitting}
              >
                <div className="flex gap-2 items-center">
                  <PaperPlaneIcon />
                  {isSubmitting ? 'Отправляем...' : 'Отправить ссылку'}
                </div>
              </Button>
            </Box>

            <Box className="mt-6 text-center">
              <Text size="1" className="text-gray-500">
                Ссылка будет действительна в течение 15 минут
              </Text>
            </Box>
          </form>
        </Card>
      </FormProvider>
    </div>
  );
}
