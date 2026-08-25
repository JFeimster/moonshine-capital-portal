export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MISSING_MERGE_KEY = 'Missing or invalid required merge key: email';

export function validateApplicationPayload(payload: any): ValidationResult {
  const errors: string[] = [];
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

  if (!email) {
    // Preserve the established external validation contract while tightening
    // format validation for nonblank email values.
    errors.push(MISSING_MERGE_KEY);
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

  // Batch 2.5 allows canonical partner_id to replace email as the preferred
  // enrichment lookup key, while retaining the established error contract when
  // neither lookup key is available.
  if (!hasPartnerId && !email) {
    errors.push(MISSING_MERGE_KEY);
  }
  if (email && !EMAIL_RE.test(email)) {
    errors.push('Invalid email');
  }

  return { isValid: errors.length === 0, errors };
}
