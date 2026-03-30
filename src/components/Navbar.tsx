'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import logo from '@/app/images/Rotary Logo_EN21.png';

const navLinks = [
  { label: 'About', href: '/#about-rotary', isPage: false },
  { label: 'Projects', href: '/projects', isPage: true },
  { label: 'Gallery', href: '/gallery', isPage: true },
  { label: 'News & Events', href: '/news-events', isPage: true },
  { label: 'Leadership', href: '/leadership', isPage: true },
  { label: 'Contact', href: '/contact', isPage: true },
];

const drawerVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

const drawerItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' as const },
  }),
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const opaque = !isHome || scrolled;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'background 0.35s ease, box-shadow 0.35s ease',
      background: opaque ? '#ffffff' : 'transparent',
      boxShadow: opaque ? '0 1px 0 var(--ink-rule)' : 'none',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem',
        height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Image
              src={logo}
              alt="Rotary Club of Northlands Bustani"
              height={36}
              style={{
                height: '36px', width: 'auto',
                filter: opaque ? 'none' : 'brightness(0) invert(1)',
                transition: 'filter 0.35s ease',
              }}
            />
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          {navLinks.map((link) => {
            const isActive = link.isPage && pathname === link.href;
            const linkStyle = {
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.8125rem', letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: opaque
                ? isActive ? 'var(--blue-mid)' : 'var(--ink-mid)'
                : 'rgba(255,255,255,0.9)',
              textDecoration: 'none', transition: 'color 0.25s ease',
            };
            return link.isPage ? (
              <motion.div key={link.href} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                <Link href={link.href} className={`nav-link ${opaque ? '' : 'nav-link-white'}`} style={linkStyle}>
                  {link.label}
                </Link>
              </motion.div>
            ) : (
              <motion.div key={link.href} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                <a href={link.href} className={`nav-link ${opaque ? '' : 'nav-link-white'}`} style={linkStyle}>
                  {link.label}
                </a>
              </motion.div>
            );
          })}
          <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Link href="/membership" className="btn-gold" style={{ padding: '0.625rem 1.5rem', fontSize: '0.75rem' }}>
              Become a Member
            </Link>
          </motion.div>
        </nav>

        {/* Mobile hamburger */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
            color: opaque ? 'var(--ink)' : '#ffffff',
          }}
          aria-label="Toggle menu"
          className="show-mobile"
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.svg key="close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </motion.svg>
            ) : (
              <motion.svg key="open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              background: '#ffffff', borderTop: '1px solid var(--ink-rule)',
              padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
              overflow: 'hidden',
            }}
          >
            {[...navLinks, { label: 'Membership', href: '/membership', isPage: true }].map((link, i) =>
              link.isPage ? (
                <motion.div key={link.href} custom={i} variants={drawerItemVariants}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                      fontWeight: 300, fontSize: '0.875rem', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--ink-mid)', textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ) : (
                <motion.div key={link.href} custom={i} variants={drawerItemVariants}>
                  <a
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                      fontWeight: 300, fontSize: '0.875rem', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--ink-mid)', textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </a>
                </motion.div>
              )
            )}
            <motion.div custom={navLinks.length + 1} variants={drawerItemVariants} style={{ marginTop: '0.5rem' }}>
              <Link href="/membership" className="btn-gold" style={{ display: 'block', textAlign: 'center' }}>
                Become a Member
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
