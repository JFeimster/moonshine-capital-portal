import { NextRequest } from 'next/server';

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

  // Check the authorization header (or a custom header like 'x-tally-secret')
  const providedSecret = req.headers.get('Authorization') || req.headers.get('x-webhook-secret');

  if (!providedSecret) {
    return false;
  }

  // Basic Bearer token comparison or direct secret comparison
  const cleanedSecret = providedSecret.replace(/^Bearer\s+/i, '').trim();

  return cleanedSecret === expectedSecret;
}
