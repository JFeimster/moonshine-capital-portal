import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const failures = [];

function fail(location, message) {
  failures.push(`${location}: ${message}`);
}

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    fail(relativePath, `invalid JSON (${error instanceof Error ? error.message : String(error)})`);
    return null;
  }
}

function requireFields(record, fields, location) {
  for (const field of fields) {
    if (!(field in record) || record[field] === '' || record[field] === undefined || record[field] === null) {
      fail(location, `missing required property "${field}"`);
    }
  }
}

function checkUnique(records, field, location) {
  const seen = new Map();
  for (const [index, record] of records.entries()) {
    const value = record?.[field];
    if (value === undefined || value === null) continue;
    if (seen.has(value)) {
      fail(`${location}[${index}].${field}`, `duplicate value "${value}"; first used at index ${seen.get(value)}`);
    } else {
      seen.set(value, index);
    }
  }
}

function isAllowedUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  if (value.startsWith('/')) return value.startsWith('/') && !value.startsWith('//');
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function getKnownBrokerSlugs() {
  const source = fs.readFileSync(path.join(root, 'lib/mock-brokers.ts'), 'utf8');
  return new Set([...source.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]));
}

function validateToolRegistry() {
  const data = readJson('data/embeds/tool-registry.json');
  if (!data) return;
  if (!Array.isArray(data.tools)) {
    fail('data/embeds/tool-registry.json', 'expected top-level "tools" array');
    return;
  }

  const tools = data.tools;
  const knownBrokers = getKnownBrokerSlugs();
  const allowedAccessLevels = new Set(['public', 'portal', 'admin']);
  const allowedRenderTypes = new Set(['iframe', 'internal', 'external', 'guide']);
  const allowedKinds = new Set(['tool', 'resource']);
  const required = [
    'id', 'slug', 'title', 'description', 'kind', 'category', 'resourceType', 'renderType',
    'accessLevel', 'status', 'url', 'ctaLabel', 'ctaHref', 'tags', 'audience', 'verticals',
    'useCases', 'brokerAssignments', 'featured', 'sortOrder'
  ];

  checkUnique(tools, 'id', 'data/embeds/tool-registry.json.tools');
  checkUnique(tools, 'slug', 'data/embeds/tool-registry.json.tools');
  checkUnique(tools, 'sortOrder', 'data/embeds/tool-registry.json.tools');

  tools.forEach((tool, index) => {
    const location = `data/embeds/tool-registry.json.tools[${index}]`;
    if (!tool || typeof tool !== 'object' || Array.isArray(tool)) {
      fail(location, 'expected an object');
      return;
    }

    requireFields(tool, required, location);

    if (typeof tool.id === 'string' && !/^[a-z0-9][a-z0-9-]*$/.test(tool.id)) fail(`${location}.id`, 'must be a lowercase kebab-case identifier');
    if (typeof tool.slug === 'string' && !/^[a-z0-9][a-z0-9-]*$/.test(tool.slug)) fail(`${location}.slug`, 'must be a lowercase kebab-case slug');
    if (!allowedKinds.has(tool.kind)) fail(`${location}.kind`, `unknown value "${tool.kind}"`);
    if (!allowedRenderTypes.has(tool.renderType)) fail(`${location}.renderType`, `unknown value "${tool.renderType}"`);
    if (!allowedAccessLevels.has(tool.accessLevel)) fail(`${location}.accessLevel`, `unknown value "${tool.accessLevel}"`);
    if (!Number.isInteger(tool.sortOrder) || tool.sortOrder < 0) fail(`${location}.sortOrder`, 'must be a non-negative integer');

    for (const field of ['url', 'ctaHref']) {
      if (!isAllowedUrl(tool[field])) fail(`${location}.${field}`, 'must be a root-relative internal route or an https URL');
    }
    if (tool.embedUrl !== undefined && !isAllowedUrl(tool.embedUrl)) fail(`${location}.embedUrl`, 'must be a root-relative internal route or an https URL');

    for (const field of ['tags', 'audience', 'verticals', 'useCases', 'brokerAssignments']) {
      if (!Array.isArray(tool[field])) fail(`${location}.${field}`, 'must be an array');
    }

    if (Array.isArray(tool.brokerAssignments)) {
      const assigned = new Set();
      tool.brokerAssignments.forEach((assignment, assignmentIndex) => {
        const assignmentLocation = `${location}.brokerAssignments[${assignmentIndex}]`;
        if (!assignment || typeof assignment !== 'object') {
          fail(assignmentLocation, 'expected an object');
          return;
        }
        if (!assignment.brokerSlug) fail(assignmentLocation, 'missing brokerSlug');
        if (typeof assignment.featured !== 'boolean') fail(`${assignmentLocation}.featured`, 'must be boolean');
        if (assigned.has(assignment.brokerSlug)) fail(`${assignmentLocation}.brokerSlug`, `duplicate assignment "${assignment.brokerSlug}"`);
        assigned.add(assignment.brokerSlug);
        if (assignment.brokerSlug && !knownBrokers.has(assignment.brokerSlug)) {
          fail(`${assignmentLocation}.brokerSlug`, `unknown checked-in broker slug "${assignment.brokerSlug}"`);
        }
      });
    }
  });
}

function validateFormRegistry(relativePath) {
  const data = readJson(relativePath);
  if (!data) return [];
  if (!Array.isArray(data.forms)) {
    fail(relativePath, 'expected top-level "forms" array');
    return [];
  }

  const forms = data.forms;
  checkUnique(forms, 'id', `${relativePath}.forms`);

  forms.forEach((form, index) => {
    const location = `${relativePath}.forms[${index}]`;
    requireFields(form, ['id', 'name', 'purpose', 'url', 'embedUrl', 'flowStage', 'canonical', 'status'], location);
    if (typeof form.id === 'string' && !/^[A-Za-z0-9]+$/.test(form.id)) fail(`${location}.id`, 'must contain only letters and numbers');
    if (typeof form.url === 'string' && form.url !== `https://tally.so/r/${form.id}`) fail(`${location}.url`, `must match Tally form id "${form.id}"`);
    if (typeof form.embedUrl === 'string' && !form.embedUrl.startsWith(`https://tally.so/embed/${form.id}`)) fail(`${location}.embedUrl`, `must match Tally form id "${form.id}"`);
    if (!['active', 'active_later', 'legacy'].includes(form.status)) fail(`${location}.status`, `unknown value "${form.status}"`);
    if (typeof form.canonical !== 'boolean') fail(`${location}.canonical`, 'must be boolean');
    if (form.intakeEndpoint !== undefined && form.intakeEndpoint !== null && !/^\/api\//.test(form.intakeEndpoint)) {
      fail(`${location}.intakeEndpoint`, 'must be null or an internal /api/ route');
    }
  });

  if (data.flow) {
    const knownIds = new Set(forms.map((form) => form.id));
    for (const key of ['primarySequence', 'postProfileSequence']) {
      if (data.flow[key] === undefined) continue;
      if (!Array.isArray(data.flow[key])) {
        fail(`${relativePath}.flow.${key}`, 'must be an array');
        continue;
      }
      for (const id of data.flow[key]) {
        if (!knownIds.has(id)) fail(`${relativePath}.flow.${key}`, `references unknown form id "${id}"`);
      }
    }
  }

  return forms;
}

for (const schema of [
  'data/schemas/application-registry.schema.json',
  'data/schemas/tool-registry.schema.json',
  'data/schemas/broker-profile.schema.json'
]) readJson(schema);

validateToolRegistry();
const applicationForms = validateFormRegistry('data/forms/applications.json');
const agentForms = validateFormRegistry('data/forms/funding-agents.json');
checkUnique([...applicationForms, ...agentForms], 'id', 'data/forms/*');

if (failures.length) {
  console.error(`Data validation failed with ${failures.length} error(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Data validation passed: ${applicationForms.length + agentForms.length} forms and checked-in tool registry are valid.`);
