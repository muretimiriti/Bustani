'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerFast, viewportConfig } from '@/lib/variants';

const stats = [
  { label: 'Active Members', value: '35' },
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
            into a community of 35 dedicated professionals. In September 2025 we adopted the name
            "Bustani" and set our sights on full charter — achieving it on 23 March 2026. From our
            first meeting to our first medical camp serving over 600 people, we have been
            cultivating a garden of change — one project, one partnership, one member at a time.
          </motion.p>
        </motion.div>

        {/* Bustani callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            borderLeft: '3px solid var(--gold-bright)',
            paddingLeft: '2rem', marginBottom: '3.5rem', maxWidth: '640px',
          }}
        >
          <p style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700, fontStyle: 'italic',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            color: 'var(--blue-mid)', lineHeight: 1.4, margin: '0 0 0.75rem',
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
      </div>
    </section>
  );
}
