'use client';

import { useEffect, useRef } from 'react';
import heroImg from '@/app/images/pexels-kpaukshtite-2317921.jpg';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${heroImg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
      }}
    >
      {/* Dark blue gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(13,44,94,0.82) 0%, rgba(13,44,94,0.68) 55%, rgba(13,44,94,0.88) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '860px',
          padding: '0 1.5rem',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            margin: '0 0 0.5rem',
          }}
        >
          Rotary Club of
        </p>

        {/* Gold rule */}
        <span
          style={{
            display: 'block',
            width: '3rem',
            height: '2px',
            background: 'var(--gold-bright)',
            margin: '0 auto 1.75rem',
          }}
        />

        {/* Main headline */}
        <h1
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: 'clamp(2.75rem, 7vw, 6rem)',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: '0 0 1.25rem',
            letterSpacing: '-0.01em',
          }}
        >
          Northlands{' '}
          <span style={{ color: 'var(--gold-bright)' }}>Bustani</span>
        </h1>

        {/* Italic tagline */}
        <p
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            color: 'var(--gold-bright)',
            margin: '0 0 1rem',
          }}
        >
          Service Above Self
        </p>

        {/* Sub-label */}
        <p
          style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.875rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 3rem',
          }}
        >
          District 9212 &nbsp;·&nbsp; Chartered 23 March 2026
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a href="#join" className="btn-gold">
            Join Our Club
          </a>
          <a href="#about-rotary" className="btn-outline-white">
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll chevron */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          animation: 'bounce 2s ease-in-out infinite',
        }}
      >
        <a href="#about-rotary" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}
