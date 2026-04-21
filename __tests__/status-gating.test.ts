import { describe, it, expect } from 'vitest';
import { isEligibleForPublicDisplay } from '../lib/status-gating';

describe('status-gating', () => {
  describe('isEligibleForPublicDisplay', () => {
    it('should return true for approved, active, non-hidden broker', () => {
      const broker: any = {
        approvalStatus: 'approved',
        isActive: true,
        brokerStatus: 'active'
      };
      expect(isEligibleForPublicDisplay(broker)).toBe(true);
    });

    it('should return false if not approved', () => {
      const broker: any = {
        approvalStatus: 'pending',
        isActive: true,
        brokerStatus: 'active'
      };
      expect(isEligibleForPublicDisplay(broker)).toBe(false);
    });

    it('should return false if not active', () => {
      const broker: any = {
        approvalStatus: 'approved',
        isActive: false,
        brokerStatus: 'active'
      };
      expect(isEligibleForPublicDisplay(broker)).toBe(false);
    });

    it('should return false if hidden', () => {
      const broker: any = {
        approvalStatus: 'approved',
        isActive: true,
        brokerStatus: 'hidden'
      };
      expect(isEligibleForPublicDisplay(broker)).toBe(false);
    });

    it('should return false for null or undefined input', () => {
      expect(isEligibleForPublicDisplay(null as any)).toBe(false);
      expect(isEligibleForPublicDisplay(undefined as any)).toBe(false);
    });
  });
});
