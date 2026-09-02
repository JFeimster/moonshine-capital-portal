import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RootError from '../app/error';
import PortalError from '../app/portal/error';
import AdminError from '../app/admin/error';

type ErrorSurfaceProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const surfaces: Array<[string, ComponentType<ErrorSurfaceProps>]> = [
  ['root', RootError],
  ['portal', PortalError],
  ['admin', AdminError],
];

describe('App Router resilience error surfaces', () => {
  it.each(surfaces)('%s error UI keeps exception details out of rendered output', (_name, Surface) => {
    const sensitiveMessage = 'NOTION_BROKER_DATABASE_ID=secret-db-id';
    const error = Object.assign(new Error(sensitiveMessage), {
      digest: 'private-error-digest',
    });

    const html = renderToStaticMarkup(
      createElement(Surface, {
        error,
        reset: vi.fn(),
      })
    );

    expect(html).not.toContain(sensitiveMessage);
    expect(html).not.toContain('private-error-digest');
    expect(html).toMatch(/retry/i);
  });
});
