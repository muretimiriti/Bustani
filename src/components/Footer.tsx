'use client';

import Image from 'next/image';
import logo from '@/app/images/Rotary Logo_EN21.png';

const quickLinks = [
  { label: 'About Rotary', href: '#about-rotary' },
  { label: 'Our Club', href: '#about-club' },
  { label: 'Our Story', href: '#charter-story' },
  { label: 'Service Areas', href: '#service-areas' },
  { label: 'Our Family', href: '#rotary-family' },
  { label: 'Membership', href: '#join' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--blue-dark)', color: '#ffffff' }}>
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '5rem 1.5rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* Brand column */}
        <div style={{ gridColumn: 'span 1' }}>
          <Image
            src={logo}
            alt="Rotary Club of Northlands Bustani"
            height={40}
            style={{
              height: '40px',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              marginBottom: '1.5rem',
              display: 'block',
            }}
          />
          <p style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'var(--gold-bright)',
            margin: '0 0 1rem',
          }}>
            Service Above Self
          </p>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.875rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
          }}>
            A professional service organisation rooted in Northlands, Kenya.
            Part of Rotary International District 9212.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            margin: '0 0 1.25rem',
          }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {quickLinks.map((l) => (
              <li key={l.href} style={{ marginBottom: '0.625rem' }}>
                <a
                  href={l.href}
                  style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: '0.9375rem',
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            margin: '0 0 1.25rem',
          }}>
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                margin: '0 0 0.2rem',
              }}>Email</p>
              <a
                href="mailto:info@northlandsbustani.org"
                style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: '0.9375rem',
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                }}
              >
                info@northlandsbustani.org
              </a>
            </div>
            <div>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                margin: '0 0 0.2rem',
              }}>Location</p>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.9375rem',
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
              }}>Northlands, Kenya</p>
            </div>
            <div>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                margin: '0 0 0.2rem',
              }}>District</p>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.9375rem',
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
              }}>Rotary International District 9212</p>
            </div>
          </div>
        </div>

        {/* About Rotary */}
        <div>
          <h4 style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            margin: '0 0 1.25rem',
          }}>
            About Rotary
          </h4>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.875rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.5)',
            margin: '0 0 1rem',
          }}>
            Rotary International is a global network of 1.4 million professionals
            in 46,000+ clubs united by a commitment to humanitarian service and
            fellowship.
          </p>
          <a
            href="https://www.rotary.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--gold-bright)',
              textDecoration: 'none',
            }}
          >
            rotary.org &rarr;
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <p style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.3)',
          margin: 0,
        }}>
          &copy; 2026 Rotary Club of Northlands Bustani &middot; District 9212 &middot; All rights reserved
        </p>
        <p style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.25)',
          margin: 0,
        }}>
          Chartered 23 March 2026 &middot; Rotary Club of Juja
        </p>
      </div>
    </footer>
  );
}
