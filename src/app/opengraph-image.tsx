import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Rotary Club of Northlands Bustani — Service Above Self';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #003f87 0%, #00274d 60%, #001a33 100%)',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold accent bar top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #d4a832 0%, #f0c040 50%, #d4a832 100%)',
          }}
        />

        {/* Subtle circle watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '2px solid rgba(212,168,50,0.15)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '2px solid rgba(212,168,50,0.1)',
          }}
        />

        {/* District badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '28px',
            background: 'rgba(212,168,50,0.12)',
            border: '1px solid rgba(212,168,50,0.35)',
            borderRadius: '4px',
            padding: '6px 18px',
          }}
        >
          <span
            style={{
              color: '#d4a832',
              fontSize: '13px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              fontWeight: 300,
            }}
          >
            Rotary International · District 9212 · Kenya
          </span>
        </div>

        {/* Club name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontSize: '62px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            Rotary Club of
          </span>
          <span
            style={{
              color: '#f0c040',
              fontSize: '62px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            Northlands Bustani
          </span>
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: '60px',
            height: '2px',
            background: '#d4a832',
            marginBottom: '24px',
          }}
        />

        {/* Tagline */}
        <span
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '22px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            fontWeight: 300,
          }}
        >
          Service Above Self
        </span>

        {/* Gold accent bar bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #d4a832 0%, #f0c040 50%, #d4a832 100%)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
