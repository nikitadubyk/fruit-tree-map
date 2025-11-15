import toast from 'react-hot-toast';
import { Button } from '@radix-ui/themes';

import { useUserStore } from '@/store';
import { handleErrorMessage } from '@/utils';
import { useUpdateTreeStatus } from '@/hooks';

import { UpdateStatusButtonsProps } from './types';
import { UserRole } from '@/types';
import { CheckCircle } from 'lucide-react';
import { CrossCircledIcon } from '@radix-ui/react-icons';

export const UpdateStatusButtons = ({
  tree,
  isMinify,
  onSuccess,
}: UpdateStatusButtonsProps) => {
  const user = useUserStore((store) => store.user);
  const isAdmin = user?.role === UserRole.Admin;

  const { mutate: updateStatus, isPending } = useUpdateTreeStatus();

  const handleStatusChange = (status: 'approved' | 'rejected') => {
    updateStatus(
      { treeId: tree.id, status },
      {
        onSuccess: () => {
          toast.success('Статус успешно обновлен');
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(handleErrorMessage(error));
        },
      }
    );
  };

  if (!isAdmin && tree.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2 w-full">
      <Button
        color="green"
        disabled={isPending}
        size={isMinify ? '2' : '3'}
        onClick={() => handleStatusChange('approved')}
      >
        {isMinify ? <CheckCircle /> : 'Подтвердить'}
      </Button>
      <Button
        color="red"
        disabled={isPending}
        size={isMinify ? '2' : '3'}
        onClick={() => handleStatusChange('rejected')}
      >
        {isMinify ? <CrossCircledIcon width={24} height={24} /> : 'Отклонить'}
      </Button>
    </div>
  );
};
