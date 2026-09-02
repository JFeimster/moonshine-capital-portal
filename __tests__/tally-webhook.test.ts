import { afterEach, describe, expect, it } from 'vitest';
import { createHmac } from 'crypto';
import {
  parseTallySubmission,
  verifyTallyWebhookSignature
} from '../lib/tally-webhook';

const originalSigningSecret = process.env.TALLY_SIGNING_SECRET;
const originalWebhookSecret = process.env.TALLY_WEBHOOK_SECRET;

afterEach(() => {
  if (originalSigningSecret === undefined) delete process.env.TALLY_SIGNING_SECRET;
  else process.env.TALLY_SIGNING_SECRET = originalSigningSecret;
  if (originalWebhookSecret === undefined) delete process.env.TALLY_WEBHOOK_SECRET;
  else process.env.TALLY_WEBHOOK_SECRET = originalWebhookSecret;
});

describe('Tally webhook signature verification', () => {
  it('accepts Tally HMAC signatures in base64 and hex', () => {
    process.env.TALLY_SIGNING_SECRET = 'test-signing-secret';
    const body = JSON.stringify({ eventType: 'FORM_RESPONSE', data: { formId: 'rjM6do' } });
    const digest = createHmac('sha256', 'test-signing-secret').update(body).digest();

    expect(verifyTallyWebhookSignature(body, digest.toString('base64'))).toBe(true);
    expect(verifyTallyWebhookSignature(body, `sha256=${digest.toString('hex')}`)).toBe(true);
  });

  it('fails closed for a missing secret, missing signature, or invalid signature', () => {
    delete process.env.TALLY_SIGNING_SECRET;
    delete process.env.TALLY_WEBHOOK_SECRET;
    expect(verifyTallyWebhookSignature('{}', 'anything')).toBe(false);

    process.env.TALLY_SIGNING_SECRET = 'configured';
    expect(verifyTallyWebhookSignature('{}', null)).toBe(false);
    expect(verifyTallyWebhookSignature('{}', 'wrong')).toBe(false);
  });
});

describe('parseTallySubmission', () => {
  it('maps the canonical Funding Agent Join fields and attribution', () => {
    const submission = parseTallySubmission({
      eventId: 'evt_join',
      eventType: 'FORM_RESPONSE',
      data: {
        formId: 'rjM6do',
        submissionId: 'sub_join',
        fields: [
          { questionId: 'a3213a38-01fe-46a4-8bec-bcad74db0c75', label: 'Full name', value: 'Jane Agent' },
          { questionId: 'b46a1d1b-815f-457f-a394-05a68a3af832', label: 'Email', value: 'JANE@EXAMPLE.COM' },
          { questionId: 'c0beb98f-70af-44c8-807f-e578df9908e1', label: 'Mobile phone', value: '+15555550100' },
          { key: 'utm_source', value: 'partner-profile' },
          { key: 'originPage', value: 'https://example.com/broker/jane' }
        ]
      }
    });

    expect(submission.kind).toBe('funding_agent_join');
    expect(submission.fields.fullName).toBe('Jane Agent');
    expect(submission.fields.email).toBe('JANE@EXAMPLE.COM');
    expect(submission.fields.phoneNumber).toBe('+15555550100');
    expect(submission.hidden.utm_source).toBe('partner-profile');
    expect(submission.hidden.originPage).toBe('https://example.com/broker/jane');
  });

  it('decodes profile multi-select and CTA option UUIDs into canonical labels', () => {
    const submission = parseTallySubmission({
      eventId: 'evt_profile',
      data: {
        formId: '9qjWEE',
        submissionId: 'sub_profile',
        fields: [
          { questionId: '4568b5d4-c9bd-4354-bf26-50b9fb15f1ed', value: 'agent@example.com' },
          {
            questionId: 'b3dac573-4579-4f89-a908-520259bb1107',
            value: [
              'fd222163-778f-45fa-95b7-51ab2c7829c2',
              'de230ad0-116d-474d-bb29-884f3fb4a211'
            ]
          },
          { questionId: 'e03751cc-0436-4058-ae3b-92bd63ab664f', value: ['cde8fcab-6322-4491-8d83-e84973db0efe'] },
          { questionId: 'f3845ef5-a7d6-407f-93c2-19d553785fc3', value: '50f7efc5-fd91-4b2d-9f7a-5e7c1502c31c' }
        ]
      }
    });

    expect(submission.fields.fundingTypes).toEqual(['Line of Credit', 'Business Acquisition Financing']);
    expect(submission.fields.markets).toEqual(['Nationwide']);
    expect(submission.fields.primaryCtaLabel).toBe('Book a Call');
  });

  it('maps the canonical lightweight funding intake', () => {
    const submission = parseTallySubmission({
      eventId: 'evt_funding',
      data: {
        formId: 'dWvEqN',
        submissionId: 'sub_funding',
        fields: [
          { questionId: '3d553258-4fca-4765-a8eb-455876f75e70', value: 75000 },
          { questionId: '610cfff5-b10b-45f3-be29-f0282884c413', value: 'Acme LLC' },
          { questionId: '487c4ab5-791a-41f9-9fc6-8239d24f1375', value: '$15k-$50k' },
          { questionId: '333605ed-6542-4ae1-96db-bfe95d38888e', value: 'Jane' },
          { questionId: '9ef8671c-d154-44b3-85c3-c2797adef725', value: 'Doe' },
          { questionId: '9a7a2801-f406-4343-a310-ab27ed1fa63b', value: 'jane@example.com' },
          { key: 'session_id', value: 'session-123' }
        ]
      }
    });

    expect(submission.kind).toBe('funding_intake');
    expect(submission.fields.requestedAmount).toBe(75000);
    expect(submission.fields.businessName).toBe('Acme LLC');
    expect(submission.hidden.session_id).toBe('session-123');
  });

  it('decodes the full-application amount range without projecting DOB or residential address', () => {
    const submission = parseTallySubmission({
      eventId: 'evt_full',
      data: {
        formId: 'w4R2Ad',
        submissionId: 'sub_full',
        fields: [
          { questionId: 'd35989c8-f883-4513-b9a4-a6c06fd9b0af', value: 'cf7737fa-5107-40f7-8c97-46649a729fa9' },
          { questionId: '651cbff8-9e8f-4114-b020-94c0df5bcef8', value: 'Jane' },
          { questionId: 'c43e6de2-4ec3-4e56-ad9b-846fb1a0cdc6', value: 'Doe' },
          { questionId: '6c8665cf-8bb3-4795-b785-5f3e146ff960', value: 'jane@example.com' },
          { questionId: 'ccea9843-8eab-4c4a-a80c-5e3a57ca84d7', label: 'Birth date', value: '1990-01-01' },
          { questionId: 'bd90c484-66b0-4a50-a118-546c94299d5b', label: 'Address', value: '123 Main St' }
        ]
      }
    });

    expect(submission.kind).toBe('funding_application');
    expect(submission.fields.requestedAmountRangeRaw).toBe('$100,000 - $149,999');
    expect(Object.keys(submission.fields)).not.toContain('birthDate');
    expect(Object.keys(submission.fields)).not.toContain('address');
    expect(JSON.stringify(submission.fields)).not.toContain('1990-01-01');
    expect(JSON.stringify(submission.fields)).not.toContain('123 Main St');
  });
});
