import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/api/auth', '/api/tree'];

async function verifyAndAttachUser(req: NextRequest, token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-email', payload.email as string);

    return {
      success: true,
      response: NextResponse.next({ request: { headers: requestHeaders } }),
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return { success: false, error };
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (token) {
    const result = await verifyAndAttachUser(req, token);

    if (result.success) {
      return result.response;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = result.error as any;
    if (error?.code === 'ERR_JWT_EXPIRED') {
      return NextResponse.json({ error: 'Токен истек' }, { status: 401 });
    }

    if (!isPublicRoute) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/api/:path*'],
};
