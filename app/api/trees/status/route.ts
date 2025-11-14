import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib';
import { UserRole } from '@/types';

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({ where: { id: Number(userId) } });

    if (!user) {
      return NextResponse.json(
        { error: 'Не найден пользователь' },
        { status: 400 }
      );
    }

    if (user.role !== UserRole.Admin) {
      return NextResponse.json(
        { error: 'Только администратор может изменять статус деревьев' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { treeId, status } = body;

    if (!treeId || !status) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Недопустимый статус' },
        { status: 400 }
      );
    }

    const tree = await prisma.tree.findUnique({
      where: { id: Number(treeId) },
    });

    if (!tree) {
      return NextResponse.json({ error: 'Дерево не найдено' }, { status: 404 });
    }

    const updatedTree = await prisma.tree.update({
      where: { id: Number(treeId) },
      data: { status },
      include: { creator: true },
    });

    return NextResponse.json(updatedTree, { status: 200 });
  } catch (error) {
    console.error('Ошибка при изменении статуса дерева:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
