import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  signSession,
  verifySession,
  timingSafeEqual,
  type Role,
  type SessionPayload,
} from './session-token';

export {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  signSession,
  verifySession,
  timingSafeEqual,
};
export type { Role, SessionPayload };

function hasRequiredAccessConfig(): boolean {
  return Boolean(
    process.env.AUTH_SESSION_SECRET && process.env.ADMIN_ACCESS_PASSWORD
  );
}

export async function getSession(): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || !hasRequiredAccessConfig()) return null;

  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  return verifySession(sessionToken, secret);
}

export async function createSession(role: Role) {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || !hasRequiredAccessConfig()) {
    throw new Error('Missing required access configuration');
  }

  const exp = Date.now() + SESSION_DURATION_MS;
  const token = await signSession({ role, exp }, secret);
  const cookieStore = cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(exp),
    path: '/',
  });
}

export async function destroySession() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
