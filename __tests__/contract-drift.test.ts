import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '..');
const fixtureDirectory = path.join(root, 'data/contract-fixtures');

function runScript(script: string) {
  return execFileSync(process.execPath, [path.join(root, script)], {
    cwd: root,
    encoding: 'utf8',
  });
}

describe('cross-system contract drift', () => {
  it('accepts the checked-in contract and reconciliation fixtures', () => {
    expect(runScript('scripts/check-contract-drift.mjs')).toContain('Contract drift validation passed');
  });

  it('keeps every named reconciliation scenario redacted and machine-readable', () => {
    const expectedScenarios = [
      'approved-published',
      'needs-review-draft',
      'duplicate-identity',
      'malformed-tally-submission',
      'wix-lifecycle-conflict',
      'missing-public-fields',
    ];
    const fixtures = readdirSync(fixtureDirectory).filter((file) => file.endsWith('.json'));
    const scenarios = fixtures.map((file) => {
      const fixture = JSON.parse(readFileSync(path.join(fixtureDirectory, file), 'utf8'));
      expect(fixture.input).toBeDefined();
      expect(fixture.expected).toBeDefined();
      return fixture.scenario;
    });

    expect(scenarios.sort()).toEqual(expectedScenarios.sort());
  });

  it('preserves the intentional specialties public alias', () => {
    const fixture = JSON.parse(
      readFileSync(path.join(fixtureDirectory, 'approved-published.json'), 'utf8'),
    );

    expect(fixture.input.specialties).toEqual(fixture.expected.projectedFundingSpecialties);
  });
});
