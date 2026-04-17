import { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';

const API = import.meta.env.VITE_API_URL || '/api.php'

interface EventItem {
  id: string
  title: string
  date: string
  location?: string
  description?: string
  image_url?: string
  created_at: string
}

interface NewsItem {
  id: string
  title: string
  body: string
  image_url?: string
  created_at: string
}

export default function NewsEventsPage() {
  const [data, setData] = useState({ events: [], news: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'events' | 'news'>('events')

  const fetchData = () => {
    setLoading(true)
    setError(null)
    
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`)
        return r.json()
      })
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch:', err)
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const items = data[tab] || []

  return (
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="Stay Connected"
        title="News & Events"
        subtitle="Meetings, milestones, and moments of fellowship from the Rotary Club of Northlands Bustani."
      />

      {/* error message */}
      {error && (
        <section style={{ background: '#fee2e2', padding: '2rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', color: '#991b1b' }}>
            <p>⚠️ Error loading data: {error}</p>
            <button
              onClick={fetchData}
              style={{
                padding: '0.5rem 1rem',
                background: '#991b1b',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </section>
      )}

      {/* loading state */}
      {loading && !error && (
        <section style={{ background: '#f6f7f9', padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#666' }}>Loading events and news...</p>
          </div>
        </section>
      )}

      {/* content */}
      {!loading && !error && (
        <>
          {/* info section */}
          <section style={{ background: 'var(--blue-ghost)', padding: '3rem 1.5rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.25em',
                textTransform: 'uppercase', color: 'var(--blue-tint)', margin: '0 0 0.5rem',
              }}>
                Updates
              </p>
              <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'var(--blue-mid)', margin: 0 }}>
                {items.length} {tab === 'events' ? 'Upcoming Events' : 'News Articles'}
              </h2>
            </div>
          </section>

          {/* tabs */}
          <section style={{ background: '#fff', borderBottom: '2px solid #eee', paddingTop: '2rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
                {(['events', 'news'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.5rem 0',
                      fontSize: '1rem',
                      fontWeight: tab === t ? 700 : 400,
                      color: tab === t ? '#0A2463' : '#999',
                      cursor: 'pointer',
                      borderBottom: tab === t ? '2px solid #C8A84B' : 'none',
                      marginBottom: '-1px',
                    }}
                  >
                    {t === 'events' ? '📅 Events' : '📰 News'} ({items.length})
                  </button>
                ))}
                <button
                  onClick={fetchData}
                  style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    opacity: loading ? 0.5 : 1,
                  }}
                  title="Refresh data"
                >
                  🔄
                </button>
              </div>
            </div>
          </section>

          {/* empty state */}
          {items.length === 0 && (
            <section style={{ padding: '4rem 1.5rem', background: '#f9fafb' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', color: '#999' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {tab === 'events' ? '📅' : '📰'}
                </div>
                <p>No {tab} posted yet. Check back soon!</p>
              </div>
            </section>
          )}

          {/* items grid */}
          {items.length > 0 && (
            <section style={{ padding: '3rem 1.5rem', background: '#f9fafb' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}>
                  {items.map((item: EventItem | NewsItem) => (
                    <div
                      key={item.id}
                      style={{
                        background: '#fff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,.1)',
                        display: 'flex',
                        flexDirection: 'column' as const,
                      }}
                    >
                      {/* image */}
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover' as const,
                            display: 'block',
                          }}
                        />
                      )}

                      {/* content */}
                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' as const }}>
                        {tab === 'events' && (
                          <>
                            {(item as EventItem).date && (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.75rem',
                              }}>
                                <span style={{ fontSize: '0.85rem', color: '#0A2463', fontWeight: 700 }}>
                                  📅 {new Date((item as EventItem).date + 'T00:00:00').toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}
                            {(item as EventItem).location && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem',
                                color: '#666',
                                marginBottom: '0.75rem',
                              }}>
                                📍 {(item as EventItem).location}
                              </div>
                            )}
                          </>
                        )}

                        {tab === 'news' && (
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#999',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.75rem',
                          }}>
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        )}

                        <h3 style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#0A2463',
                          margin: '0 0 0.75rem',
                          lineHeight: 1.3,
                        }}>
                          {item.title}
                        </h3>

                        <p style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          color: '#555',
                          margin: 0,
                          flex: 1,
                        }}>
                          {tab === 'events'
                            ? (item as EventItem).description || 'No description'
                            : (item as NewsItem).body || 'No content'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}
  {
    date: 'Every Thursday',
    month: 'Weekly',
    title: 'Regular Club Meeting',
    description: 'Our weekly fellowship and business meeting at Bedarin Hotel, Bypass from 7:00 PM. Guests welcome — come and see what Rotary looks like from the inside.',
    type: 'Meeting',
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
          <Link to="/contact" className="btn-gold" style={{ whiteSpace: 'nowrap' }}>
            RSVP to Visit
          </Link>
        </div>
      </section>

      {/* Charter Party — Featured Upcoming Event */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Upcoming Event</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '2.5rem', maxWidth: '600px' }}>
            Charter Celebration — 11 April 2026
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}>
            {/* Flyer */}
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
              <img
                src="/charter-party-2026.jpeg"
                alt="Charter Celebration flyer — 11 April 2026, Abai Lodges & Spa"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.4rem',
                }}>Event</p>
                <p style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.25rem', color: 'var(--blue-mid)', margin: 0, lineHeight: 1.35,
                }}>
                  Installation of Charter President Pat Ngumu and 1st Board of Directors 2025–2026
                </p>
              </div>

              {[
                { label: 'Date & Time', value: '11 April 2026 · 2:00 PM' },
                { label: 'Venue', value: 'Abai Lodges & Spa, Kagio (Off Sagana–Kutus Road)' },
                { label: 'Theme', value: 'Zulu' },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.25rem',
                  }}>{item.label}</p>
                  <p style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 400, fontSize: '0.9375rem', color: 'var(--ink)', margin: 0,
                  }}>{item.value}</p>
                </div>
              ))}

              {/* Charges */}
              <div>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.75rem',
                }}>Charges</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {[
                    { category: 'Rotarians', amount: 'KES 3,500' },
                    { category: 'Rotaractors', amount: 'KES 2,500' },
                    { category: 'Guests', amount: 'KES 3,500' },
                  ].map((row) => (
                    <div key={row.category} style={{
                      display: 'flex', justifyContent: 'space-between',
                      borderBottom: '1px solid var(--ink-rule)', paddingBottom: '0.4rem',
                    }}>
                      <span style={{
                        fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                        fontWeight: 300, fontSize: '0.9375rem', color: 'var(--ink-mid)',
                      }}>{row.category}</span>
                      <span style={{
                        fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                        fontWeight: 600, fontSize: '0.9375rem', color: 'var(--ink)',
                      }}>{row.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div style={{
                background: 'var(--blue-ghost)',
                borderLeft: '3px solid var(--gold-bright)',
                padding: '1rem 1.25rem',
              }}>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.25rem',
                }}>Till Number (M-Pesa)</p>
                <p style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.5rem', color: 'var(--blue-mid)', margin: 0,
                  letterSpacing: '0.05em',
                }}>6912636</p>
              </div>

              <Link to="/contact" className="btn-gold" style={{ alignSelf: 'flex-start' }}>
                RSVP Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
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
                  background: 'var(--bg-white)',
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
