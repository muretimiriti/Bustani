'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import wheelImg from '@/app/images/rotary wheel.png';

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

const avenues = [
  { label: 'Club Service', icon: '⬡' },
  { label: 'Community Service', icon: '⬡' },
  { label: 'International Service', icon: '⬡' },
  { label: 'Vocational Service', icon: '⬡' },
];

export default function AboutRotary() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useFadeUp(leftRef);
  useFadeUp(rightRef);

  return (
    <section
      id="about-rotary"
      className="section-pad"
      style={{ background: 'var(--bg-white)' }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '5rem',
          alignItems: 'center',
        }}
      >
        {/* Left — text */}
        <div ref={leftRef} className="fade-up">
          <span className="eyebrow">About Rotary</span>
          <span className="gold-rule" />
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1.5rem',
            }}
          >
            A Global Force for Good
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
            Founded in 1905, Rotary International is one of the world&rsquo;s largest
            humanitarian service organisations, with more than 1.4 million members
            across 46,000 clubs in over 200 countries.
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '1.0625rem',
              lineHeight: 1.85,
              color: 'var(--ink-mid)',
              marginBottom: '2rem',
            }}
          >
            Rotary clubs bring together <strong style={{ fontWeight: 400, color: 'var(--ink)' }}>established professionals and community leaders</strong> committed
            to lifelong service — fostering lasting change through fellowship,
            integrity, and humanitarian action. Unlike Rotaract clubs (for young
            adults 18+), Rotary is an enduring professional commitment with no
            upper age limit.
          </p>

          {/* Avenue pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {avenues.map((a) => (
              <span
                key={a.label}
                style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--blue-mid)',
                  border: '1px solid var(--blue-ghost)',
                  background: 'var(--blue-ghost)',
                  borderRadius: '2px',
                  padding: '0.375rem 0.875rem',
                }}
              >
                {a.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right — wheel */}
        <div
          ref={rightRef}
          className="fade-up"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div
            style={{
              position: 'relative',
              width: 'min(340px, 100%)',
              aspectRatio: '1',
            }}
          >
            {/* Decorative ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-1.5rem',
                borderRadius: '50%',
                border: '1px solid var(--ink-rule)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '-3rem',
                borderRadius: '50%',
                border: '1px solid var(--bg-sand)',
              }}
            />
            <Image
              src={wheelImg}
              alt="Rotary Wheel — Mark of Excellence"
              fill
              style={{ objectFit: 'contain', padding: '1rem' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
