import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../app/api/health/route';
import { logger } from '../lib/logger';
import { getHealthPayload } from '../lib/observability';

describe('observability foundation', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('returns only the public-safe health contract', async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = '1234567890abcdef';
    process.env.NOTION_API_KEY = 'notion-secret';
    process.env.NOTION_FUNDING_LEADS_DB_ID = 'database-secret';
    process.env.TALLY_WEBHOOK_SECRET = 'tally-secret';

    const payload = getHealthPayload();
    expect(payload).toEqual({
      status: 'ok',
      service: 'moonshine-capital-portal',
      version: '1234567890ab',
    });
    expect(JSON.stringify(payload)).not.toContain('notion-secret');
    expect(JSON.stringify(payload)).not.toContain('database-secret');
    expect(JSON.stringify(payload)).not.toContain('tally-secret');

    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual(payload);
  });

  it('redacts secret-like structured log keys', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    logger.info('health-test', {
      route: '/api/health',
      apiKey: 'should-not-log',
      token: 'should-not-log-either',
    });

    expect(spy).toHaveBeenCalledOnce();
    const logged = String(spy.mock.calls[0][0]);
    expect(logged).toContain('health-test');
    expect(logged).toContain('/api/health');
    expect(logged).toContain('[REDACTED]');
    expect(logged).not.toContain('should-not-log');
  });
});
