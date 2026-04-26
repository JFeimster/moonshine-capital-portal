import { CanonicalBrokerProfile } from './field-mapping';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateApplicationPayload(payload: any): ValidationResult {
  const errors: string[] = [];

  if (!payload.email || typeof payload.email !== 'string' || payload.email.trim() === '') {
    errors.push('Missing or invalid required merge key: email');
  }

  if (!payload.fullName || typeof payload.fullName !== 'string' || payload.fullName.trim() === '') {
    errors.push('Missing required field: fullName');
  }

  if (!payload.agencyName || typeof payload.agencyName !== 'string' || payload.agencyName.trim() === '') {
    errors.push('Missing required field: agencyName');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateProfilePayload(payload: any): ValidationResult {
  // A profile update requires the email to merge against.
  const errors: string[] = [];

  if (!payload.email || typeof payload.email !== 'string' || payload.email.trim() === '') {
    errors.push('Missing or invalid required merge key: email');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
