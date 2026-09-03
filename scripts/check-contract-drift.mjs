import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const failures = [];

function fail(location, message) {
  failures.push(`${location}: ${message}`);
}

function readText(relativePath) {
  try {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
  } catch (error) {
    fail(relativePath, `could not read file (${error instanceof Error ? error.message : String(error)})`);
    return '';
  }
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    fail(relativePath, `invalid JSON (${error instanceof Error ? error.message : String(error)})`);
    return null;
  }
}

function extractQuotedValues(source, expression, location) {
  const match = source.match(expression);
  if (!match) {
    fail(location, 'could not find the expected TypeScript declaration');
    return [];
  }
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((value) => value[1]);
}

function extractInterfaceFields(source, interfaceName, location) {
  const match = source.match(new RegExp(`interface\\s+${interfaceName}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  if (!match) {
    fail(location, `could not find interface ${interfaceName}`);
    return new Set();
  }
  return new Set([...match[1].matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\??\s*:/gm)].map((value) => value[1]));
}

function checkEqual(actual, expected, location) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(location, `expected ${JSON.stringify(expected)} but found ${JSON.stringify(actual)}`);
  }
}

function checkLifecycleParity() {
  const contract = readText('lib/partner-contract.ts');
  const schema = readJson('data/schemas/broker-profile.schema.json');
  if (!schema) return;

  const approvalStatuses = extractQuotedValues(
    contract,
    /APPROVAL_STATUSES\s*=\s*\[([\s\S]*?)\]\s+as const/,
    'lib/partner-contract.ts:APPROVAL_STATUSES',
  );
  const profileStatuses = extractQuotedValues(
    contract,
    /PROFILE_STATUSES\s*=\s*\[([\s\S]*?)\]\s+as const/,
    'lib/partner-contract.ts:PROFILE_STATUSES',
  );

  checkEqual(schema.properties?.approvalStatus?.enum, approvalStatuses, 'approval lifecycle parity');
  checkEqual(schema.properties?.profileStatus?.enum, profileStatuses, 'profile lifecycle parity');
}

function checkSchemaToPublicType() {
  const schema = readJson('data/schemas/broker-profile.schema.json');
  const types = extractInterfaceFields(readText('lib/types.ts'), 'BrokerProfile', 'lib/types.ts');
  if (!schema) return;

  for (const field of schema.required || []) {
    if (!types.has(field)) fail(`data/schemas/broker-profile.schema.json.required.${field}`, 'required schema field is missing from BrokerProfile');
  }
}

function checkContractCoverage() {
  const contract = readText('lib/partner-contract.ts');
  const canonical = extractInterfaceFields(readText('lib/field-mapping.ts'), 'CanonicalBrokerProfile', 'lib/field-mapping.ts');
  const schema = readJson('data/schemas/broker-profile.schema.json');
  const publicType = extractInterfaceFields(readText('lib/types.ts'), 'BrokerProfile', 'lib/types.ts');

  const groupNames = ['identity', 'mergeKeys', 'lifecycle', 'publicProfile', 'traceability', 'serverAssigned'];
  const groupFields = new Set();
  for (const groupName of groupNames) {
    const fields = extractQuotedValues(
      contract,
      new RegExp(`${groupName}:\\s*\\[([\\s\\S]*?)\\]\\s+as const`),
      `lib/partner-contract.ts:PARTNER_FIELD_GROUPS.${groupName}`,
    );
    for (const field of fields) groupFields.add(field);
    for (const field of fields) {
      if (!canonical.has(field)) fail(`PARTNER_FIELD_GROUPS.${groupName}.${field}`, 'contract field is missing from CanonicalBrokerProfile');
    }
  }

  const notionProperties = extractQuotedValues(
    contract,
    /NOTION_PARTNER_PROPERTIES\s*=\s*\{([\s\S]*?)\}\s+as const/,
    'lib/partner-contract.ts:NOTION_PARTNER_PROPERTIES',
  );
  const notionBlock = contract.match(/NOTION_PARTNER_PROPERTIES\s*=\s*\{([\s\S]*?)\}\s+as const/)?.[1] || '';
  const notionKeys = new Set([...notionBlock.matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*:/gm)].map((value) => value[1]));
  const intentionallyUnmapped = new Set(['title', 'notionPageId']);
  for (const field of groupFields) {
    if (!notionKeys.has(field) && !intentionallyUnmapped.has(field)) {
      fail(`NOTION_PARTNER_PROPERTIES.${field}`, 'contract field has no mapped Notion property');
    }
  }
  if (notionProperties.length === 0) fail('NOTION_PARTNER_PROPERTIES', 'property map is empty');

  if (!canonical.has('specialties')) fail('alias.specialties', 'canonical field is missing from CanonicalBrokerProfile');
  if (!publicType.has('fundingSpecialties')) fail('alias.fundingSpecialties', 'public alias is missing from BrokerProfile');
  if (!schema?.properties?.fundingSpecialties) fail('alias.fundingSpecialties', 'public alias is missing from JSON schema');
  if (!notionKeys.has('specialties')) fail('alias.specialties', 'canonical alias is missing from Notion property map');
}

function checkFixtureEnvelope() {
  const fixtureDirectory = path.join(root, 'data/contract-fixtures');
  const expectedScenarios = new Set([
    'approved-published',
    'needs-review-draft',
    'duplicate-identity',
    'malformed-tally-submission',
    'wix-lifecycle-conflict',
    'missing-public-fields',
  ]);
  let files = [];
  try {
    files = fs.readdirSync(fixtureDirectory).filter((file) => file.endsWith('.json'));
  } catch (error) {
    fail('data/contract-fixtures', `could not read fixture directory (${error instanceof Error ? error.message : String(error)})`);
    return;
  }

  const scenarios = new Set();
  for (const file of files) {
    const relativePath = `data/contract-fixtures/${file}`;
    const fixture = readJson(relativePath);
    if (!fixture) continue;
    if (typeof fixture.scenario !== 'string' || typeof fixture.source !== 'string' || !fixture.input || !fixture.expected) {
      fail(relativePath, 'must contain scenario, source, input, and expected properties');
      continue;
    }
    scenarios.add(fixture.scenario);
  }

  for (const scenario of expectedScenarios) {
    if (!scenarios.has(scenario)) fail(`data/contract-fixtures/${scenario}`, 'required reconciliation scenario is missing');
  }
  for (const scenario of scenarios) {
    if (!expectedScenarios.has(scenario)) fail('data/contract-fixtures', `unexpected reconciliation scenario "${scenario}"`);
  }
}

checkLifecycleParity();
checkSchemaToPublicType();
checkContractCoverage();
checkFixtureEnvelope();

if (failures.length > 0) {
  console.error(`Contract drift validation failed with ${failures.length} error(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Contract drift validation passed.');
