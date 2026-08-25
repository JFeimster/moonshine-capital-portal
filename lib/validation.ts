export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateApplicationPayload(payload: any): ValidationResult {
  const errors: string[] = [];
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

  if (!email) {
    errors.push('Missing required field: email');
  } else if (!EMAIL_RE.test(email)) {
    errors.push('Invalid email');
  }

  if (!payload?.fullName || typeof payload.fullName !== 'string' || payload.fullName.trim() === '') {
    errors.push('Missing required field: fullName');
  }

  if (!payload?.agencyName || typeof payload.agencyName !== 'string' || payload.agencyName.trim() === '') {
    errors.push('Missing required field: agencyName');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateProfilePayload(payload: any): ValidationResult {
  const errors: string[] = [];
  const hasPartnerId = typeof payload?.partnerId === 'string' && payload.partnerId.trim() !== '';
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

  if (!hasPartnerId && !email) {
    errors.push('Profile enrichment requires partnerId or email');
  }
  if (email && !EMAIL_RE.test(email)) {
    errors.push('Invalid email');
  }

  return { isValid: errors.length === 0, errors };
}
