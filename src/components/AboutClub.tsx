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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

const stats = [
  { label: 'Chartered', value: 'March 2026' },
  { label: 'District', value: '9212' },
  { label: 'Country', value: 'Kenya' },
];

export default function AboutClub() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  useFadeUp(sectionRef);
  useFadeUp(quoteRef);

  return (
    <section
      id="about-club"
      className="section-pad"
      style={{ background: 'var(--bg-off-white)' }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div ref={sectionRef} className="fade-up" style={{ maxWidth: '720px' }}>
          <span className="eyebrow">Northlands Bustani</span>
          <span className="gold-rule" />
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1.5rem',
            }}
          >
            Rooted in Community.
            <br />
            Growing Together.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '1.0625rem',
              lineHeight: 1.85,
              color: 'var(--ink-mid)',
              marginBottom: '1.25rem',
            }}
          >
            The Rotary Club of Northlands Bustani brings together professionals from
            Northlands and the surrounding communities of Kenya, united by a
            commitment to service, fellowship, and enduring impact. Our club
            represents a new generation of Rotary — dynamic, purposeful, and
            deeply connected to the communities we serve.
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '1.0625rem',
              lineHeight: 1.85,
              color: 'var(--ink-mid)',
              marginBottom: '3rem',
            }}
          >
            We began as a gathering of like-minded professionals who believed that
            service is not merely an act, but a way of life. From our very first
            meeting, we have been cultivating a garden of change — one project,
            one partnership, one member at a time.
          </p>
        </div>

        {/* "Bustani" definition callout */}
        <div
          ref={quoteRef}
          className="fade-up"
          style={{
            borderLeft: '3px solid var(--gold-bright)',
            paddingLeft: '2rem',
            marginBottom: '3.5rem',
            maxWidth: '640px',
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              color: 'var(--blue-mid)',
              lineHeight: 1.4,
              margin: '0 0 0.75rem',
            }}
          >
            &ldquo;Bustani — a garden, a place of cultivation and growth.&rdquo;
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '0.8125rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold-deep)',
              margin: 0,
            }}
          >
            Bustani (boo-STAH-nee) &mdash; Swahili, from Arabic بُسْتَان
          </p>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                border: '1px solid var(--ink-rule)',
                padding: '1rem 1.75rem',
                minWidth: '140px',
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  margin: '0 0 0.25rem',
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--blue-mid)',
                  margin: 0,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
