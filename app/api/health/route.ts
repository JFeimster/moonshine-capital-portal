import { NextResponse } from 'next/server';
import { getHealthPayload } from '@/lib/observability';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getHealthPayload(), {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
