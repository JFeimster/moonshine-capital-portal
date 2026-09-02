import { ImageResponse } from 'next/og';
import { SITE_CONFIG } from '@/lib/site-config';

export const runtime = 'edge';
export const alt = 'Distilled Funding';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FAF9F5',
          color: '#000000',
          border: '18px solid #000000',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 900, textTransform: 'uppercase' }}>
          {SITE_CONFIG.publicBrand}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', fontSize: 70, lineHeight: 1, fontWeight: 900, textTransform: 'uppercase', maxWidth: 980 }}>
            The Marketplace for Operators Who Move Money
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, background: '#FDE047', border: '6px solid #000000', padding: '14px 22px', alignSelf: 'flex-start' }}>
            capital.distilledfunding.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
