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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

const timeline = [
  {
    date: 'Mid 2025',
    title: 'The Seed is Planted',
    body: 'A circle of committed professionals begins gathering in Northlands. Weekly meetings take shape — building fellowship, defining purpose, and laying the groundwork for something enduring.',
    isCharter: false,
  },
  {
    date: 'Early 2026',
    title: 'Earning Our Charter',
    body: 'The club completes all Rotary International requirements. Under the sponsorship of the Rotary Club of Juja, the club formally petitions for official charter status.',
    isCharter: false,
  },
  {
    date: '23 March 2026',
    title: 'Charter Day',
    body: 'The Rotary Club of Northlands Bustani is officially chartered. A historic milestone for our members, our families, and every community we will serve.',
    isCharter: true,
  },
];

export default function CharterStory() {
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  useFadeUp(headerRef);
  useFadeUp(timelineRef);
  useFadeUp(calloutRef);

  return (
    <section
      id="charter-story"
      className="section-pad"
      style={{ background: 'var(--bg-sand-light)' }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        {/* Header */}
        <div ref={headerRef} className="fade-up" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow">Our Story</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '560px' }}>
            From Vision to Charter
          </h2>
        </div>

        {/* Timeline */}
        <div
          ref={timelineRef}
          className="fade-up"
          style={{
            position: 'relative',
            maxWidth: '760px',
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: '1.25rem',
              top: '2rem',
              bottom: '2rem',
              width: '1px',
              background: 'var(--ink-rule)',
            }}
          />

          {timeline.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '2.5rem',
                marginBottom: i < timeline.length - 1 ? '3.5rem' : 0,
                paddingLeft: '0.25rem',
              }}
            >
              {/* Node */}
              <div style={{ flexShrink: 0, paddingTop: '0.2rem' }}>
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    border: item.isCharter
                      ? '2px solid var(--gold-bright)'
                      : '1px solid var(--ink-rule)',
                    background: item.isCharter ? 'var(--gold-bright)' : 'var(--bg-sand-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {item.isCharter && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: item.isCharter ? 'var(--gold-deep)' : 'var(--ink-muted)',
                    margin: '0 0 0.4rem',
                  }}
                >
                  {item.date}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: item.isCharter ? '1.5rem' : '1.25rem',
                    color: item.isCharter ? 'var(--blue-mid)' : 'var(--ink)',
                    margin: '0 0 0.75rem',
                  }}
                >
                  {item.title}
                  {item.isCharter && (
                    <span
                      style={{
                        marginLeft: '0.75rem',
                        fontSize: '0.75rem',
                        fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                        fontStyle: 'normal',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--gold-bright)',
                        verticalAlign: 'middle',
                      }}
                    >
                      Official
                    </span>
                  )}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: 'var(--ink-mid)',
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chartering club callout */}
        <div
          ref={calloutRef}
          className="fade-up"
          style={{
            marginTop: '4rem',
            maxWidth: '640px',
            background: 'var(--blue-ghost)',
            borderLeft: '3px solid var(--blue-mid)',
            padding: '1.75rem 2rem',
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--blue-tint)',
              margin: '0 0 0.5rem',
            }}
          >
            Chartered by
          </p>
          <p
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--blue-mid)',
              margin: '0 0 0.5rem',
            }}
          >
            Rotary Club of Juja
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '0.9375rem',
              color: 'var(--ink-mid)',
              margin: 0,
            }}
          >
            District 9212 &mdash; a club distinguished by its commitment to
            environmental stewardship and community impact across Kenya.
          </p>
        </div>
      </div>
    </section>
  );
}
