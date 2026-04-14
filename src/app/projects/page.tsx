import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import FadeSlideshow from '@/components/FadeSlideshow';

const youngLifeImages = [
  '/images/IMG_9438.jpg', '/images/IMG_0102.jpg', '/images/IMG_0105.jpg',
  '/images/IMG_0221.jpg', '/images/IMG_9451.jpg', '/images/IMG_9946.jpg', '/images/IMG_9566.jpg',
];
const ceoImages = [
  '/images/DSC_6030.jpg', '/images/DSC_5906.jpg', '/images/DSC_5908.jpg',
  '/images/DSC_5948.jpg', '/images/DSC_6026.jpg', '/images/DSC_6049.jpg',
];

const completedProjects: { avenue: string; title: string; description: string; status: string; highlight: string; images?: string[] }[] = [
  {
    avenue: 'Community Service',
    title: 'Gachororo Community Medical Camp',
    description:
      'A two-day medical camp (12–13 December 2025) at Gachororo offering general consultation, cancer screening, eye care, ENT services, HIV testing, mental health support, and medication distribution. Over 600 community members were served, in partnership with the Rotary Club of Juja (main sponsor) and the Rotaract Club of Youth Connect Kenya.',
    status: 'Completed',
    highlight: '600+ Served',
  },
  {
    avenue: 'Community Service',
    title: 'YoungLife Africa Early Christmas Visit',
    description:
      'On 21 December 2025, seven Rotary and Rotaract clubs joined forces for a day of fellowship with YoungLife Africa — featuring cooking, communal meals, games, mentorship sessions, and the construction of vertical gardens. The clubs collectively raised KES 53,500 in cash and significant in-kind support for over 100 attendees.',
    status: 'Completed',
    highlight: '100+ Attendees',
    images: youngLifeImages,
  },
  {
    avenue: 'Fellowship',
    title: 'Being CEO with Phil Karanja',
    description:
      'An intimate fellowship session with Phil Karanja exploring the mindset, responsibilities, and everyday realities of leading at the top. Members engaged in candid dialogue on executive decision-making, resilience, and servant leadership — drawing practical lessons from Phil\'s journey to and through the CEO seat.',
    status: 'Completed',
    highlight: 'Leadership Fellowship',
    images: ceoImages,
  },
];

const focusAreas = [
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
      'Tree-planting, waste management, and environmental education in local schools and institutions — building on our vertical gardens pilot from the YoungLife Africa visit.',
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
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="Service in Action"
        title="Our Projects"
        subtitle="Every great garden begins with intention. Here are the seeds we are planting across our community."
        backgroundImage="/images/IMG_9946.jpg"
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
              Before receiving our official charter, we had already served over 600 community
              members through a medical camp and partnered with seven clubs for the YoungLife
              Africa Christmas initiative. Service was never waiting for permission — it was how
              we earned our charter.
            </p>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
              color: 'var(--ink-mid)',
            }}>
              Now chartered, we are deepening our roots — anchoring our service across the seven Rotary Areas of Focus.
            </p>
          </div>
        </div>
      </section>

      {/* Completed projects */}
      <section className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Completed Projects</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '560px' }}>
            Service Already Delivered
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '5rem',
          }}>
            {completedProjects.map((project) => (
              <div
                key={project.title}
                style={{
                  background: '#ffffff',
                  borderTop: '3px solid var(--gold-bright)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {project.images && project.images.length > 0 && (
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', flexShrink: 0 }}>
                    <FadeSlideshow images={project.images} />
                  </div>
                )}
                <div style={{ padding: '2rem', flex: 1 }}>
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
                    textTransform: 'uppercase', color: '#2a7a4f',
                    border: '1px solid #2a7a4f', padding: '0.2rem 0.6rem',
                  }}>
                    {project.status}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.1875rem', color: 'var(--blue-mid)',
                  margin: '0 0 0.5rem', lineHeight: 1.3,
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em',
                  color: 'var(--gold-deep)', margin: '0 0 0.875rem', textTransform: 'uppercase',
                }}>
                  {project.highlight}
                </p>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>
                  {project.description}
                </p>
                </div>
              </div>
            ))}
          </div>

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
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem' }}>
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
            <Link to="/contact" className="btn-gold">Get in Touch</Link>
            <Link to="/membership" className="btn-outline-white" style={{ color: 'var(--blue-mid)', borderColor: 'var(--blue-mid)' }}>
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
