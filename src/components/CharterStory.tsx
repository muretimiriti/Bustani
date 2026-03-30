'use client';

import { motion } from 'framer-motion';
import { fadeUp, slideInLeft, staggerContainer, viewportConfig } from '@/lib/variants';

const timeline = [
  {
    date: 'July 2025',
    title: 'The Seed is Planted',
    body: 'A group of committed professionals begins gathering in Northlands under the wing of the Rotary Club of Juja, operating as a satellite club. Weekly meetings at Bedarin Hotel, Bypass take shape — building fellowship, exploring Rotary\'s values, and laying the groundwork for something enduring.',
    isCharter: false,
  },
  {
    date: 'September 2025',
    title: 'We Become Bustani',
    body: 'Membership grows rapidly. The group adopts the name "Bustani" — Swahili for garden — capturing the vision of cultivation and growth at the heart of the club. The decision is made to pursue full independent charter status.',
    isCharter: false,
  },
  {
    date: 'December 2025',
    title: 'Service Begins',
    body: 'With 35 active members, the club launches its first major service projects: the Gachororo Community Medical Camp (600+ people served) and the YoungLife Africa Early Christmas Visit. The club demonstrates it is ready to charter.',
    isCharter: false,
  },
  {
    date: '23 March 2026',
    title: 'Charter Day',
    body: 'The Rotary Club of Northlands Bustani is officially chartered by Rotary International, sponsored by the Rotary Club of Juja. A historic milestone for our 35 members, our families, and every community we will serve.',
    isCharter: true,
  },
];

export default function CharterStory() {
  return (
    <section id="charter-story" className="section-pad" style={{ background: 'var(--bg-sand-light)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ marginBottom: '4rem' }}
        >
          <span className="eyebrow">Our Story</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '560px' }}>
            From Vision to Charter
          </h2>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ position: 'relative', maxWidth: '760px' }}
        >
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{
              position: 'absolute', left: '1.25rem', top: '2rem', bottom: '2rem',
              width: '1px', background: 'var(--ink-rule)',
            }}
          />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              variants={slideInLeft}
              style={{ display: 'flex', gap: '2.5rem', marginBottom: i < timeline.length - 1 ? '3.5rem' : 0, paddingLeft: '0.25rem' }}
            >
              {/* Node */}
              <div style={{ flexShrink: 0, paddingTop: '0.2rem' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={viewportConfig}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.15 + 0.4 }}
                  whileHover={item.isCharter ? { scale: 1.2, rotate: 15 } : { scale: 1.1 }}
                  style={{
                    width: '2rem', height: '2rem', borderRadius: '50%',
                    border: item.isCharter ? '2px solid var(--gold-bright)' : '1px solid var(--ink-rule)',
                    background: item.isCharter ? 'var(--gold-bright)' : 'var(--bg-sand-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1, cursor: 'default',
                  }}
                >
                  {item.isCharter && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )}
                </motion.div>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: item.isCharter ? 'var(--gold-deep)' : 'var(--ink-muted)',
                  margin: '0 0 0.4rem',
                }}>{item.date}</p>
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: item.isCharter ? '1.5rem' : '1.25rem',
                  color: item.isCharter ? 'var(--blue-mid)' : 'var(--ink)', margin: '0 0 0.75rem',
                }}>
                  {item.title}
                  {item.isCharter && (
                    <span style={{
                      marginLeft: '0.75rem', fontSize: '0.75rem',
                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                      fontStyle: 'normal', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--gold-bright)', verticalAlign: 'middle',
                    }}>Official</span>
                  )}
                </h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '1rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>{item.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            marginTop: '4rem', maxWidth: '640px',
            background: 'var(--blue-ghost)', borderLeft: '3px solid var(--blue-mid)',
            padding: '1.75rem 2rem',
          }}
        >
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--blue-tint)', margin: '0 0 0.5rem',
          }}>Chartered by</p>
          <p style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: '1.25rem', color: 'var(--blue-mid)', margin: '0 0 0.5rem',
          }}>Rotary Club of Juja</p>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.9375rem', color: 'var(--ink-mid)', margin: 0,
          }}>
            District 9212 &mdash; a club distinguished by its commitment to environmental
            stewardship and community impact across Kenya.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
