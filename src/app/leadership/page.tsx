import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Leadership',
  description: 'The board, officers, and committee structure of the Rotary Club of Northlands Bustani, District 9212, Kenya. Officers confirmed following the inaugural elections after our 23 March 2026 charter.',
  openGraph: {
    title: 'Leadership | Rotary Club of Northlands Bustani',
    description: 'Board, officers, and committees of RC Northlands Bustani — District 9212, Kenya. Chartered 23 March 2026.',
    type: 'website',
  },
};

const board = [
  { role: 'President', name: 'To be confirmed', note: '' },
  { role: 'President Elect', name: 'To be confirmed', note: '' },
  { role: 'Secretary', name: 'To be confirmed', note: '' },
  { role: 'Treasurer', name: 'To be confirmed', note: '' },
  { role: 'Sergeant at Arms', name: 'To be confirmed', note: '' },
  { role: 'Director — Service Projects', name: 'To be confirmed', note: '' },
  { role: 'Director — Membership', name: 'To be confirmed', note: '' },
  { role: 'Director — Public Image', name: 'To be confirmed', note: '' },
];

const committees = [
  {
    name: 'Service Projects Committee',
    description: 'Plans and executes community service initiatives including health camps, environmental programmes, and vocational service.',
  },
  {
    name: 'Membership Committee',
    description: 'Grows and retains a diverse, engaged membership — from prospecting through induction and ongoing member satisfaction.',
  },
  {
    name: 'Fellowship Committee',
    description: 'Organises fellowship events, inter-club activities, and the social fabric that keeps our members connected.',
  },
  {
    name: 'Foundation & Fundraising Committee',
    description: 'Supports the Rotary Foundation, manages club fundraising, and stewards relationships with donors and partners.',
  },
];

export default function LeadershipPage() {
  return (
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="Club Leadership"
        title="Our Board & Officers"
        subtitle="The Rotary Club of Northlands Bustani is led by members elected to serve their fellow Rotarians and the broader community."
      />

      {/* Board */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">2025–2026 Board</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '560px' }}>
            Elected Officers
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {board.map((member) => (
              <div
                key={member.role}
                style={{
                  background: 'var(--bg-off-white)',
                  padding: '1.75rem 2rem',
                  borderLeft: '3px solid var(--blue-mid)',
                }}
              >
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.5rem',
                }}>{member.role}</p>
                <p style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.125rem', color: 'var(--blue-mid)', margin: 0,
                }}>{member.name}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem', padding: '1.5rem 2rem',
            background: 'var(--blue-ghost)', borderLeft: '3px solid var(--blue-tint)',
            maxWidth: '640px',
          }}>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
              color: 'var(--ink-mid)', margin: 0,
            }}>
              Officer details will be published following the club&rsquo;s inaugural board elections.
              For enquiries, please <a href="/contact" style={{ color: 'var(--blue-mid)' }}>contact us</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Committees */}
      <section className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">How We Organise</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '560px' }}>
            Club Committees
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {committees.map((c) => (
              <div
                key={c.name}
                style={{
                  background: '#ffffff',
                  padding: '2rem',
                  borderTop: '3px solid var(--gold-bright)',
                }}
              >
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.0625rem', color: 'var(--blue-mid)',
                  margin: '0 0 0.875rem', lineHeight: 1.3,
                }}>{c.name}</h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rotary year note */}
      <section style={{ background: 'var(--bg-sand-light)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ borderLeft: '3px solid var(--gold-bright)', paddingLeft: '2rem' }}>
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 700, fontStyle: 'italic', fontSize: '1.125rem',
              color: 'var(--blue-mid)', margin: '0 0 0.75rem',
            }}>
              &ldquo;Leadership in Rotary is not a title — it is a commitment to serve those who serve others.&rdquo;
            </p>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.8rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--gold-deep)', margin: 0,
            }}>
              Rotary International
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
