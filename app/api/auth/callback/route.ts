import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Отсутствует токен' }, { status: 401 });
  }

  const record = await prisma.magicLinkToken.findUnique({ where: { token } });

  if (!record || record.used || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Недействительный токен' },
      { status: 401 }
    );
  }

  await prisma.magicLinkToken.update({
    where: { token },
    data: { used: true },
  });

  let user = await prisma.user.findUnique({ where: { email: record.email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: record.email },
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, jwtSecret, {
    expiresIn: '30d',
  });

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });
}
