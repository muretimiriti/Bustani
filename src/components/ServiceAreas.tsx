
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/variants';

const services = [
  {
    title: 'Club Service',
    body: 'Nurturing the fellowship and operational strength of our club — so that we remain a vibrant, effective vehicle for service in every season.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 27c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Community Service',
    body: 'Hands-on engagement in Northlands and beyond — addressing local needs through sustainable projects that create measurable, lasting change.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4C11.029 4 7 8.029 7 13c0 6 9 15 9 15s9-9 9-15c0-4.971-4.029-9-9-9z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'International Service',
    body: 'Connecting with the global Rotary family to support humanitarian initiatives that transcend borders and reflect our shared humanity.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 16h22M16 5c-3 3-5 6.5-5 11s2 8 5 11M16 5c3 3 5 6.5 5 11s-2 8-5 11" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Vocational Service',
    body: 'Upholding the highest standards of ethics and excellence in our professional lives — using our skills as a platform for meaningful service.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="8" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 8V6a2 2 0 012-2h6a2 2 0 012 2v2M5 14h22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function ServiceAreas() {
  return (
    <section id="service-areas" className="section-pad" style={{ background: 'var(--bg-white)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ marginBottom: '4rem' }}
        >
          <span className="eyebrow">What We Do</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Four Avenues of Service</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
        >
          {services.map((s) => (
            // Outer div handles stagger entrance
            <motion.div key={s.title} variants={fadeUp}>
              {/* Inner div handles hover */}
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(23,69,143,0.12)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                style={{
                  borderTop: '3px solid var(--blue-mid)',
                  padding: '2rem 1.75rem',
                  background: 'var(--bg-off-white)',
                  height: '100%',
                }}
              >
                <motion.div
                  style={{ color: 'var(--blue-mid)', marginBottom: '1.25rem' }}
                  whileHover={{ scale: 1.2, color: 'var(--gold-bright)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {s.icon}
                </motion.div>
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.25rem', color: 'var(--blue-mid)', margin: '0 0 0.875rem',
                }}>{s.title}</h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>{s.body}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
