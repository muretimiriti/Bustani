import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Our Projects — Rotary Club of Northlands Bustani',
  description: 'The service projects and community initiatives of the Rotary Club of Northlands Bustani, District 9212, Kenya.',
};

const focusAreas = [
  {
    avenue: 'Community Service',
    title: 'Northlands Health Initiative',
    description:
      'Partnering with local clinics to provide accessible healthcare to underserved residents of the Northlands corridor — medical camps, health screenings, and maternal care support.',
    status: 'In Planning',
  },
  {
    avenue: 'Vocational Service',
    title: 'Professional Mentorship Programme',
    description:
      'Connecting our membership — drawn from diverse professional fields — with emerging talent in the community. Structured mentorship, internship placement, and career guidance.',
    status: 'In Planning',
  },
  {
    avenue: 'Community Service',
    title: 'Environmental Stewardship',
    description:
      'Inspired by our chartering club — the Rotary Club of Juja — we are committed to tree-planting, waste management, and environmental education in our local schools and institutions.',
    status: 'Launching Soon',
  },
  {
    avenue: 'International Service',
    title: 'District 9212 Partnership Projects',
    description:
      'Joining hands with fellow District 9212 clubs on international service grants — water, sanitation, and education projects that reflect Rotary\'s global humanitarian mandate.',
    status: 'In Planning',
  },
];

export default function ProjectsPage() {
  return (
    <main style={{ paddingTop: '72px' }}>
      <PageHero
        eyebrow="Service in Action"
        title="Our Projects"
        subtitle="Every great garden begins with intention. Here are the seeds we are planting across our community."
      />

      {/* Intro */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ maxWidth: '720px' }}>
            <span className="eyebrow">Northlands Bustani</span>
            <span className="gold-rule" />
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1.5rem' }}>
              Seeds We Are Planting
            </h2>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
              color: 'var(--ink-mid)', marginBottom: '1rem',
            }}>
              As a newly chartered club, our projects are taking shape — each one rooted in the
              Four Avenues of Rotary Service and the specific needs of the Northlands community.
              We are building with care, with purpose, and with the long view.
            </p>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
              color: 'var(--ink-mid)',
            }}>
              Have a project idea? We welcome members and community partners to bring forward
              proposals aligned with Rotary&rsquo;s humanitarian values.
            </p>
          </div>
        </div>
      </section>

      {/* Project cards */}
      <section className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Current Focus Areas</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '560px' }}>
            Where We Are Growing
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {focusAreas.map((project) => (
              <div
                key={project.title}
                style={{
                  background: '#ffffff',
                  padding: '2rem',
                  borderTop: '3px solid var(--blue-mid)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--blue-tint)',
                  }}>
                    {project.avenue}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--gold-deep)',
                    border: '1px solid var(--gold-deep)', padding: '0.2rem 0.6rem',
                  }}>
                    {project.status}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.1875rem', color: 'var(--blue-mid)',
                  margin: '0 0 0.875rem', lineHeight: 1.3,
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ background: 'var(--bg-sand-light)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', maxWidth: '640px' } as React.CSSProperties}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: '1rem' }}>
            Propose a Project
          </h2>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'var(--ink-mid)', marginBottom: '2rem',
          }}>
            We believe the best service ideas come from within the community.
            If you have a project that aligns with Rotary&rsquo;s values and the needs of Northlands,
            we want to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-gold">Get in Touch</Link>
            <Link href="/membership" className="btn-outline-white" style={{ color: 'var(--blue-mid)', borderColor: 'var(--blue-mid)' }}>
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
