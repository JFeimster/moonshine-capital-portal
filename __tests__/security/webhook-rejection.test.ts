import { describe, expect, it } from 'vitest';
import { verifyWebhookSignature } from '../../lib/webhook-auth';

describe('webhook signature rejection', () => {
  it('rejects a signature when the shared secret is unavailable', async () => {
    await expect(verifyWebhookSignature('payload', 'signature', '')).resolves.toBe(false);
  });

  it('rejects an invalid signature', async () => {
    await expect(verifyWebhookSignature('payload', 'invalid-signature', 'test-secret')).resolves.toBe(false);
  });
});
