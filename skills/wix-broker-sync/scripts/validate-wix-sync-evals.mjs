#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import process from 'node:process';

const defaultPath = new URL('../evals/wix-sync-cases.json', import.meta.url);
const inputPath = process.argv[2] ? new URL(`file://${process.argv[2].replaceAll('\\', '/')}`) : defaultPath;
const requiredIds = [
  'eligible-approved-published',
  'approved-but-draft-blocked',
  'approved-but-hidden-blocked',
  'immutable-slug-conflict',
  'duplicate-email-different-partner',
  'blank-safe-update',
  'unsafe-url-and-private-image',
  'wix-unavailable-fallback',
  'unmapped-canonical-fields-reported',
  'authorized-apply-still-verifies',
];

const source = await readFile(inputPath, 'utf8');
const fixture = JSON.parse(source);
const failures = [];

if (fixture.version !== 1) failures.push('version must be 1');
if (!Array.isArray(fixture.cases)) failures.push('cases must be an array');

const cases = Array.isArray(fixture.cases) ? fixture.cases : [];
const ids = new Set(cases.map((testCase) => testCase.id));
for (const requiredId of requiredIds) {
  if (!ids.has(requiredId)) failures.push(`missing case: ${requiredId}`);
}

for (const testCase of cases) {
  if (!testCase.id || !testCase.mode || !testCase.input || !testCase.expect) {
    failures.push(`incomplete case: ${testCase.id || '<unnamed>'}`);
  }

  if (testCase.mode === 'dry-run' && testCase.expect?.writesAttempted !== 0) {
    failures.push(`dry-run must assert zero writes: ${testCase.id}`);
  }

  if (testCase.mode === 'apply' && testCase.authorization === undefined) {
    failures.push(`apply case must declare authorization: ${testCase.id}`);
  }
}

if (failures.length > 0) {
  console.error('Wix sync evaluation validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${cases.length} Wix sync evaluation cases; no live writes performed.`);
}
