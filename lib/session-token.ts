export type Role = 'admin' | 'portal';

export interface SessionPayload {
  role: Role;
  exp: number;
}

export const SESSION_COOKIE_NAME = 'mc_portal_session';
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function getCrypto() {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return crypto;
  }

  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
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

  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  const binary = atob(base64 + '='.repeat(padLength));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

export async function signSession(
  payload: SessionPayload,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const header = bufferToBase64url(
    encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  );
  const encodedPayload = bufferToBase64url(
    encoder.encode(JSON.stringify(payload))
  );
  const dataToSign = `${header}.${encodedPayload}`;
  const key = await getSignatureKey(secret);
  const signatureBuffer = await getCrypto().subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign)
  );

  return `${dataToSign}.${bufferToBase64url(signatureBuffer)}`;
}

export async function verifySession(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  if (typeof token !== 'string' || !token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const encoder = new TextEncoder();

  try {
    const key = await getSignatureKey(secret);
    const isValid = await getCrypto().subtle.verify(
      'HMAC',
      key,
      base64urlToBuffer(signature),
      encoder.encode(`${header}.${payload}`)
    );

    if (!isValid) return null;

    const decodedPayload = JSON.parse(
      new TextDecoder().decode(base64urlToBuffer(payload))
    );

    if (typeof decodedPayload !== 'object' || decodedPayload === null) return null;

    const { role, exp } = decodedPayload;
    if (role !== 'admin' && role !== 'portal') return null;
    if (typeof exp !== 'number' || !Number.isFinite(exp)) return null;
    if (exp <= Date.now()) return null;

    return { role, exp };
  } catch {
    return null;
  }
}

export function timingSafeEqual(a: string, b: string): boolean {
  const maxLength = Math.max(a.length, b.length);
  let result = a.length ^ b.length;

  for (let index = 0; index < maxLength; index += 1) {
    result |= (a.charCodeAt(index) || 0) ^ (b.charCodeAt(index) || 0);
  }

  return result === 0;
}
