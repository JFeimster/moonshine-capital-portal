import { cookies } from 'next/headers';

export type Role = 'admin' | 'portal';

export interface SessionPayload {
  role: Role;
  exp: number;
}

const SESSION_COOKIE_NAME = 'mc_portal_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Helper to get crypto API in different environments
function getCrypto() {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return crypto;
  }
  // Node.js fallback for older environments if needed
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API not available');
}

async function getSignatureKey(secret: string) {
  const encoder = new TextEncoder();
  return getCrypto().subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function bufferToBase64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  try {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (base64.length % 4)) % 4;
    const padded = base64 + '='.repeat(padLen);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    throw new Error('Invalid base64 string');
  }
}

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const header = bufferToBase64url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const encodedPayload = bufferToBase64url(encoder.encode(JSON.stringify(payload)));

  const dataToSign = `${header}.${encodedPayload}`;
  const key = await getSignatureKey(secret);

  const signatureBuffer = await getCrypto().subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign)
  );

  const signature = bufferToBase64url(signatureBuffer);
  return `${dataToSign}.${signature}`;
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  if (typeof token !== 'string' || !token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const dataToVerify = `${header}.${payload}`;
  const key = await getSignatureKey(secret);
  const encoder = new TextEncoder();

  try {
    const signatureBuffer = base64urlToBuffer(signature);

    const isValid = await getCrypto().subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      encoder.encode(dataToVerify)
    );

    if (!isValid) return null;

    const decodedPayload = JSON.parse(new TextDecoder().decode(base64urlToBuffer(payload)));

    if (typeof decodedPayload !== 'object' || decodedPayload === null) return null;

    const { role, exp } = decodedPayload;

    if (role !== 'admin' && role !== 'portal') return null;
    if (typeof exp !== 'number' || !Number.isFinite(exp)) return null;

    if (exp < Date.now()) return null; // Expired

    return { role, exp };
  } catch (error) {
    return null;
  }
}

// Timing safe equality check for passwords
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function getSession(): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) return null;

  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  return verifySession(sessionToken, secret);
}

export async function createSession(role: Role) {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) {
    throw new Error('Missing AUTH_SESSION_SECRET');
  }

  const exp = Date.now() + SESSION_DURATION_MS;
  const payload: SessionPayload = { role, exp };
  const token = await signSession(payload, secret);

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
