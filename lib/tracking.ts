export async function trackBrokerCtaClick(payload: any) {
  const webhookUrl = process.env.N8N_CTA_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[Tracking] N8N_CTA_WEBHOOK_URL not set. Skipping trackBrokerCtaClick.', payload);
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(`[Tracking] Webhook failed with status: ${res.status}`);
    }
  } catch (err) {
    console.error('[Tracking] Failed to track CTA click:', err);
  }
}
