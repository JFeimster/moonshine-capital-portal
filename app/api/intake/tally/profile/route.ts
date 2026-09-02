import { NextRequest, NextResponse } from 'next/server';
import { processFundingAgentProfile } from '@/lib/intake/funding-agent';
import { validateWebhookAuth } from '@/lib/webhook-auth';

export async function POST(req: NextRequest) {
  try {
    if (!validateWebhookAuth(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    // Trusted compatibility endpoint for callers that already normalize Tally data.
    // Raw Tally webhook traffic should use POST /api/webhooks/tally.
    const result = await processFundingAgentProfile(await req.json());
    return NextResponse.json(result.body, { status: result.status });
  } catch (error: any) {
    console.error('Error processing profile webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
