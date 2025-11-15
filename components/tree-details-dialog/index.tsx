'use client';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Dialog, Button } from '@radix-ui/themes';
import {
  Trees,
  MapPin,
  Globe2,
  Trash2,
  Loader2,
  Calendar,
  FileText,
} from 'lucide-react';

import { UserRole } from '@/types';
import { useUserStore } from '@/store';
import { useDeleteTree } from '@/hooks';
import {
  formatDate,
  handleErrorMessage,
  getAddressFromCoordinates,
} from '@/utils';

import { ConfirmDeleteDialog } from '../confirm-delete-dialog';

import { InfoItem, TreeDetailsDialogProps } from './types';
import { UpdateStatusButtons } from '../update-status-buttons';

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
  hideButtons,
  onOpenChange,
}: TreeDetailsDialogProps) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const currentUser = useUserStore((state) => state.user);

  const { mutate: deleteTree, isPending: deleting } = useDeleteTree();

  const isAdmin = currentUser?.role === UserRole.Admin;
  const isShowApprove = isAdmin && tree?.status === 'pending';
  const isAuthor = tree && currentUser && tree.creatorId === currentUser.id;

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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!tree) return;

    deleteTree(tree.id, {
      onSuccess: () => {
        toast.success('Дерево успешно удалено');
        setShowDeleteDialog(false);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
    });
  };

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
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
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

          {isShowApprove && (
            <div className="w-full mt-4">
              <UpdateStatusButtons
                tree={tree}
                onSuccess={() => onOpenChange(false)}
              />
            </div>
          )}

          {!hideButtons && (
            <div className="flex justify-between mt-6 pt-4 border-t">
              {(isAuthor || isAdmin) && (
                <Button color="red" variant="soft" onClick={handleDeleteClick}>
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </Button>
              )}

              <Dialog.Close className={!isAuthor ? 'ml-auto' : ''}>
                <Button variant="soft" color="gray">
                  Закрыть
                </Button>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Root>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        loading={deleting}
        treeName={tree.species}
        onConfirm={handleConfirmDelete}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
};
