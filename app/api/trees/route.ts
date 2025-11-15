import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib';
import { UserRole } from '@/types';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status') as
    | 'pending'
    | 'approved'
    | null;

  if (!userId) {
    const trees = await prisma.tree.findMany({
      include: { creator: true },
      where: { status: 'approved' },
    });
    return NextResponse.json(trees);
  }

  const user = await prisma.user.findFirst({ where: { id: Number(userId) } });

  if (!user) {
    return NextResponse.json(
      { error: 'Не найден пользователь' },
      { status: 400 }
    );
  }

  const isAdmin = user.role === UserRole.Admin;

  if (statusParam && isAdmin) {
    const trees = await prisma.tree.findMany({
      include: { creator: true },
      where: { status: statusParam },
    });
    return NextResponse.json(trees);
  }

  const trees = await prisma.tree.findMany({
    include: { creator: true },
    where: { status: isAdmin ? { in: ['approved', 'pending'] } : 'approved' },
  });

  return NextResponse.json(trees);
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    const body = await request.json();
    const { latitude, longitude, species, note } = body;

    if (!latitude || !longitude || !species) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({ where: { id: Number(userId) } });

    if (!user) {
      return NextResponse.json(
        { error: 'Не найден пользователь' },
        { status: 400 }
      );
    }

    const isAdmin = user.role === UserRole.Admin;

    const tree = await prisma.tree.create({
      data: {
        species: species.trim(),
        creatorId: Number(userId),
        note: note?.trim() || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: isAdmin ? 'approved' : 'pending',
      },
    });

    return NextResponse.json(tree, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании дерева:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const treeId = searchParams.get('id');

    if (!treeId) {
      return NextResponse.json(
        { error: 'ID дерева не указан' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const tree = await prisma.tree.findUnique({
      where: { id: Number(treeId) },
    });

    if (!tree) {
      return NextResponse.json({ error: 'Дерево не найдено' }, { status: 404 });
    }

    const user = await prisma.user.findFirst({ where: { id: Number(userId) } });

    if (!user) {
      return NextResponse.json(
        { error: 'Не найден пользователь' },
        { status: 400 }
      );
    }

    const isAdmin = user.role === UserRole.Admin;

    if (!isAdmin || tree.creatorId !== Number(userId)) {
      return NextResponse.json(
        { error: 'Только автор может удалить это дерево' },
        { status: 403 }
      );
    }

    await prisma.tree.delete({
      where: { id: Number(treeId) },
    });

    return NextResponse.json(
      { message: 'Дерево успешно удалено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении дерева:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
