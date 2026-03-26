'use client';

import { useEffect, useRef } from 'react';

function useFadeUp(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

export default function JoinSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  useFadeUp(contentRef);

  return (
    <section
      id="join"
      className="section-pad"
      style={{
        background: 'var(--blue-mid)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative rings */}
      <div style={{
        position: 'absolute', right: '-8rem', top: '50%',
        transform: 'translateY(-50%)', width: '36rem', height: '36rem',
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: '-5rem', top: '50%',
        transform: 'translateY(-50%)', width: '24rem', height: '24rem',
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 1.5rem', position: 'relative', zIndex: 1,
      }}>
        <div ref={contentRef} className="fade-up" style={{ maxWidth: '680px' }}>
          <span style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.3em',
            textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.55)',
            display: 'inline-block', marginBottom: '0.5rem',
          }}>
            Membership
          </span>
          <span style={{
            display: 'block', width: '2.5rem', height: '2px',
            background: 'var(--gold-bright)', marginBottom: '1.75rem',
          }} />

          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff', margin: '0 0 1.25rem', lineHeight: 1.15,
          }}>
            Shape the Future of Northlands
          </h2>

          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.75)', margin: '0 0 0.875rem',
          }}>
            Rotary membership is an invitation to something greater than
            yourself — a lifelong commitment to professional excellence,
            authentic fellowship, and service that endures.
          </p>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.75)', margin: '0 0 2.75rem',
          }}>
            We welcome established professionals who are ready to invest
            their skills, networks, and passion into building a better
            community — one project at a time.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:info@northlandsbustani.org" className="btn-gold">
              Apply for Membership
            </a>
            <a href="mailto:info@northlandsbustani.org" className="btn-outline-blue">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
