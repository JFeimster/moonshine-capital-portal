import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const errorSurfaces = [
  'app/error.tsx',
  'app/global-error.tsx',
  'app/portal/error.tsx',
  'app/admin/error.tsx',
];

describe('App Router resilience error surfaces', () => {
  it.each(errorSurfaces)('%s keeps diagnostics out of the user-facing source', (file) => {
    const source = readFileSync(resolve(process.cwd(), file), 'utf8');

    expect(source.startsWith("'use client';")).toBe(true);
    expect(source).not.toContain('error.message');
    expect(source).not.toContain('error.stack');
    expect(source).not.toContain('error.digest');
    expect(source).toContain('reset');
  });
});
