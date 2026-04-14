
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { heroContainer, heroItem } from '@/lib/variants';
import FadeSlideshow from './FadeSlideshow';

const heroSlides = [
  '/images/pexels-andrea-harmatne-juszku-2151089039-31652822.jpg',
  '/images/pexels-carsten-busch-904667880-27965195.jpg',
  '/images/pexels-todd-trapani-488382-5022309.jpg',
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Parallax background slideshow */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-10%',
          y: bgY,
          zIndex: 0,
        }}
      >
        <FadeSlideshow images={heroSlides} interval={5000} />
      </motion.div>

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(13,44,94,0.82) 0%, rgba(13,44,94,0.68) 55%, rgba(13,44,94,0.88) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '860px',
          padding: '0 1.5rem',
        }}
      >
        {/* Eyebrow */}
        <motion.p variants={heroItem} style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.35em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '0 0 0.5rem',
        }}>
          Rotary Club of
        </motion.p>

        {/* Gold rule */}
        <motion.span variants={heroItem} style={{
          display: 'block', width: '3rem', height: '2px',
          background: 'var(--gold-bright)', margin: '0 auto 1.75rem',
        }} />

        {/* Headline */}
        <motion.h1 variants={heroItem} style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: 'clamp(2.75rem, 7vw, 6rem)',
          color: '#ffffff', lineHeight: 1.1, margin: '0 0 1.25rem', letterSpacing: '-0.01em',
        }}>
          Northlands{' '}
          <span style={{ color: 'var(--gold-bright)' }}>Bustani</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p variants={heroItem} style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          fontWeight: 700, fontStyle: 'italic',
          fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
          color: 'var(--gold-bright)', margin: '0 0 1rem',
        }}>
          Service Above Self
        </motion.p>

        {/* Sub-label */}
        <motion.p variants={heroItem} style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300, fontSize: '0.875rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 3rem',
        }}>
          District 9212 &nbsp;·&nbsp; Chartered 23 March 2026
        </motion.p>

        {/* CTAs */}
        <motion.div variants={heroItem} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.a
            href="#join"
            className="btn-gold"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Join Our Club
          </motion.a>
          <motion.a
            href="#about-rotary"
            className="btn-outline-white"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll chevron */}
      <motion.div
        style={{ position: 'absolute', bottom: '2.5rem', left: '50%', x: '-50%', zIndex: 2 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <a href="#about-rotary" aria-label="Scroll to content" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
