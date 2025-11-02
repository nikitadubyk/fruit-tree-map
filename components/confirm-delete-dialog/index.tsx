'use client';

import { Loader2 } from 'lucide-react';
import { Dialog, Button } from '@radix-ui/themes';

import { ConfirmDeleteDialogProps } from './types';

export const ConfirmDeleteDialog = ({
  open,
  loading,
  treeName,
  onConfirm,
  onOpenChange,
}: ConfirmDeleteDialogProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-[400px]">
      <div className="flex flex-col">
        <Dialog.Title className="text-xl font-semibold mb-2">
          Удалить дерево?
        </Dialog.Title>

        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить дерево{' '}
          <span className="font-semibold text-gray-900">{treeName}</span>? Это
          действие нельзя будет отменить.
        </p>

        <div className="flex gap-3 w-full justify-end">
          <Dialog.Close className="flex-1">
            <Button
              size="3"
              color="gray"
              variant="soft"
              disabled={loading}
              className="w-full"
            >
              Отмена
            </Button>
          </Dialog.Close>

          <Button
            size="3"
            color="red"
            disabled={loading}
            className="flex-1"
            onClick={onConfirm}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Удаление...
              </>
            ) : (
              'Удалить'
            )}
          </Button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
);
