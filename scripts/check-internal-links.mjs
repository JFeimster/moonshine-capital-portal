import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const failures = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function normalizeInternalRoute(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null;
  return value.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
}

function routeExists(route) {
  if (route === '/') return fs.existsSync(path.join(root, 'app/page.tsx'));
  const segments = route.split('/').filter(Boolean);
  const appPath = path.join(root, 'app', ...segments);
  return [
    path.join(appPath, 'page.tsx'),
    path.join(appPath, 'route.ts'),
    path.join(appPath, 'page.js'),
    path.join(appPath, 'route.js')
  ].some((candidate) => fs.existsSync(candidate));
}

function check(value, location) {
  const route = normalizeInternalRoute(value);
  if (!route) return;
  if (!routeExists(route)) failures.push(`${location}: internal route "${route}" does not map to a checked-in App Router page or route`);
}

const tools = readJson('data/embeds/tool-registry.json').tools || [];
tools.forEach((tool, index) => {
  check(tool.url, `data/embeds/tool-registry.json.tools[${index}].url`);
  check(tool.ctaHref, `data/embeds/tool-registry.json.tools[${index}].ctaHref`);
  check(tool.embedUrl, `data/embeds/tool-registry.json.tools[${index}].embedUrl`);
});

for (const registryPath of ['data/forms/applications.json', 'data/forms/funding-agents.json']) {
  const forms = readJson(registryPath).forms || [];
  forms.forEach((form, index) => check(form.intakeEndpoint, `${registryPath}.forms[${index}].intakeEndpoint`));
}

if (failures.length) {
  console.error(`Internal-link validation failed with ${failures.length} error(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Internal-link validation passed for checked-in registries.');
