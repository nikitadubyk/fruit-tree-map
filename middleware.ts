import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/api/auth'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Требуется авторизация' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-email', payload.email as string);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Недействительный токен' },
      { status: 401 }
    );
  }
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/api/:path*'],
};
