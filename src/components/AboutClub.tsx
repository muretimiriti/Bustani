'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerFast, viewportConfig } from '@/lib/variants';
import FadeSlideshow from './FadeSlideshow';
import mem1 from '@/app/images/DSC_5729.jpg';
import mem2 from '@/app/images/DSC_5735.jpg';
import mem3 from '@/app/images/DSC_5737.jpg';

const memberPhotos = [mem1, mem2, mem3];

const stats = [
  { label: 'Charter Members', value: '56' },
  { label: 'Chartered', value: 'March 2026' },
  { label: 'District', value: '9212' },
  { label: 'Country', value: 'Kenya' },
];

export default function AboutClub() {
  return (
    <section id="about-club" className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ maxWidth: '720px' }}
        >
          <motion.span variants={fadeUp} className="eyebrow">Northlands Bustani</motion.span>
          <motion.span variants={fadeUp} className="gold-rule" />
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}>
            Rooted in Community.
            <br />Growing Together.
          </motion.h2>
          <motion.p variants={fadeUp} style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'var(--ink-mid)', marginBottom: '1.25rem',
          }}>
            The Rotary Club of Northlands Bustani brings together professionals from Northlands
            and the surrounding communities of Kenya, united by a commitment to service,
            fellowship, and enduring impact.
          </motion.p>
          <motion.p variants={fadeUp} style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'var(--ink-mid)', marginBottom: '3rem',
          }}>
            We began as a satellite club under the Rotary Club of Juja in July 2025, growing rapidly
            into a community of 56 dedicated professionals. In September 2025 we adopted the name
            "Bustani" and set our sights on full charter — achieving it on 23 March 2026. From our
            first meeting to our first medical camp serving over 600 people, we have been
            cultivating a garden of change — one project, one partnership, one member at a time.
          </motion.p>
        </motion.div>

        {/* Dual callout — Bustani + Ubuntu */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem' }}
        >
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ borderLeft: '3px solid var(--gold-bright)', paddingLeft: '2rem', flex: '1 1 280px', maxWidth: '440px' }}
          >
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: 'var(--blue-mid)', lineHeight: 1.4, margin: '0 0 0.5rem',
            }}>
              &ldquo;Bustani — a garden, a place of cultivation and growth.&rdquo;
            </p>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.8125rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--gold-deep)', margin: 0,
            }}>
              Bustani (boo-STAH-nee) &mdash; Swahili, from Arabic بُسْتَان
            </p>
          </motion.div>

          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ borderLeft: '3px solid var(--blue-tint)', paddingLeft: '2rem', flex: '1 1 280px', maxWidth: '440px' }}
          >
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: 'var(--blue-mid)', lineHeight: 1.4, margin: '0 0 0.5rem',
            }}>
              &ldquo;Ubuntu — I am because we are.&rdquo;
            </p>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.8125rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--ink-light)', margin: 0,
            }}>
              Ubuntu (oo-BOON-too) &mdash; Nguni Bantu philosophy of shared humanity
            </p>
          </motion.div>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: 'var(--blue-mid)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                border: '1px solid var(--ink-rule)', padding: '1rem 1.75rem', minWidth: '140px',
              }}
            >
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.25rem',
              }}>{s.label}</p>
              <p style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontWeight: 700, fontSize: '1.25rem', color: 'var(--blue-mid)', margin: 0,
              }}>{s.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Member photos */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ position: 'relative', height: '420px', overflow: 'hidden', marginTop: '3rem', borderRadius: '2px' }}
        >
          <FadeSlideshow images={memberPhotos} interval={4500} sizes="100vw" />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
            background: 'linear-gradient(to top, rgba(0,31,63,0.55) 0%, transparent 100%)',
            padding: '1.5rem 2rem 1.25rem',
          }}>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', margin: 0,
            }}>
              Our Members — Northlands Bustani
            </p>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2.5rem' }}
        >
          <Link href="/membership" className="btn-gold">Become a Member</Link>
          <Link href="/#charter-story" className="btn-outline-white" style={{ color: 'var(--blue-mid)', borderColor: 'var(--blue-mid)' }}>
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
