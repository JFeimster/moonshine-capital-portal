export type Role = 'admin' | 'portal';

export function hasAccess(role: Role | null | undefined, route: string): boolean {
  if (!role) return false;

  if (route.startsWith('/admin')) {
    return role === 'admin';
  }

  if (route.startsWith('/portal')) {
    return role === 'admin' || role === 'portal';
  }

  return false;
}
