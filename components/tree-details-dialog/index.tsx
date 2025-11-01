'use client';

import { useState, useEffect } from 'react';
import { Dialog, Button } from '@radix-ui/themes';
import {
  Trees,
  MapPin,
  Globe2,
  Loader2,
  Calendar,
  FileText,
} from 'lucide-react';

import { formatDate, getAddressFromCoordinates } from '@/utils';

import { InfoItem, TreeDetailsDialogProps } from './types';

const Info = ({ icon, title, value }: InfoItem) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <p className="text-sm font-medium text-gray-600">{title}</p>
    </div>
    <p className="text-base text-gray-900">{value}</p>
  </div>
);

export const TreeDetailsDialog = ({
  tree,
  open,
  onOpenChange,
}: TreeDetailsDialogProps) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tree || !open) {
      setAddress('');
      return;
    }

    const fetchAddress = async () => {
      setLoading(true);
      const result = await getAddressFromCoordinates(
        tree.latitude,
        tree.longitude
      );
      setAddress(result);
      setLoading(false);
    };

    fetchAddress();
  }, [tree, open]);

  if (!tree) return null;

  const infoItems: InfoItem[] = [
    {
      title: 'Вид дерева',
      value: tree.species,
      icon: <Trees className="w-4 h-4 text-green-600" />,
    },
    ...(tree.note
      ? [
          {
            value: tree.note,
            title: 'Примечание',
            icon: <FileText className="w-4 h-4 text-amber-600" />,
          },
        ]
      : []),
    {
      title: 'Адрес',
      value: loading ? 'Определение адреса...' : address,
      icon: loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
      ) : (
        <MapPin className="w-4 h-4 text-blue-600" />
      ),
    },
    {
      title: 'Координаты',
      icon: <Globe2 className="w-4 h-4 text-indigo-600" />,
      value: `${tree.latitude.toFixed(6)}, ${tree.longitude.toFixed(6)}`,
    },
    {
      title: 'Добавлено',
      value: formatDate(tree.createdAt),
      icon: <Calendar className="w-4 h-4 text-purple-600" />,
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title className="mb-5 text-xl font-semibold">
          Информация о дереве
        </Dialog.Title>

        <div className="flex flex-col gap-3">
          {infoItems.map((item, index) => (
            <Info
              key={index}
              icon={item.icon}
              title={item.title}
              value={item.value}
            />
          ))}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Закрыть
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
