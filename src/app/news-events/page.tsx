import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'News & Events — Rotary Club of Northlands Bustani',
  description: 'Stay up to date with meetings, events, and news from the Rotary Club of Northlands Bustani.',
};

const upcomingEvents = [
  {
    date: 'Every Thursday',
    month: 'Weekly',
    title: 'Regular Club Meeting',
    description: 'Our weekly fellowship and business meeting at Bedarin Hotel, Bypass from 7:00 PM. Guests welcome — come and see what Rotary looks like from the inside.',
    type: 'Meeting',
  },
  {
    date: '23 March',
    month: 'Annual',
    title: 'Charter Anniversary Celebration',
    description: 'Marking the anniversary of our official charter — 23 March 2026. A celebration of the members, the community, and the year of service ahead.',
    type: 'Celebration',
  },
  {
    date: 'Quarterly',
    month: 'TBC',
    title: 'Fellowship Night',
    description: 'An evening of informal fellowship, networking, and community connection — open to members, families, and prospective members.',
    type: 'Fellowship',
  },
  {
    date: 'Annual',
    month: 'November',
    title: 'District 9212 Conference',
    description: 'Joining hundreds of Rotarians from across District 9212 for the annual district conference — keynotes, project showcases, and awards.',
    type: 'District Event',
  },
];

const news = [
  {
    date: '23 March 2026',
    title: 'Rotary Club of Northlands Bustani Officially Chartered',
    excerpt:
      'After eight months of dedicated preparation, the Rotary Club of Northlands Bustani received its official charter from Rotary International, sponsored by the Rotary Club of Juja — District 9212. The club becomes the newest member of the District 9212 family.',
  },
  {
    date: '21 December 2025',
    title: 'YoungLife Africa Early Christmas Visit — 100+ Lives Touched',
    excerpt:
      'Seven Rotary and Rotaract clubs joined the Rotary Club of Northlands Bustani IF for a day of fellowship with YoungLife Africa — cooking, games, mentorship, and vertical garden building. The clubs raised KES 53,500 in cash and significant in-kind contributions.',
  },
  {
    date: '12–13 December 2025',
    title: 'Gachororo Community Medical Camp — 600+ Patients Served',
    excerpt:
      'In partnership with the Rotary Club of Juja and the Rotaract Club of Youth Connect Kenya, we conducted a two-day medical camp at Gachororo offering general consultation, cancer and eye screenings, ENT care, HIV testing, mental health support, and medication — serving over 600 community members.',
  },
  {
    date: 'November 2025',
    title: 'Club Assembly & Investment 101 Fellowship',
    excerpt:
      'The club held its first formal Club Assembly in November, followed by a well-attended "Investment 101" fellowship exploring financial literacy and vocational development among members.',
  },
  {
    date: 'October 2025',
    title: 'Men\'s Mental Health Fellowship with Athi Kapiti Rotary',
    excerpt:
      'A joint fellowship with the Rotary Club of Athi Kapiti focused on men\'s mental health — opening an honest conversation on wellbeing, stress, and peer support in the professional community.',
  },
  {
    date: 'September 2025',
    title: 'Rotary 101 Training & Club Formally Named Bustani',
    excerpt:
      'The growing satellite club completed its second Rotary 101 training session and officially adopted the name "Bustani" — Swahili for garden — setting a clear vision for its charter journey.',
  },
];

const typeColors: Record<string, string> = {
  Meeting: 'var(--blue-mid)',
  Celebration: 'var(--gold-deep)',
  Fellowship: 'var(--blue-tint)',
  'District Event': 'var(--ink-light)',
};

export default function NewsEventsPage() {
  return (
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="Stay Connected"
        title="News & Events"
        subtitle="Meetings, milestones, and moments of fellowship from the Rotary Club of Northlands Bustani."
      />

      {/* Meeting schedule callout */}
      <section style={{ background: 'var(--blue-ghost)', padding: '3rem 1.5rem' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '2rem',
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
              fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--blue-tint)', margin: '0 0 0.5rem',
            }}>
              Weekly Meeting
            </p>
            <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'var(--blue-mid)', margin: 0 }}>
              Every Thursday at 7:00 PM
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Venue', value: 'Bedarin Hotel, Bypass' },
              { label: 'Frequency', value: 'Weekly, year-round' },
              { label: 'Guests', value: 'Always welcome' },
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
          <Link href="/contact" className="btn-gold" style={{ whiteSpace: 'nowrap' }}>
            RSVP to Visit
          </Link>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Calendar</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '480px' }}>
            Upcoming Events
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '5rem 1fr',
                  gap: '2rem',
                  alignItems: 'start',
                  padding: '1.75rem',
                  background: 'var(--bg-off-white)',
                  borderLeft: `3px solid ${typeColors[event.type] || 'var(--blue-mid)'}`,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontWeight: 700, fontSize: '1.5rem', color: 'var(--blue-mid)', margin: 0,
                  }}>{event.date}</p>
                  <p style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0.2rem 0 0',
                  }}>{event.month}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                      fontWeight: 700, fontSize: '1.125rem', color: 'var(--blue-mid)', margin: 0,
                    }}>{event.title}</h3>
                    <span style={{
                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                      fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: typeColors[event.type] || 'var(--blue-mid)',
                      border: `1px solid ${typeColors[event.type] || 'var(--blue-mid)'}`,
                      padding: '0.15rem 0.5rem',
                    }}>{event.type}</span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                    color: 'var(--ink-mid)', margin: 0,
                  }}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Latest News</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '480px' }}>
            Club Updates
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {news.map((item) => (
              <article
                key={item.title}
                style={{ background: '#ffffff', padding: '2rem', borderTop: '3px solid var(--gold-bright)' }}
              >
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--gold-deep)', margin: '0 0 0.75rem',
                }}>{item.date}</p>
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.125rem', color: 'var(--blue-mid)',
                  margin: '0 0 0.875rem', lineHeight: 1.35,
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>{item.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
