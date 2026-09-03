import { describe, expect, it } from 'vitest';
import sitemap from '../app/sitemap';

describe('partner sitemap coverage', () => {
  it('includes representative partner hubs and detail routes', async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => String(entry.url));
    expect(urls.some((url) => url.endsWith('/funding'))).toBe(true);
    expect(urls.some((url) => url.includes('/funding/working-capital'))).toBe(true);
    expect(urls.some((url) => url.includes('/industries/construction'))).toBe(true);
    expect(urls.some((url) => url.includes('/campaign/hvac'))).toBe(true);
    expect(urls.some((url) => url.includes('/resources/funding-readiness'))).toBe(true);
    expect(urls.some((url) => url.includes('/admin') || url.includes('/portal') || url.includes('/access') || url.includes('/out') || url.includes('/go') || url.includes('/api'))).toBe(false);
  });
});