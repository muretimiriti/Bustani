import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you — whether you're considering membership, proposing a project, or simply curious about Rotary."
      />

      {/* Meeting info highlight */}
      <section style={{ background: 'var(--blue-ghost)', padding: '3rem 1.5rem' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center',
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--blue-tint)', margin: '0 0 0.5rem',
            }}>
              The easiest way to reach us
            </p>
            <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'var(--blue-mid)', margin: '0 0 0.25rem' }}>
              Come to a Meeting
            </h2>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.9375rem', color: 'var(--ink-mid)', margin: 0,
            }}>
              Guests are always welcome. No invitation required.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Day', value: 'Every Thursday' },
              { label: 'Time', value: '7:00 PM' },
              { label: 'Venue', value: 'Bedarin Hotel, Bypass' },
            ].map((item) => (
              <div key={item.label}>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.2rem',
                }}>{item.label}</p>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 400, fontSize: '0.9375rem', color: 'var(--ink)', margin: 0,
                }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '5rem', alignItems: 'start',
        }}>
          {/* Form */}
          <div>
            <span className="eyebrow">Send a Message</span>
            <span className="gold-rule" />
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: '2rem' }}>
              We Are Listening
            </h2>
            <ContactForm />
          </div>

          {/* Info sidebar */}
          <div>
            <span className="eyebrow">Direct Contact</span>
            <span className="gold-rule" />
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: '2rem' }}>
              Reach Us Directly
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: 'Phone', icon: '✆', value: '0794 607020 / 0721 313219', href: 'tel:+254794607020' },
                { label: 'Email', icon: '✉', value: 'info@rcnbustani.co.ke', href: 'mailto:info@rcnbustani.co.ke' },
                { label: 'Instagram', icon: '◎', value: '@rotaryclubofnorthlandsbustani', href: 'https://www.instagram.com/rotaryclubofnorthlandsbustani/' },
                { label: 'Facebook', icon: '◎', value: 'RC Northlands Bustani', href: 'https://web.facebook.com/profile.php?id=61585717761431' },
                { label: 'TikTok', icon: '◎', value: '@rcnorthlandsbustani', href: 'https://www.tiktok.com/@rcnorthlandsbustani' },
                { label: 'Rotary International', icon: '⬡', value: 'District 9212 — Kenya', href: undefined },
                { label: 'Chartered by', icon: '★', value: 'Rotary Club of Juja', href: undefined },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--gold-bright)', fontSize: '1.125rem', marginTop: '0.1rem' }}>{item.icon}</span>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                      fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.25rem',
                    }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} style={{ fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif", fontWeight: 300, fontSize: '0.9375rem', color: 'var(--blue-mid)', textDecoration: 'none' }}>{item.value}</a>
                    ) : (
                      <p style={{ fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif", fontWeight: 300, fontSize: '0.9375rem', color: 'var(--ink)', margin: 0 }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '1.75rem', background: 'var(--bg-off-white)', borderLeft: '3px solid var(--gold-bright)' }}>
              <p style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontWeight: 700, fontStyle: 'italic', fontSize: '1.125rem',
                color: 'var(--blue-mid)', margin: '0 0 0.75rem',
              }}>
                &ldquo;The best way to find yourself is to lose yourself in the service of others.&rdquo;
              </p>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '0.8rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--gold-deep)', margin: 0,
              }}>
                Mahatma Gandhi
              </p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/membership" className="btn-gold">Apply for Membership</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
