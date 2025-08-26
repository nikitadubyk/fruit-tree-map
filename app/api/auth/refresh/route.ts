import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const jwtSecret = process.env.JWT_SECRET || '';

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined');
}

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Отсутствует refreshToken' },
        { status: 401 }
      );
    }

    try {
      const payload = jwt.verify(refreshToken, jwtSecret) as {
        userId: string;
        email: string;
      };

      const newAccessToken = jwt.sign(
        { userId: payload.userId, email: payload.email },
        jwtSecret,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId: payload.userId, email: payload.email },
        jwtSecret,
        { expiresIn: '30d' }
      );

      return NextResponse.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: 'Недействительный refreshToken' },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
