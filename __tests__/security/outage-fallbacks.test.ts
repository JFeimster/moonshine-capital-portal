import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const brokerTestSource = readFileSync(resolve(process.cwd(), '__tests__/getBrokers.test.ts'), 'utf8');

describe('directory outage fallback coverage', () => {
  it('keeps explicit Notion outage fallback coverage in the broker suite', () => {
    expect(brokerTestSource).toContain('falls back to Wix when durable listing is unavailable');
    expect(brokerTestSource).toContain("new Error('Notion unavailable')");
  });
});
