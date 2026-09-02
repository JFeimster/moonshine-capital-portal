import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const middlewareSource = readFileSync(resolve(process.cwd(), 'middleware.ts'), 'utf8');

describe('protected route authorization boundary', () => {
  it('keeps portal and admin routes inside middleware matching', () => {
    expect(middlewareSource).toContain("'/portal/:path*'");
    expect(middlewareSource).toContain("'/admin/:path*'");
  });
});
