import { describe, it, expect } from 'vitest';
import { validateApplicationPayload, validateProfilePayload } from '../lib/validation';

describe('validation', () => {
  describe('validateApplicationPayload', () => {
    it('should be valid with the minimal Join identity fields', () => {
      const payload = {
        email: 'test@example.com',
        fullName: 'Test User'
      };
      const result = validateApplicationPayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should also accept agencyName when supplied by richer intake', () => {
      const payload = {
        email: 'test@example.com',
        fullName: 'Test User',
        agencyName: 'Test Agency'
      };
      const result = validateApplicationPayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if email is missing', () => {
      const payload = {
        fullName: 'Test User'
      };
      const result = validateApplicationPayload(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing or invalid required merge key: email');
    });

    it('should fail if fullName is missing', () => {
      const payload = {
        email: 'test@example.com'
      };
      const result = validateApplicationPayload(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: fullName');
    });
  });

  describe('validateProfilePayload', () => {
    it('should be valid with email', () => {
      const payload = {
        email: 'test@example.com',
        shortBio: 'Hello'
      };
      const result = validateProfilePayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if email is missing', () => {
      const payload = {
        shortBio: 'Hello'
      };
      const result = validateProfilePayload(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing or invalid required merge key: email');
    });
  });
});