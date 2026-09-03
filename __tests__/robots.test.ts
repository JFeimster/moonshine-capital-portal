import { describe, expect, it } from 'vitest';
import robots from '../app/robots';

describe('robots sitemap declaration', () => {
  it('advertises the standard sitemap endpoint', () => {
    expect(robots().sitemap).toBe('https://capital.distilledfunding.com/sitemap.xml');
  });
});