import { describe, expect, it } from 'vitest';
import {
  bankAccountClassification,
  externalLeadIdForSubmission,
  parseMoneyValue,
  requestedAmountBand,
  timeInBusinessBand
} from '../lib/funding-leads';
import type { ParsedTallySubmission } from '../lib/tally-webhook';

function submission(overrides: Partial<ParsedTallySubmission> = {}): ParsedTallySubmission {
  return {
    eventId: 'evt_1',
    eventType: 'FORM_RESPONSE',
    formId: 'dWvEqN',
    kind: 'funding_intake',
    submissionId: 'sub_1',
    fields: {},
    hidden: {},
    ...overrides
  };
}

describe('funding lead normalization helpers', () => {
  it('parses exact amounts and funding/revenue ranges', () => {
    expect(parseMoneyValue(75000)).toBe(75000);
    expect(parseMoneyValue('$15k-$50k')).toBe(32500);
    expect(parseMoneyValue('$1M - $5M')).toBe(3000000);
  });

  it('maps requested amounts into the current Funding Leads bands', () => {
    expect(requestedAmountBand(9000)).toBe('Under $10K');
    expect(requestedAmountBand(25000)).toBe('$10K–$25K');
    expect(requestedAmountBand(75000)).toBe('$50K–$100K');
    expect(requestedAmountBand(300000)).toBe('$250K–$500K');
    expect(requestedAmountBand(1000000)).toBe('$500K+');
  });

  it('normalizes free-text time in business into valid Notion select values', () => {
    expect(timeInBusinessBand('2 months')).toBe('Under 3 months');
    expect(timeInBusinessBand('5 months')).toBe('3–6 months');
    expect(timeInBusinessBand('9 months')).toBe('6–12 months');
    expect(timeInBusinessBand('18 months')).toBe('1–2 years');
    expect(timeInBusinessBand('3 years')).toBe('2+ years');
    expect(timeInBusinessBand('pre-revenue startup')).toBe('Pre-revenue');
  });

  it('normalizes business bank ownership without inventing banking details', () => {
    expect(bankAccountClassification('business name')).toEqual({
      businessBankAccount: 'Yes',
      accountType: 'business'
    });
    expect(bankAccountClassification('personal name')).toEqual({
      businessBankAccount: 'No',
      accountType: 'personal'
    });
    expect(bankAccountClassification('both personal and business')).toEqual({
      businessBankAccount: 'Yes',
      accountType: 'mixed'
    });
  });

  it('uses session_id to reconcile Step 1 and Step 2 to the same external lead', () => {
    const first = submission({
      formId: 'dWvEqN',
      kind: 'funding_intake',
      submissionId: 'sub_step_1',
      hidden: { session_id: 'session-abc' }
    });
    const second = submission({
      formId: 'w4R2Ad',
      kind: 'funding_application',
      submissionId: 'sub_step_2',
      hidden: { session_id: 'session-abc' }
    });

    expect(externalLeadIdForSubmission(first)).toBe('tally-session:session-abc');
    expect(externalLeadIdForSubmission(second)).toBe('tally-session:session-abc');
  });

  it('falls back to a form/submission idempotency key when no session exists', () => {
    expect(externalLeadIdForSubmission(submission())).toBe('tally:dWvEqN:sub_1');
  });
});
