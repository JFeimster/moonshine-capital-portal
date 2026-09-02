import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '..');

function runScript(script: string) {
  return execFileSync(process.execPath, [path.join(root, script)], {
    cwd: root,
    encoding: 'utf8',
  });
}

describe('checked-in registry validation', () => {
  it('accepts the current registry data contract', () => {
    expect(runScript('scripts/validate-data.mjs')).toContain('Data validation passed');
  });

  it('accepts all checked-in internal registry routes', () => {
    expect(runScript('scripts/check-internal-links.mjs')).toContain('Internal-link validation passed');
  });
});
