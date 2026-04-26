const fallbackBrokerSlug = 'darwin-hanneman';

export type PortalBrokerContextSource = 'fallback' | 'auth';

export interface PortalBrokerContext {
  slug: string;
  source: PortalBrokerContextSource;
  isFallback: boolean;
  label: string;
}

export async function resolvePortalBrokerContext(): Promise<PortalBrokerContext> {
  // Auth/session/member-aware resolution plugs in here later.
  // Keep this helper fallback-driven until portal auth is explicitly scoped.
  return {
    slug: fallbackBrokerSlug,
    source: 'fallback',
    isFallback: true,
    label: 'Safe fallback broker context',
  };
}
