'use server';

import { redirect } from 'next/navigation';
import {
  createSession,
  destroySession,
  timingSafeEqual,
  type Role,
} from '@/lib/auth';
import { resolveAuthorizedReturnTo } from '@/lib/permissions';

export async function authenticate(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const code = formData.get('code');
  const returnTo = formData.get('returnTo');

  if (typeof code !== 'string' || !code) {
    return { error: 'Access code required' };
  }

  const adminPassword = process.env.ADMIN_ACCESS_PASSWORD;
  const portalPassword = process.env.PORTAL_ACCESS_PASSWORD;

  if (!process.env.AUTH_SESSION_SECRET || !adminPassword) {
    return { error: 'System configuration missing' };
  }

  const isAdmin = timingSafeEqual(code, adminPassword);
  const isPortal = portalPassword
    ? timingSafeEqual(code, portalPassword)
    : false;

  let role: Role | null = null;
  if (isAdmin) {
    role = 'admin';
  } else if (isPortal) {
    role = 'portal';
  }

  if (!role) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));
    return { error: 'Invalid access code' };
  }

  await createSession(role);

  redirect(
    resolveAuthorizedReturnTo(
      role,
      typeof returnTo === 'string' ? returnTo : undefined
    )
  );
}

export async function signOut() {
  await destroySession();
  redirect('/access');
}
