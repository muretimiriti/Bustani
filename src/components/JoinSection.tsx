'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, heroItem, viewportConfig } from '@/lib/variants';

export default function JoinSection() {
  return (
    <section id="join" className="section-pad" style={{ background: 'var(--blue-mid)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative rings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewportConfig}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          position: 'absolute', right: '-8rem', top: '50%', transform: 'translateY(-50%)',
          width: '36rem', height: '36rem', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewportConfig}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
        style={{
          position: 'absolute', right: '-5rem', top: '50%', transform: 'translateY(-50%)',
          width: '24rem', height: '24rem', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ maxWidth: '680px' }}
        >
          <motion.span variants={heroItem} style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.3em',
            textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.55)',
            display: 'inline-block', marginBottom: '0.5rem',
          }}>
            Membership
          </motion.span>

          <motion.span variants={heroItem} style={{
            display: 'block', width: '2.5rem', height: '2px',
            background: 'var(--gold-bright)', marginBottom: '1.75rem',
          }} />

          <motion.h2 variants={heroItem} style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff', margin: '0 0 1.25rem', lineHeight: 1.15,
          }}>
            Shape the Future of Northlands
          </motion.h2>

          <motion.p variants={heroItem} style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.75)', margin: '0 0 0.875rem',
          }}>
            Rotary membership is an invitation to something greater than yourself — a lifelong
            commitment to professional excellence, authentic fellowship, and service that endures.
          </motion.p>
          <motion.p variants={heroItem} style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.75)', margin: '0 0 2.75rem',
          }}>
            We welcome established professionals who are ready to invest their skills, networks,
            and passion into building a better community — one project at a time.
          </motion.p>

          <motion.div variants={heroItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Link href="/membership" className="btn-gold">
                Apply for Membership
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Link href="/contact" className="btn-outline-blue">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
