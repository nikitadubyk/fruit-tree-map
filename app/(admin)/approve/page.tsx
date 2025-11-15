'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Table, Heading, Button } from '@radix-ui/themes';

import { ROUTES } from '@/config';
import { UserRole } from '@/types';
import { useTrees } from '@/hooks';
import { Tree } from '@/app/generated/prisma';
import { useUserStore, useTreeNavigationStore } from '@/store';
import { TreeDetailsDialog, UpdateStatusButtons, Loader } from '@/components';

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useTrees('pending');
  const user = useUserStore((store) => store.user);
  const [selectedTree, setSelectedTree] = useState<Tree>();
  const setTargetTree = useTreeNavigationStore((state) => state.setTargetTree);

  const isEmpty = data?.length === 0;
  const isAdmin = user?.role === UserRole.Admin;

  if (user?.role && !isAdmin) {
    router.push(ROUTES.HOME);
  }

  const handleNavigateToTree = (tree: Tree, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetTree(tree);
    router.push(ROUTES.HOME);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <Loader text="Загрузка деревьев..." />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <Button onClick={() => router.push(ROUTES.HOME)}>
            Вернуться на главную
          </Button>
        </div>

        <Heading mb="2" size="4">
          Деревья на проверке
        </Heading>

        {isEmpty && (
          <Heading mb="2" size="2">
            Опа, все деревья отображаются на карте
          </Heading>
        )}
        {!isEmpty && (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Имя</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Дерево</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Координаты</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Действия</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.map((value) => (
                <Table.Row key={value.id}>
                  <Table.RowHeaderCell>
                    {value?.creator?.name || value?.creator?.email}
                  </Table.RowHeaderCell>
                  <Table.Cell>{value?.species}</Table.Cell>
                  <Table.Cell>
                    {value.latitude?.toFixed(6)}, {value.longitude?.toFixed(6)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setSelectedTree(value)}>
                        Детали
                      </Button>
                      <Button
                        size="2"
                        variant="soft"
                        onClick={(e) => handleNavigateToTree(value, e)}
                      >
                        <MapPin className="w-4 h-4" />
                        На карте
                      </Button>
                      <UpdateStatusButtons isMinify tree={value} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </div>

      <TreeDetailsDialog
        hideButtons
        tree={selectedTree!}
        open={!!selectedTree}
        onOpenChange={(open) => {
          if (!open) setSelectedTree(undefined);
        }}
      />
    </>
  );
}
