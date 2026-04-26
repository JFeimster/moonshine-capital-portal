import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

/**
 * Validates a shared secret passed in the webhook headers to secure intake routes.
 * Uses `TALLY_WEBHOOK_SECRET` environment variable.
 */
export function validateWebhookAuth(req: NextRequest): boolean {
  const expectedSecret = process.env.TALLY_WEBHOOK_SECRET;

  // If the secret is not configured in the environment, we fail closed for security.
  if (!expectedSecret) {
    console.error('TALLY_WEBHOOK_SECRET is not configured in the environment.');
    return false;
  }

  const providedSecret = req.headers.get('Authorization') || req.headers.get('x-webhook-secret');

  if (!providedSecret) {
    return false;
  }

  const cleanedSecret = providedSecret.replace(/^Bearer\s+/i, '').trim();

  return safeCompare(cleanedSecret, expectedSecret);
}
