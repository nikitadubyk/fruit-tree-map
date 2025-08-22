import crypto from 'crypto';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';

import { ROUTES } from '@/config';
import { prisma } from '@/lib';
import { MagicLinkEmail } from '@/components';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await prisma.magicLinkToken.create({
    data: { token, email, expiresAt },
  });

  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH.MAGIC_LINK}?token=${token}`;

  const emailHtml = await render(
    MagicLinkEmail({
      magicLink,
      userEmail: email,
    })
  );

  const response = await resend.emails.send({
    to: email,
    html: emailHtml,
    subject: 'Вход в приложение',
    from: 'onboarding@resend.dev',
  });

  return NextResponse.json(response);
}
