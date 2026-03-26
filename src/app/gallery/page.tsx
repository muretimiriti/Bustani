import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import GalleryImages from '@/components/GalleryImages';
import flower1 from '@/app/images/pexels-kpaukshtite-2317921.jpg';
import flower2 from '@/app/images/pexels-mark-k-2159010989-35870239.jpg';

export const metadata: Metadata = {
  title: 'Gallery — Rotary Club of Northlands Bustani',
  description: 'Photos from meetings, fellowship events, and service projects of the Rotary Club of Northlands Bustani.',
};

export default function GalleryPage() {
  return (
    <main style={{ paddingTop: '72px' }}>
      <PageHero
        eyebrow="A Growing Archive"
        title="Gallery"
        subtitle="Glimpses of fellowship, service, and the moments that make our club what it is."
      />

      {/* Charter & Feature section */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Charter Milestones</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '560px' }}>
            The Garden in Bloom
          </h2>

          <GalleryImages
            images={[
              { src: flower1, alt: 'Northlands Bustani — vibrant blooms representing growth and service', caption: 'Northlands in Bloom' },
              { src: flower2, alt: 'Northlands Bustani — golden blooms symbolising fellowship and growth', caption: 'Bustani — A Garden of Service' },
            ]}
          />
        </div>
      </section>

      {/* Fellowships placeholder grid */}
      <section className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Fellowships</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1.5rem', maxWidth: '480px' }}>
            Our Story is Just Beginning
          </h2>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'var(--ink-mid)', maxWidth: '620px', marginBottom: '3rem',
          }}>
            As a club chartered in March 2026, our photo archive is young and growing.
            Every meeting, every project, every fellowship evening adds a new chapter.
            Check back regularly as our gallery fills with the faces and moments that define us.
          </p>

          {/* Placeholder grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  background: i % 3 === 0 ? 'var(--blue-ghost)' : i % 3 === 1 ? 'var(--bg-sand)' : 'var(--bg-sand-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="7" width="24" height="18" rx="2" stroke="var(--ink-rule)" strokeWidth="1.5" />
                  <circle cx="21" cy="13" r="2.5" stroke="var(--ink-rule)" strokeWidth="1.5" />
                  <path d="M4 21l6-5 5 4 4-3 9 7" stroke="var(--ink-rule)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'var(--ink-rule)',
                }}>
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-sand-light)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1rem' }}>
            Be Part of the Story
          </h2>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1rem', lineHeight: 1.8,
            color: 'var(--ink-mid)', marginBottom: '2rem',
          }}>
            Every member adds to the richness of our club. Join us, and help write the next chapter.
          </p>
          <Link href="/membership" className="btn-gold">Become a Member</Link>
        </div>
      </section>
    </main>
  );
}
