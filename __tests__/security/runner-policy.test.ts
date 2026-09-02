import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const testRoot = resolve(process.cwd(), '__tests__');

function collectTestSources(directory: string): string[] {
  const { readdirSync, statSync } = require('node:fs') as typeof import('node:fs');
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? collectTestSources(path) : path.endsWith('.test.ts') ? [path] : [];
  });
}

describe('test runner policy', () => {
  it('keeps the test suite on Vitest only', () => {
    for (const file of collectTestSources(testRoot)) {
      const source = readFileSync(file, 'utf8');
      expect(source).not.toContain("from 'bun:test'");
      expect(source).not.toContain('from "bun:test"');
    }
  });
});
