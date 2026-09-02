import type { Role } from './session-token';

const INTERNAL_ORIGIN = 'https://moonshine.internal';

function getProtectedPathname(route: string): string | null {
  if (
    typeof route !== 'string' ||
    !route.startsWith('/') ||
    route.startsWith('//') ||
    route.includes('\\')
  ) {
    return null;
  }

  try {
    const url = new URL(route, INTERNAL_ORIGIN);
    if (url.origin !== INTERNAL_ORIGIN) return null;

    const { pathname } = url;
    if (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname === '/portal' ||
      pathname.startsWith('/portal/')
    ) {
      return pathname;
    }
  } catch {
    return null;
  }

  return null;
}

export function hasAccess(
  role: Role | null | undefined,
  route: string
): boolean {
  if (!role) return false;

  const pathname = getProtectedPathname(route);
  if (!pathname) return false;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return role === 'admin';
  }

  return role === 'admin' || role === 'portal';
}

export function defaultRouteForRole(role: Role): '/admin' | '/portal' {
  return role === 'admin' ? '/admin' : '/portal';
}

export function resolveAuthorizedReturnTo(
  role: Role,
  returnTo?: string | null
): string {
  if (returnTo && getProtectedPathname(returnTo) && hasAccess(role, returnTo)) {
    return returnTo;
  }

  return defaultRouteForRole(role);
}
