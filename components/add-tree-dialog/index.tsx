import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Dialog } from '@radix-ui/themes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { api } from '@/api';
import { MESSAGES, URL } from '@/config';
import { handleErrorMessage } from '@/utils';

import { InputField } from '../input-fields';

import { AddTreeDialogProps } from './types';
import { schema, FormValues } from './config';

export const AddTreeDialog = ({
  open,
  marker,
  onOpenChange,
}: AddTreeDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post(URL.GET_TREES, {
        ...values,
        latitude: marker?.lat,
        longitude: marker?.lng,
      });

      if (data?.id) {
        toast.success(`Дерево ${MESSAGES.SUCCESS_ADDED}`);
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <div className="flex justify-between gap-2 mb-6">
          <Dialog.Title>Добавить дерево</Dialog.Title>

          <Dialog.Close>
            <Button>
              <X />
            </Button>
          </Dialog.Close>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <h4>
              Координаты дерева: {marker?.lat} - {marker?.lng}
            </h4>

            <div className="flex flex-col gap-4">
              <InputField
                name="species"
                label="Вид дерева"
                placeholder="Например: Вишня, Слива, Орех"
              />

              <InputField
                name="note"
                label="Заметки"
                placeholder="Дополнительная информация о дереве"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Dialog.Close>
                <Button color="red" variant="outline">
                  Закрыть
                </Button>
              </Dialog.Close>

              <Button type="submit" disabled={!isDirty || isSubmitting}>
                Добавить
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};
