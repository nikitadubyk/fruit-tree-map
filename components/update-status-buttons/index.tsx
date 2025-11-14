import toast from 'react-hot-toast';
import { Button } from '@radix-ui/themes';

import { useUserStore } from '@/store';
import { handleErrorMessage } from '@/utils';
import { useUpdateTreeStatus } from '@/hooks';

import { UpdateStatusButtonsProps } from './types';
import { UserRole } from '@/types';

export const UpdateStatusButtons = ({
  tree,
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

  console.log('tree', tree);
  if (!isAdmin && tree.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2 w-full">
      <Button
        size="3"
        color="green"
        disabled={isPending}
        onClick={() => handleStatusChange('approved')}
      >
        Подтвердить
      </Button>
      <Button
        size="3"
        color="red"
        disabled={isPending}
        onClick={() => handleStatusChange('rejected')}
      >
        Отклонить
      </Button>
    </div>
  );
};
