'use client';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Button, Dialog } from '@radix-ui/themes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { X, MapPin, Trees, FileText, Loader2 } from 'lucide-react';

import { api } from '@/api';
import { useTreeStore } from '@/store';
import { MESSAGES, URL } from '@/config';
import { handleErrorMessage, getAddressFromCoordinates } from '@/utils';

import { InputField } from '../input-fields';

import { AddTreeDialogProps } from './types';
import { schema, FormValues } from './config';

export const AddTreeDialog = ({
  open,
  marker,
  onOpenChange,
}: AddTreeDialogProps) => {
  const [address, setAddress] = useState('');
  const addTree = useTreeStore((state) => state.addTree);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = form;

  useEffect(() => {
    if (!marker || !open) {
      setAddress('');
      return;
    }

    const fetchAddress = async () => {
      setLoadingAddress(true);
      const result = await getAddressFromCoordinates(marker.lat, marker.lng);
      setAddress(result);
      setLoadingAddress(false);
    };

    fetchAddress();
  }, [marker, open]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post(URL.GET_TREES, {
        ...values,
        latitude: marker?.lat,
        longitude: marker?.lng,
      });

      if (data?.id) {
        addTree(data);
        toast.success(`Дерево ${MESSAGES.SUCCESS_ADDED}`);
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-[450px]">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <Dialog.Title className="text-xl font-semibold mb-1">
              Добавить дерево
            </Dialog.Title>
            <p className="text-sm text-gray-500">
              Заполните информацию о новом дереве
            </p>
          </div>

          <Dialog.Close>
            <Button variant="ghost" color="gray" size="2">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 mb-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-gray-600">Адрес</p>
            </div>
            {loadingAddress ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <p className="text-sm text-gray-400">Определение адреса...</p>
              </div>
            ) : (
              <p className="text-sm text-gray-800">{address}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Координаты</p>
            <p className="text-sm text-gray-600 font-mono">
              {marker?.lat.toFixed(6)}, {marker?.lng.toFixed(6)}
            </p>
          </div>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trees className="w-4 h-4 text-green-600" />
                  <label className="text-sm font-medium">Вид дерева *</label>
                </div>
                <InputField
                  name="species"
                  placeholder="Например: Вишня, Слива, Орех"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <label className="text-sm font-medium">
                    Заметки (необязательно)
                  </label>
                </div>
                <InputField
                  name="note"
                  placeholder="Дополнительная информация о дереве"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Dialog.Close>
                <Button type="button" variant="soft" color="gray">
                  Отмена
                </Button>
              </Dialog.Close>

              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                color="green"
              >
                {isSubmitting ? (
                  <div className="flex gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Добавление...
                  </div>
                ) : (
                  'Добавить дерево'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};
