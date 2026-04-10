import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';

const imgPresident      = '/images/DSC_5546.jpg';
const imgPresidentElect = '/images/DSC_5630 (1).jpg';
const imgPresidentNom   = '/images/DSC_5581.jpg';
const imgTreasurer      = '/images/DSC_5689.jpg';
const imgSecretary      = '/images/DSC_5693.jpg';
const imgSAA            = '/images/WhatsApp Image 2026-04-07 at 16.23.30 (1).jpeg';
const imgPR             = '/images/WhatsApp Image 2026-04-07 at 16.23.30.jpeg';
const imgNewGen         = '/images/DSC_5820.jpg';
const imgGovernance     = '/images/WhatsApp Image 2026-04-07 at 16.26.45.jpeg';
const imgFoundation     = '/images/DSC_5633.jpg';
const imgFundraising    = '/images/WhatsApp Image 2026-04-07 at 16.23.30 (2).jpeg';

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
  { role: 'Charter President', name: 'Rtn Patrick Ngumo', image: imgPresident, accent: 'var(--gold-bright)' },
  { role: 'President Elect', name: 'Rtn Nyokabi Kariuki', image: imgPresidentElect, accent: 'var(--blue-mid)' },
  { role: 'President Nominee & Projects Director', name: 'Rtn Ven Mbae', image: imgPresidentNom, accent: 'var(--blue-mid)' },
  { role: 'Club Admin & Treasurer', name: 'Rtn Fabian Okello', image: imgTreasurer, accent: 'var(--blue-mid)' },
  { role: 'Club Secretary', name: 'Rtn Joanne Kanini', image: imgSecretary, accent: 'var(--blue-mid)' },
  { role: 'SAA & Family of Rotary', name: 'Rtn Esther Waweru', image: imgSAA, accent: 'var(--blue-mid)' },
  { role: 'PR & Branding', name: 'Rtn Charles Muriuki', image: imgPR, accent: 'var(--blue-mid)' },
  { role: 'New Generations', name: 'Rtn Sandra Kwamboka', image: imgNewGen, accent: 'var(--blue-mid)' },
  { role: 'Governance', name: 'Rtn Maina Migwi', image: imgGovernance, accent: 'var(--blue-mid)' },
  { role: 'The Rotary Foundation', name: 'Rtn Purity Nkirote', image: imgFoundation, accent: 'var(--blue-mid)' },
  { role: 'Fundraising', name: 'Rtn Janet Wangui', image: imgFundraising, accent: 'var(--blue-mid)' },
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {board.map((member) => (
              <div
                key={member.role}
                style={{
                  background: 'var(--bg-off-white)',
                  borderTop: `3px solid ${member.accent}`,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Photo */}
                <div style={{ position: 'relative', height: '260px', flexShrink: 0 }}>
                  <Image
                    src={member.image}
                    alt={member.name !== 'To be confirmed' ? member.name : member.role}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    priority={board.indexOf(member) < 4}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <p style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.68rem', letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.4rem',
                  }}>
                    {member.role}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontWeight: 700, fontSize: '1.0625rem', color: 'var(--blue-mid)', margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {member.name}
                  </p>
                </div>
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
