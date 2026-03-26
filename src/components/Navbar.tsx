'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '@/app/images/Rotary Logo_EN21.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about-rotary' },
    { label: 'Our Story', href: '#charter-story' },
    { label: 'Service', href: '#service-areas' },
    { label: 'Our Family', href: '#rotary-family' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.35s ease, box-shadow 0.35s ease',
        background: scrolled ? '#ffffff' : 'transparent',
        boxShadow: scrolled ? '0 1px 0 var(--ink-rule)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src={logo}
            alt="Rotary Club of Northlands Bustani"
            height={36}
            style={{
              height: '36px',
              width: 'auto',
              filter: scrolled ? 'none' : 'brightness(0) invert(1)',
              transition: 'filter 0.35s ease',
            }}
          />
        </a>

        {/* Desktop nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${scrolled ? '' : 'nav-link-white'}`}
              style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.8125rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: scrolled ? 'var(--ink-mid)' : 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            className="btn-gold"
            style={{ padding: '0.625rem 1.5rem', fontSize: '0.75rem' }}
          >
            Become a Member
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: scrolled ? 'var(--ink)' : '#ffffff',
          }}
          aria-label="Toggle menu"
          className="show-mobile"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid var(--ink-rule)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-mid)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            className="btn-gold"
            onClick={() => setMenuOpen(false)}
            style={{ textAlign: 'center', marginTop: '0.5rem' }}
          >
            Become a Member
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </header>
  );
}
