export interface HealthPayload {
  status: 'ok';
  service: 'moonshine-capital-portal';
  version: string;
}

function normalizeVersion(value: string | undefined) {
  if (!value) return 'unknown';
  const trimmed = value.trim();
  if (!trimmed) return 'unknown';
  return trimmed.slice(0, 12);
}

export function getBuildVersion() {
  return normalizeVersion(process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_SHA);
}

export function getHealthPayload(): HealthPayload {
  return {
    status: 'ok',
    service: 'moonshine-capital-portal',
    version: getBuildVersion(),
  };
}
