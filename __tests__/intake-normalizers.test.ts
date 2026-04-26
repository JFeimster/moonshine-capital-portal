import { describe, it, expect } from 'vitest';
import { generateSlug, normalizeUrl, normalizeArray, normalizeState } from '../lib/intake-normalizers';

describe('intake-normalizers', () => {
  describe('generateSlug', () => {
    it('should lowercase and replace spaces with hyphens', () => {
      expect(generateSlug('John Doe')).toBe('john-doe');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Jane Smith-Doe!')).toBe('jane-smith-doe');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('  Big   Agency  ')).toBe('big-agency');
    });

    it('should return empty string for falsy input', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug(undefined as any)).toBe('');
    });
  });

  describe('normalizeUrl', () => {
    it('should add https:// if missing', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
    });

    it('should not modify if https:// is present', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should not modify if http:// is present', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should remove trailing slash', () => {
      expect(normalizeUrl('https://example.com/')).toBe('https://example.com');
    });

    it('should return undefined for falsy input', () => {
      expect(normalizeUrl('')).toBeUndefined();
      expect(normalizeUrl(undefined)).toBeUndefined();
    });
  });

  describe('normalizeArray', () => {
    it('should split comma-separated strings and trim', () => {
      expect(normalizeArray('SaaS, Manufacturing , Technology')).toEqual(['SaaS', 'Manufacturing', 'Technology']);
    });

    it('should handle an array input and trim', () => {
      expect(normalizeArray([' SaaS ', 'Manufacturing', ' Technology'])).toEqual(['SaaS', 'Manufacturing', 'Technology']);
    });

    it('should ignore empty items', () => {
      expect(normalizeArray('SaaS,,Technology, ')).toEqual(['SaaS', 'Technology']);
    });

    it('should return empty array for falsy input', () => {
      expect(normalizeArray('')).toEqual([]);
      expect(normalizeArray(undefined)).toEqual([]);
    });
  });

  describe('normalizeState', () => {
    it('should correctly map full state names to abbreviations', () => {
      expect(normalizeState('California')).toBe('CA');
      expect(normalizeState('new york')).toBe('NY');
      expect(normalizeState('Texas')).toBe('TX');
      expect(normalizeState('florida')).toBe('FL');
    });

    it('should uppercase valid 2-letter codes', () => {
      expect(normalizeState('ny')).toBe('NY');
      expect(normalizeState('tx')).toBe('TX');
      expect(normalizeState('Ca')).toBe('CA');
    });

    it('should return empty string for falsy input', () => {
      expect(normalizeState('')).toBe('');
      expect(normalizeState(undefined)).toBe('');
    });

    it('should return empty string if state is unknown instead of guessing', () => {
      expect(normalizeState('UnknownState')).toBe('');
      expect(normalizeState('Fake State')).toBe('');
    });
  });
});
