import { ImageResponse } from 'next/og';

export const alt = "Barb's Closet - Your Personal Fashion Assistant";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fef7fb 0%, #f0e4f7 30%, #e8f4fd 60%, #fef0e4 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* Glass card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '32px',
            padding: '60px 80px',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #f3c4d7, #c8b6e2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              flexShrink: 0,
            }}
          >
            👗
          </div>
          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '72px', fontWeight: 700, color: '#2d2235', display: 'flex' }}>
              Barb&apos;s Closet
            </div>
            <div style={{ fontSize: '32px', color: '#8b7e96', marginTop: '12px', display: 'flex' }}>
              Your Personal Fashion Assistant
            </div>
            <div style={{ fontSize: '22px', color: '#c8b6e2', marginTop: '20px', display: 'flex' }}>
              AI-Powered Wardrobe • Smart Outfits • Weather Styling
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
