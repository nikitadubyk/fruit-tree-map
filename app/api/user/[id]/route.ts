import { NextResponse } from 'next/server';
import { UserRole } from '@/app/generated/prisma';

import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Роль обязательное поле' },
        { status: 400 }
      );
    }

    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Роль должна быть одной из: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: role as UserRole },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user role:', error);

    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Пользователь не найден' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Не удалось обновить роль пользователя' },
      { status: 500 }
    );
  }
}
