import { describe, expect, it } from 'vitest';
import { resolveSafeRedirect } from '../../lib/redirect-safety';
import { sanitizeUrl } from '../../lib/utils';

describe('tracked redirect safety', () => {
  describe('/out URL sanitization', () => {
    it.each([
      'https://example.com/apply',
      'http://example.com/apply',
    ])('accepts web destinations: %s', (destination) => {
      expect(sanitizeUrl(destination)).toBe(new URL(destination).toString());
    });

    it.each([
      'javascript:alert(1)',
      'data:text/html,unsafe',
      'ftp://example.com/file',
      '/relative-path',
      'not-a-url',
    ])('rejects unsafe or unsupported destinations: %s', (destination) => {
      expect(sanitizeUrl(destination)).toBe('#');
    });
  });

  describe('/go/[slug] destination validation', () => {
    const requestUrl = 'https://portal.example.com/go/tool';

    it('allows same-origin relative application routes', () => {
      expect(resolveSafeRedirect('/apply/quote', requestUrl)?.toString()).toBe(
        'https://portal.example.com/apply/quote',
      );
    });

    it.each([
      'https://example.com/tool',
      'http://example.com/tool',
    ])('allows absolute web destinations: %s', (destination) => {
      expect(resolveSafeRedirect(destination, requestUrl)?.toString()).toBe(destination);
    });

    it.each([
      '//evil.example/path',
      'javascript:alert(1)',
      'data:text/html,unsafe',
      'ftp://example.com/file',
      'relative-without-leading-slash',
      '#fragment',
    ])('rejects unsafe or ambiguous destinations: %s', (destination) => {
      expect(resolveSafeRedirect(destination, requestUrl)).toBeNull();
    });
  });
});
