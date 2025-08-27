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
