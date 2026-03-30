'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp, viewportConfig } from '@/lib/variants';

export default function MeetingInfo() {
  return (
    <section style={{
      background: 'var(--bg-sand-light)',
      borderTop: '1px solid var(--ink-rule)',
      borderBottom: '1px solid var(--ink-rule)',
      padding: '4rem 1.5rem',
    }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '2rem',
        }}
      >
        {/* Label */}
        <motion.div variants={fadeUp}>
          <span style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'var(--ink-muted)',
            display: 'block', marginBottom: '0.5rem',
          }}>Weekly Meeting</span>
          <span style={{ display: 'block', width: '2rem', height: '2px', background: 'var(--gold-bright)', marginBottom: '1rem' }} />
          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            color: 'var(--blue-mid)', margin: 0,
          }}>
            We Meet Every Week
          </h2>
        </motion.div>

        {/* Details */}
        <motion.div variants={staggerContainer} style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
          {[
            { label: 'Day', value: 'Every Thursday' },
            { label: 'Time', value: '7:00 PM' },
            { label: 'Venue', value: 'Bedarin Hotel, Kihunguro' },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.25rem',
              }}>{item.label}</p>
              <p style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontWeight: 700, fontSize: '1.125rem', color: 'var(--ink)', margin: 0,
              }}>{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Link href="/news-events" style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--blue-mid)',
              textDecoration: 'none', borderBottom: '1px solid var(--blue-tint)',
              paddingBottom: '2px', whiteSpace: 'nowrap',
            }}>
              Full schedule &rarr;
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
