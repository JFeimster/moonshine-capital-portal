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
  const tools = data.tools || data.entries;
  if (!Array.isArray(tools)) {
    fail('data/embeds/tool-registry.json', 'expected top-level "tools" or "entries" array');
    return;
  }

  const knownBrokers = getKnownBrokerSlugs();
  const allowedAccessLevels = new Set(['public', 'portal', 'admin']);
  const allowedRenderTypes = new Set(['iframe', 'internal', 'external', 'guide']);
  const allowedKinds = new Set(['tool', 'resource']);

  checkUnique(tools, 'id', 'data/embeds/tool-registry.json');
  checkUnique(tools, 'slug', 'data/embeds/tool-registry.json');
  if (data.tools) {
    checkUnique(tools, 'sortOrder', 'data/embeds/tool-registry.json');
  }

  tools.forEach((tool, index) => {
    const location = `data/embeds/tool-registry.json[${index}]`;
    if (!tool || typeof tool !== 'object' || Array.isArray(tool)) {
      fail(location, 'expected an object');
      return;
    }

    if (data.tools) {
      const required = [
        'id', 'slug', 'title', 'description', 'kind', 'category', 'resourceType', 'renderType',
        'accessLevel', 'status', 'url', 'ctaLabel', 'ctaHref', 'tags', 'audience', 'verticals',
        'useCases', 'brokerAssignments', 'featured', 'sortOrder'
      ];
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
    } else {
      // Entry format in tool-registry.json
      if (tool.slug && typeof tool.slug === 'string' && !/^[a-z0-9][a-z0-9-]*$/.test(tool.slug)) {
        fail(`${location}.slug`, 'must be a lowercase kebab-case slug');
      }
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

function validateFundingRegistries() {
  const families = readJson('data/funding/funding-product-families.registry.json');
  const products = readJson('data/funding/funding-products.registry.json');
  const providers = readJson('data/funding/funding-providers.registry.json');
  const pages = readJson('data/pages/funding-pages.registry.json');
  const toolsData = readJson('data/embeds/tool-registry.json');

  if (!families || !products || !providers || !pages) return;

  const familyEntries = families.entries || [];
  const productEntries = products.entries || [];
  const providerEntries = providers.entries || [];
  const pageEntries = pages.pages || [];
  const toolEntries = toolsData.tools || toolsData.entries || [];

  // Check unique IDs per registry
  checkUnique(familyEntries, 'id', 'data/funding/funding-product-families.registry.json');
  checkUnique(productEntries, 'id', 'data/funding/funding-products.registry.json');
  checkUnique(providerEntries, 'id', 'data/funding/funding-providers.registry.json');
  checkUnique(pageEntries, 'id', 'data/pages/funding-pages.registry.json');

  const knownFamilyIds = new Set(familyEntries.map((f) => f.id));
  const publicFamilyIds = new Set(familyEntries.filter((f) => f.visibility === 'public' && f.status !== 'deprecated' && !f.deprecated).map((f) => f.id));
  const internalDeprecatedFamilyIds = new Set(familyEntries.filter((f) => f.visibility === 'internal' || f.status === 'deprecated' || f.deprecated).map((f) => f.id));
  const knownProviderIds = new Set(providerEntries.map((p) => p.id));

  // Check: every productFamily ref exists
  productEntries.forEach((p, idx) => {
    if (p.productFamily && !knownFamilyIds.has(p.productFamily)) {
      fail(`data/funding/funding-products.registry.json[${idx}].productFamily`, `references unknown productFamily "${p.productFamily}"`);
    }
    if (p.providerId && !knownProviderIds.has(p.providerId)) {
      fail(`data/funding/funding-products.registry.json[${idx}].providerId`, `references unknown providerId "${p.providerId}"`);
    }
  });

  providerEntries.forEach((prov, idx) => {
    if (Array.isArray(prov.productFamilyIds)) {
      prov.productFamilyIds.forEach((famId) => {
        if (!knownFamilyIds.has(famId)) {
          fail(`data/funding/funding-providers.registry.json[${idx}].productFamilyIds`, `references unknown productFamily "${famId}"`);
        }
      });
    }
  });

  // Check pages
  pageEntries.forEach((page, idx) => {
    const isPublicPage = page.visibility === 'public';

    if (page.sections && Array.isArray(page.sections)) {
      page.sections.forEach((sec, secIdx) => {
        if (sec.type === 'product-family-grid' && Array.isArray(sec.itemIds)) {
          sec.itemIds.forEach((famId) => {
            if (!knownFamilyIds.has(famId)) {
              fail(`data/pages/funding-pages.registry.json[${idx}].sections[${secIdx}].itemIds`, `references unknown productFamily "${famId}"`);
            }
            if (isPublicPage && internalDeprecatedFamilyIds.has(famId)) {
              fail(`data/pages/funding-pages.registry.json[${idx}].sections[${secIdx}].itemIds`, `public page references deprecated/internal family "${famId}"`);
            }
          });
        }
      });
    }

    if (page.dataRefs && Array.isArray(page.dataRefs.productFamilyIds)) {
      page.dataRefs.productFamilyIds.forEach((famId) => {
        if (!knownFamilyIds.has(famId)) {
          fail(`data/pages/funding-pages.registry.json[${idx}].dataRefs.productFamilyIds`, `references unknown productFamily "${famId}"`);
        }
        if (isPublicPage && internalDeprecatedFamilyIds.has(famId)) {
          fail(`data/pages/funding-pages.registry.json[${idx}].dataRefs.productFamilyIds`, `public page references deprecated/internal family "${famId}"`);
        }
      });
    }
  });

  // Check tools
  toolEntries.forEach((tool, idx) => {
    const isPublicTool = tool.visibility === 'public' || tool.accessLevel === 'public';
    if (tool.relatedFamilyIds && Array.isArray(tool.relatedFamilyIds)) {
      tool.relatedFamilyIds.forEach((famId) => {
        if (!knownFamilyIds.has(famId)) {
          fail(`data/embeds/tool-registry.json[${idx}].relatedFamilyIds`, `references unknown productFamily "${famId}"`);
        }
        if (isPublicTool && internalDeprecatedFamilyIds.has(famId)) {
          fail(`data/embeds/tool-registry.json[${idx}].relatedFamilyIds`, `public tool references deprecated/internal family "${famId}"`);
        }
      });
    }
  });

  // Check familyCounts match actual product distribution
  const actualCounts = {};
  productEntries.forEach((p) => {
    if (p.productFamily) {
      actualCounts[p.productFamily] = (actualCounts[p.productFamily] || 0) + 1;
    }
  });

  const reportedCounts = products.familyCounts || {};
  const allFamiliesToCheck = new Set([...Object.keys(actualCounts), ...Object.keys(reportedCounts)]);
  for (const famId of allFamiliesToCheck) {
    const actual = actualCounts[famId] || 0;
    const reported = reportedCounts[famId] || 0;
    if (actual !== reported) {
      fail(`data/funding/funding-products.registry.json.familyCounts.${famId}`, `count mismatch: expected ${actual}, found ${reported}`);
    }
  }
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
validateFundingRegistries();

if (failures.length) {
  console.error(`Data validation failed with ${failures.length} error(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Data validation passed: ${applicationForms.length + agentForms.length} forms and checked-in registries are valid.`);
