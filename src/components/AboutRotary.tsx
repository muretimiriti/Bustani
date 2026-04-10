
import { motion } from 'framer-motion';
import { fadeUp, slideInLeft, slideInRight, staggerContainer, viewportConfig } from '@/lib/variants';
import wheelImg from '@/app/images/rotary wheel.png';

const avenues = [
  'Club Service',
  'Community Service',
  'International Service',
  'Vocational Service',
];

export default function AboutRotary() {
  return (
    <section id="about-rotary" className="section-pad" style={{ background: 'var(--bg-white)' }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '5rem', alignItems: 'center',
      }}>
        {/* Left — text */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <span className="eyebrow">About Rotary</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}>
            A Global Force for Good
          </h2>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'var(--ink-mid)', marginBottom: '1.25rem',
          }}>
            Founded in 1905, Rotary International is one of the world&rsquo;s largest humanitarian
            service organisations, with more than 1.4 million members across 46,000 clubs in
            over 200 countries.
          </p>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'var(--ink-mid)', marginBottom: '2rem',
          }}>
            Rotary clubs bring together{' '}
            <strong style={{ fontWeight: 400, color: 'var(--ink)' }}>
              established professionals and community leaders
            </strong>{' '}
            committed to lifelong service. Unlike Rotaract clubs (for young adults 18+),
            Rotary is an enduring professional commitment with no upper age limit.
          </p>

          {/* Avenue pills */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}
          >
            {avenues.map((a) => (
              <motion.span
                key={a}
                variants={fadeUp}
                whileHover={{ scale: 1.05, backgroundColor: 'var(--blue-mid)', color: '#ffffff' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--blue-mid)',
                  border: '1px solid var(--blue-ghost)', background: 'var(--blue-ghost)',
                  borderRadius: '2px', padding: '0.375rem 0.875rem',
                  cursor: 'default', display: 'inline-block',
                }}
              >
                {a}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — wheel */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            style={{ position: 'relative', width: 'min(340px, 100%)', aspectRatio: '1' }}
          >
            <div style={{
              position: 'absolute', inset: '-1.5rem', borderRadius: '50%',
              border: '1px solid var(--ink-rule)',
            }} />
            <div style={{
              position: 'absolute', inset: '-3rem', borderRadius: '50%',
              border: '1px solid var(--bg-sand)',
            }} />
            <img
              src={wheelImg}
              alt="Rotary Wheel — Mark of Excellence"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
