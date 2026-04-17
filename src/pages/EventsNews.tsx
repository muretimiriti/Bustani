// Events & News display page - fetches from API
import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL || '/api.php'

const gold = '#C8A84B'
const navy = '#0A2463'

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

export default function EventsNews() {
  const [data, setData] = useState({ events: [], news: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'events' | 'news'>('events')

  const [fetchTrigger, setFetchTrigger] = useState(0)

  const fetchData = useCallback(() => {
    setFetchTrigger((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status} ${r.statusText}`)
        return r.json()
      })
      .then((d) => {
        if (!cancelled) { setData(d); setLoading(false) }
      })
      .catch((err) => {
        if (!cancelled) { console.error('Fetch failed:', err.message); setError(err.message); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [fetchTrigger])

  useEffect(() => {
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  const items = data[tab] || []

  return (
    <div style={s.page}>
      {/* page header */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroEyebrow}>Rotary Club of Northlands Bustani</div>
          <h1 style={s.heroTitle}>Events &amp; News</h1>
          <p style={s.heroSub}>Stay up to date with what's happening in our community</p>
        </div>
      </div>

      {/* tab bar */}
      <div style={s.tabBar}>
        <div style={s.tabInner}>
          {(['events', 'news'] as const).map((t) => (
            <button
              key={t}
              style={{ ...s.tabBtn, ...(tab === t ? s.tabBtnActive : {}) }}
              onClick={() => setTab(t)}
            >
              {t === 'events' ? 'Upcoming Events' : 'Latest News'}
              {!loading && (
                <span style={{ ...s.tabCount, ...(tab === t ? s.tabCountActive : {}) }}>
                  {data[t]?.length || 0}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={fetchData}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '16px 12px',
              opacity: loading ? 0.5 : 1,
            }}
            title="Refresh data"
            disabled={loading}
          >
            🔄
          </button>
        </div>
      </div>

      {/* content */}
      <div style={s.content}>
        {error && (
          <div style={{ ...s.empty, color: '#dc2626', background: '#fee2e2', padding: '20px', borderRadius: '8px' }}>
            <p>⚠️ Error loading data:</p>
            <p style={{ fontSize: '14px', margin: '10px 0 0' }}>{error}</p>
            <button onClick={fetchData} style={{ marginTop: '10px', padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {loading && !error && (
          <div style={s.loading}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={s.skeleton} />
            ))}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: 48 }}>{tab === 'events' ? '📅' : '📰'}</div>
            <p>No {tab} posted yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div style={s.grid}>
            {items.map((item: EventItem | NewsItem) =>
              tab === 'events' ? (
                <EventCard key={item.id} item={item as EventItem} />
              ) : (
                <NewsCard key={item.id} item={item as NewsItem} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ item }: { item: EventItem }) {
  const dateObj = item.date ? new Date(item.date + 'T00:00:00') : null
  const day = dateObj ? dateObj.toLocaleDateString('en-KE', { day: '2-digit' }) : ''
  const month = dateObj ? dateObj.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase() : ''

  return (
    <div style={s.card}>
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} style={s.cardImg} />
      ) : (
        <div style={s.cardImgPlaceholder}>
          <span style={{ fontSize: 36 }}>📅</span>
        </div>
      )}
      <div style={s.cardBody}>
        {dateObj && (
          <div style={s.dateBadge}>
            <span style={s.dateBadgeDay}>{day}</span>
            <span style={s.dateBadgeMonth}>{month}</span>
          </div>
        )}
        <h3 style={s.cardTitle}>{item.title}</h3>
        {item.location && (
          <div style={s.meta}>
            <span style={s.metaIcon}>📍</span> {item.location}
          </div>
        )}
        {item.description && <p style={s.cardText}>{item.description}</p>}
        <ShareRow
          title={item.title}
          date={item.date}
          location={item.location}
        />
      </div>
    </div>
  )
}

// ─── News Card ────────────────────────────────────────────────────────────────
function NewsCard({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false)
  const long = item.body && item.body.length > 220

  return (
    <div style={s.card}>
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} style={s.cardImg} />
      ) : (
        <div style={s.cardImgPlaceholder}>
          <span style={{ fontSize: 36 }}>📰</span>
        </div>
      )}
      <div style={s.cardBody}>
        <div style={s.newsDate}>
          {new Date(item.created_at).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <h3 style={s.cardTitle}>{item.title}</h3>
        <p style={s.cardText}>
          {long && !expanded ? item.body.slice(0, 220) + '…' : item.body}
        </p>
        {long && (
          <button
            style={s.readMore}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        <ShareRow title={item.title} />
      </div>
    </div>
  )
}

// ─── Share Row ────────────────────────────────────────────────────────────────
function ShareRow({
  title,
  date,
  location,
}: {
  title: string
  date?: string
  location?: string
}) {
  const url =
    typeof window !== 'undefined'
      ? window.location.origin + '/events'
      : 'https://rcnbustani.co.ke/events'
  const text = [title, date, location].filter(Boolean).join(' — ')

  const networks = [
    {
      label: 'WhatsApp',
      color: '#25D366',
      icon: 'W',
      href: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
    },
    {
      label: 'Facebook',
      color: '#1877F2',
      icon: 'f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    },
    {
      label: 'X / Twitter',
      color: '#000',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'LinkedIn',
      color: '#0A66C2',
      icon: 'in',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
    },
  ]

  return (
    <div style={s.shareRow}>
      <span style={s.shareLabel}>Share:</span>
      {networks.map((n) => (
        <a
          key={n.label}
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${n.label}`}
          style={{ ...s.shareBtn, background: n.color }}
        >
          {n.icon}
        </a>
      ))}
    </div>
  )
}

// ─── styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#111',
    background: '#f6f7f9',
    minHeight: '100vh',
  } as React.CSSProperties,

  hero: {
    background: `linear-gradient(135deg, ${navy} 0%, #1a3a7a 100%)`,
    padding: '60px 20px 50px',
    textAlign: 'center' as const,
    color: '#fff',
  } as React.CSSProperties,
  heroInner: { maxWidth: 700, margin: '0 auto' } as React.CSSProperties,
  heroEyebrow: {
    fontSize: 12,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: gold,
    fontWeight: 700,
    marginBottom: 10,
  } as React.CSSProperties,
  heroTitle: {
    fontSize: 'clamp(28px, 5vw, 46px)',
    fontWeight: 800,
    margin: '0 0 12px',
    lineHeight: 1.15,
  } as React.CSSProperties,
  heroSub: { fontSize: 15, opacity: 0.75, margin: 0 } as React.CSSProperties,

  tabBar: {
    background: '#fff',
    borderBottom: '2px solid #eee',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  } as React.CSSProperties,
  tabInner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
  } as React.CSSProperties,
  tabBtn: {
    padding: '16px 24px',
    border: 'none',
    background: 'none',
    fontSize: 15,
    fontWeight: 600,
    color: '#888',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: -2,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all .15s',
  } as React.CSSProperties,
  tabBtnActive: { color: navy, borderBottom: `3px solid ${gold}` } as React.CSSProperties,
  tabCount: {
    background: '#eee',
    color: '#666',
    borderRadius: 99,
    padding: '1px 7px',
    fontSize: 11,
    fontWeight: 700,
  } as React.CSSProperties,
  tabCountActive: { background: gold, color: '#fff' } as React.CSSProperties,

  content: { maxWidth: 900, margin: '0 auto', padding: '36px 20px' } as React.CSSProperties,

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24,
  } as React.CSSProperties,

  card: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,.07)',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'transform .15s, box-shadow .15s',
  } as React.CSSProperties,
  cardImg: { width: '100%', height: 200, objectFit: 'cover' as const, display: 'block' } as React.CSSProperties,
  cardImgPlaceholder: {
    height: 140,
    background: `linear-gradient(135deg, ${navy}22, ${gold}22)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  cardBody: {
    padding: '20px 20px 16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  } as React.CSSProperties,
  cardTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: 17,
    color: navy,
    margin: 0,
    lineHeight: 1.3,
  } as React.CSSProperties,
  cardText: { fontSize: 14, color: '#555', lineHeight: 1.65, margin: 0 } as React.CSSProperties,

  dateBadge: {
    display: 'inline-flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    background: gold,
    color: '#fff',
    borderRadius: 6,
    padding: '4px 10px',
    alignSelf: 'flex-start',
  } as React.CSSProperties,
  dateBadgeDay: { fontSize: 20, fontWeight: 800, lineHeight: 1 } as React.CSSProperties,
  dateBadgeMonth: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' } as React.CSSProperties,

  meta: { fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 4 } as React.CSSProperties,
  metaIcon: { fontSize: 13 } as React.CSSProperties,
  newsDate: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
  } as React.CSSProperties,

  readMore: {
    background: 'none',
    border: 'none',
    color: navy,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  } as React.CSSProperties,

  shareRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 14 } as React.CSSProperties,
  shareLabel: {
    fontSize: 11,
    color: '#aaa',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    marginRight: 2,
  } as React.CSSProperties,
  shareBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 6,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  } as React.CSSProperties,

  loading: { display: 'flex', flexDirection: 'column' as const, gap: 16 } as React.CSSProperties,
  skeleton: {
    height: 120,
    borderRadius: 12,
    background: 'linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)',
    backgroundSize: '200% 100%',
  } as React.CSSProperties,

  empty: { textAlign: 'center' as const, padding: '80px 20px', color: '#aaa', fontSize: 16 } as React.CSSProperties,
}
