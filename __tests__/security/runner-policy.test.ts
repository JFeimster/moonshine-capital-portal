import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const testRoot = resolve(process.cwd(), '__tests__');

function collectTestSources(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? collectTestSources(path) : path.endsWith('.test.ts') ? [path] : [];
  });
}

describe('test runner policy', () => {
  it('keeps the test suite on Vitest only', () => {
    const forbiddenModule = ['bun', 'test'].join(':');

    for (const file of collectTestSources(testRoot)) {
      if (basename(file) === 'runner-policy.test.ts') continue;
      const source = readFileSync(file, 'utf8');
      expect(source).not.toContain(forbiddenModule);
    }
  });
});
