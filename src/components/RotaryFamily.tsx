
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/variants';

const clubs = [
  {
    name: 'Rotary Club of Juja',
    role: 'Our Chartering Club',
    type: 'Rotary Club',
    body: 'The club that believed in us from the beginning. The Rotary Club of Juja sponsored our charter and welcomed us into the global Rotary family. Known for their environmental stewardship and community service across District 9212.',
    isParent: true,
  },
  {
    name: 'Rotaract Club of Youth Connect Kenya',
    role: 'Sister Club',
    type: 'Rotaract Club',
    body: 'A vibrant Rotaract club (for young adults 18+) that shares our values and geography. Rotaract clubs partner with Rotary clubs, bridging emerging youth leadership with established professional service.',
    isParent: false,
  },
  {
    name: 'Rotary Club of Mukurweini',
    role: 'Sister Club',
    type: 'Rotary Club',
    body: 'A fellow Rotary Club in our network — professional adult members committed to the same Four Avenues of Service, united by the bonds of District 9212 fellowship.',
    isParent: false,
  },
];

export default function RotaryFamily() {
  return (
    <section id="rotary-family" className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ marginBottom: '4rem' }}
        >
          <span className="eyebrow">Our Rotary Family</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '560px' }}>
            Connected Across Communities
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}
        >
          {clubs.map((club) => (
            <motion.div key={club.name} variants={fadeUp}>
              <motion.div
                whileHover={{
                  y: -6,
                  boxShadow: club.isParent
                    ? '0 16px 40px rgba(200,146,26,0.14)'
                    : '0 16px 40px rgba(23,69,143,0.12)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                style={{
                  background: '#ffffff', padding: '2rem', height: '100%',
                  borderBottom: club.isParent ? '3px solid var(--gold-bright)' : '3px solid var(--blue-mid)',
                }}
              >
                <span style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: club.type === 'Rotaract Club' ? 'var(--blue-tint)' : 'var(--blue-mid)',
                  display: 'inline-block', marginBottom: '0.75rem',
                }}>
                  {club.type}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {club.isParent && (
                    <motion.svg
                      width="14" height="14" viewBox="0 0 24 24" fill="var(--gold-bright)"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </motion.svg>
                  )}
                  <span style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: club.isParent ? 'var(--gold-deep)' : 'var(--ink-muted)',
                  }}>
                    {club.role}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.1875rem', color: 'var(--blue-mid)',
                  margin: '0 0 1rem', lineHeight: 1.3,
                }}>{club.name}</h3>

                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>{club.body}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.875rem', color: 'var(--ink-muted)',
            borderTop: '1px solid var(--ink-rule)', paddingTop: '1.5rem',
            maxWidth: '640px', lineHeight: 1.75,
          }}
        >
          <em>Note:</em> Rotaract clubs are for young adults (18+) and became an independent
          membership type in 2020. Rotary clubs are open to established professionals with no
          upper age limit. The two membership types are distinct yet complementary — together
          spanning generations of service.
        </motion.p>
      </div>
    </section>
  );
}
