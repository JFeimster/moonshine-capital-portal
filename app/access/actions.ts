'use server';

import { redirect } from 'next/navigation';
import { createSession, timingSafeEqual, getSession, destroySession } from '@/lib/auth';

export async function authenticate(prevState: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  const code = formData.get('code') as string;
  const returnTo = formData.get('returnTo') as string;

  if (!code) {
    return { error: 'Access code required' };
  }

  const adminPassword = process.env.ADMIN_ACCESS_PASSWORD;
  const portalPassword = process.env.PORTAL_ACCESS_PASSWORD;

  if (!process.env.AUTH_SESSION_SECRET || !adminPassword) {
    return { error: 'System configuration missing' }; // Fail closed
  }

  // Timing safe comparisons
  const isAdmin = timingSafeEqual(code, adminPassword);

  // Portal password is optional
  const isPortal = portalPassword ? timingSafeEqual(code, portalPassword) : false;

  if (isAdmin) {
    await createSession('admin');
  } else if (isPortal) {
    await createSession('portal');
  } else {
    // Artificial delay to mitigate timing attacks slightly
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
    return { error: 'Invalid access code' };
  }

  // Handle redirect securely
  if (returnTo && (returnTo.startsWith('/admin') || returnTo.startsWith('/portal'))) {
    redirect(returnTo);
  } else {
    redirect(isAdmin ? '/admin' : '/portal');
  }
}

export async function signOut() {
  await destroySession();
  redirect('/access');
}
