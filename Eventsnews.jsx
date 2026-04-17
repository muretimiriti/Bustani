// src/pages/EventsNews.jsx
// Drop into your React project and add the route:
//   <Route path="/events" element={<EventsNews />} />
// No extra dependencies needed.

import { useState, useEffect } from 'react'

const API = '/api.php'

const gold = '#C8A84B'
const navy = '#0A2463'

export default function EventsNews() {
  const [data,    setData]    = useState({ events: [], news: [] })
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('events')

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

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
          {['events', 'news'].map(t => (
            <button key={t} style={{ ...s.tabBtn, ...(tab === t ? s.tabBtnActive : {}) }} onClick={() => setTab(t)}>
              {t === 'events' ? 'Upcoming Events' : 'Latest News'}
              {!loading && <span style={{ ...s.tabCount, ...(tab === t ? s.tabCountActive : {}) }}>{data[t]?.length || 0}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div style={s.content}>
        {loading && (
          <div style={s.loading}>
            {[1, 2, 3].map(i => <div key={i} style={s.skeleton} />)}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: 48 }}>{tab === 'events' ? '📅' : '📰'}</div>
            <p>No {tab} posted yet. Check back soon!</p>
          </div>
        )}

        {!loading && (
          <div style={s.grid}>
            {items.map(item => (
              tab === 'events'
                ? <EventCard  key={item.id} item={item} />
                : <NewsCard   key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ item }) {
  const dateObj = item.date ? new Date(item.date + 'T00:00:00') : null
  const day   = dateObj ? dateObj.toLocaleDateString('en-KE', { day: '2-digit' }) : ''
  const month = dateObj ? dateObj.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase() : ''

  return (
    <div style={s.card}>
      {item.image_url
        ? <img src={item.image_url} alt={item.title} style={s.cardImg} />
        : <div style={s.cardImgPlaceholder}><span style={{ fontSize: 36 }}>📅</span></div>
      }
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
        <ShareRow title={item.title} date={item.date} location={item.location} type="event" />
      </div>
    </div>
  )
}

// ─── News Card ────────────────────────────────────────────────────────────────
function NewsCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const long = item.body && item.body.length > 220

  return (
    <div style={s.card}>
      {item.image_url
        ? <img src={item.image_url} alt={item.title} style={s.cardImg} />
        : <div style={s.cardImgPlaceholder}><span style={{ fontSize: 36 }}>📰</span></div>
      }
      <div style={s.cardBody}>
        <div style={s.newsDate}>
          {new Date(item.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h3 style={s.cardTitle}>{item.title}</h3>
        <p style={s.cardText}>
          {long && !expanded ? item.body.slice(0, 220) + '…' : item.body}
        </p>
        {long && (
          <button style={s.readMore} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        <ShareRow title={item.title} type="news" />
      </div>
    </div>
  )
}

// ─── Share Row ────────────────────────────────────────────────────────────────
function ShareRow({ title, date, location, type }) {
  const url  = typeof window !== 'undefined' ? window.location.origin + '/events' : 'https://rcnbustani.co.ke/events'
  const text = [title, date, location].filter(Boolean).join(' — ')

  const networks = [
    {
      label: 'WhatsApp',
      color: '#25D366',
      icon:  'W',
      href:  `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
    },
    {
      label: 'Facebook',
      color: '#1877F2',
      icon:  'f',
      href:  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    },
    {
      label: 'X / Twitter',
      color: '#000',
      icon:  '𝕏',
      href:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'LinkedIn',
      color: '#0A66C2',
      icon:  'in',
      href:  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
    },
  ]

  return (
    <div style={s.shareRow}>
      <span style={s.shareLabel}>Share:</span>
      {networks.map(n => (
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
  page:   { fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#111', background: '#f6f7f9', minHeight: '100vh' },

  hero:      { background: `linear-gradient(135deg, ${navy} 0%, #1a3a7a 100%)`, padding: '60px 20px 50px', textAlign: 'center', color: '#fff' },
  heroInner: { maxWidth: 700, margin: '0 auto' },
  heroEyebrow: { fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 10 },
  heroTitle: { fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.15 },
  heroSub:   { fontSize: 15, opacity: 0.75, margin: 0 },

  tabBar:   { background: '#fff', borderBottom: '2px solid #eee', position: 'sticky', top: 0, zIndex: 10 },
  tabInner: { maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex' },
  tabBtn:   { padding: '16px 24px', border: 'none', background: 'none', fontSize: 15, fontWeight: 600, color: '#888', cursor: 'pointer', borderBottom: '3px solid transparent', marginBottom: -2, display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s' },
  tabBtnActive: { color: navy, borderBottomColor: gold },
  tabCount:      { background: '#eee', color: '#666', borderRadius: 99, padding: '1px 7px', fontSize: 11, fontWeight: 700 },
  tabCountActive: { background: gold, color: '#fff' },

  content: { maxWidth: 900, margin: '0 auto', padding: '36px 20px' },

  grid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 },

  card:    { background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.07)', display: 'flex', flexDirection: 'column', transition: 'transform .15s, box-shadow .15s' },
  cardImg: { width: '100%', height: 200, objectFit: 'cover', display: 'block' },
  cardImgPlaceholder: { height: 140, background: `linear-gradient(135deg, ${navy}22, ${gold}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: 700, color: navy, margin: 0, lineHeight: 1.3 },
  cardText:  { fontSize: 14, color: '#555', lineHeight: 1.65, margin: 0 },

  dateBadge:      { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: gold, color: '#fff', borderRadius: 6, padding: '4px 10px', alignSelf: 'flex-start' },
  dateBadgeDay:   { fontSize: 20, fontWeight: 800, lineHeight: 1 },
  dateBadgeMonth: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' },

  meta:     { fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 13 },
  newsDate: { fontSize: 12, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },

  readMore: { background: 'none', border: 'none', color: navy, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' },

  shareRow:   { display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 14 },
  shareLabel: { fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 },
  shareBtn:   { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 6, color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 800, flexShrink: 0 },

  loading: { display: 'flex', flexDirection: 'column', gap: 16 },
  skeleton: { height: 120, borderRadius: 12, background: 'linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' },

  empty: { textAlign: 'center', padding: '80px 20px', color: '#aaa', fontSize: 16 },
}