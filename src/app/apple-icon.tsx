import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f3c4d7, #c8b6e2)',
          borderRadius: '40px',
        }}
      >
        <div style={{ fontSize: '100px', display: 'flex' }}>👗</div>
      </div>
    ),
    { ...size }
  );
}
