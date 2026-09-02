import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const webhookTestSource = readFileSync(resolve(process.cwd(), '__tests__/webhook-auth.test.ts'), 'utf8');

describe('webhook rejection coverage', () => {
  it('keeps fail-closed and invalid-secret cases in the webhook suite', () => {
    expect(webhookTestSource).toContain('without TALLY_WEBHOOK_SECRET');
    expect(webhookTestSource).toContain('invalid secret');
  });
});
