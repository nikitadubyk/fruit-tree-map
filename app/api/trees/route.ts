import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib';

export async function GET() {
  const trees = await prisma.tree.findMany();
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

    const tree = await prisma.tree.create({
      data: {
        userId: Number(userId),
        species: species.trim(),
        note: note?.trim() || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
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

    if (tree.userId !== Number(userId)) {
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
