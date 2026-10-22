import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendPartnerApplication } from '../lib/partner-crm-ingest';

const ENV_KEYS = ['PARTNER_CRM_INGEST_URL', 'PARTNER_CRM_INGEST_TOKEN', 'PARTNER_CRM_REQUIRED'] as const;
const originalEnv = Object.fromEntries(ENV_KEYS.map(key => [key, process.env[key]]));
const url = 'https://loaowmappekunngjknnx.supabase.co/functions/v1/partner-crm-ingest';

afterEach(() => {
  for (const key of ENV_KEYS) {
    const val = originalEnv[key];
    if (val === undefined) delete process.env[key]; else process.env[key] = val;
  }
  vi.unstubAllGlobals();
});

const payload = { source: 'tally', submission_id: 'test-123', email: 'test@example.invalid' };

describe('canonical partner CRM forwarding', () => {
  it('leaves the legacy Notion intake working before activation', async () => {
    delete process.env.PARTNER_CRM_INGEST_URL;
    delete process.env.PARTNER_CRM_INGEST_TOKEN;
    delete process.env.PARTNER_CRM_REQUIRED;
    expect(await sendPartnerApplication(payload)).toEqual({ configured: false, delivered: false });
  });

  it('rejects missing or mismatched production configuration instead of silently losing the write', async () => {
    process.env.PARTNER_CRM_REQUIRED = 'true';
    delete process.env.PARTNER_CRM_INGEST_URL;
    delete process.env.PARTNER_CRM_INGEST_TOKEN;
    await expect(sendPartnerApplication(payload)).rejects.toThrow('partner_crm_not_configured');
    process.env.PARTNER_CRM_INGEST_URL = url;
    await expect(sendPartnerApplication(payload)).rejects.toThrow('partner_crm_configuration_incomplete');
    process.env.PARTNER_CRM_INGEST_TOKEN = 'synthetic-unit-test-token';
    process.env.PARTNER_CRM_INGEST_URL = 'https://example.invalid/collect';
    await expect(sendPartnerApplication(payload)).rejects.toThrow('partner_crm_configuration_incomplete');
  });

  it('delivers a canonical receipt and accepts idempotent replay', async () => {
    process.env.PARTNER_CRM_INGEST_URL = url;
    process.env.PARTNER_CRM_INGEST_TOKEN = 'synthetic-unit-test-token';
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, application_id: 'test-app', duplicate: false }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, application_id: 'test-app', duplicate: true }) });
    vi.stubGlobal('fetch', fetchMock);
    expect(await sendPartnerApplication(payload)).toEqual({ configured: true, delivered: true, duplicate: false });
    expect(await sendPartnerApplication(payload)).toEqual({ configured: true, delivered: true, duplicate: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejects upstream errors and invalid receipts so Tally can retry', async () => {
    process.env.PARTNER_CRM_INGEST_URL = url;
    process.env.PARTNER_CRM_INGEST_TOKEN = 'synthetic-unit-test-token';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: false }) }));
    await expect(sendPartnerApplication(payload)).rejects.toThrow('partner_crm_ingest_http_503');
    await expect(sendPartnerApplication(payload)).rejects.toThrow('partner_crm_invalid_receipt');
  });
});
