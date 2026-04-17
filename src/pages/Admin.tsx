// Admin Panel for managing news and events
import { useState, useEffect, useRef } from 'react'

const API = import.meta.env.VITE_API_URL || '/api.php'
const PASSWORD = 'rotary2025' // MUST match api.php

// ─── tiny API helpers ────────────────────────────────────────────────────────
const fetchAll = () => fetch(API).then(r => r.json())

const createItem = async (type: string, item: any, imageFile: File | null) => {
  if (imageFile) {
    const fd = new FormData()
    fd.append('password', PASSWORD)
    fd.append('type', type)
    fd.append('item', JSON.stringify(item))
    fd.append('image', imageFile)
    return fetch(API, { method: 'POST', body: fd }).then(r => r.json())
  }
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: PASSWORD, type, item }),
  }).then(r => r.json())
}

const deleteItem = (type: string, id: string) =>
  fetch(API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: PASSWORD, type, id }),
  }).then(r => r.json())

// ─── blank form shapes ───────────────────────────────────────────────────────
const blankEvent = { title: '', date: '', location: '', description: '' }
const blankNews = { title: '', body: '' }

type TabType = 'events' | 'news'
type FormData = typeof blankEvent | typeof blankNews
type ToastState = { msg: string; ok: boolean } | null

// ─── component ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')
  const [tab, setTab] = useState<TabType>('events')
  const [form, setForm] = useState<FormData>(blankEvent)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [allData, setAllData] = useState({ events: [], news: [] })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // refresh list after login and tab switch
  useEffect(() => {
    if (authed) {
      fetchAll().then(setAllData).catch(err => {
        showToast('Failed to load data from API', false)
        console.error('API Error:', err)
      })
    }
  }, [authed, tab])

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const login = () => {
    if (pwInput === PASSWORD) {
      setAuthed(true)
      setPwError('')
    } else {
      setPwError('Wrong password. Try again.')
    }
  }

  const switchTab = (t: TabType) => {
    setTab(t)
    setForm(t === 'events' ? blankEvent : blankNews)
    clearImage()
  }

  const clearImage = () => {
    setImageFile(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const save = async () => {
    if (!form.title?.toString().trim()) {
      showToast('Title is required', false)
      return
    }
    if (tab === 'events' && !(form as typeof blankEvent).date) {
      showToast('Date is required', false)
      return
    }
    if (tab === 'news' && !(form as typeof blankNews).body?.toString().trim()) {
      showToast('Body is required', false)
      return
    }

    setSaving(true)
    const res = await createItem(tab, form, imageFile)
    setSaving(false)

    if (res.success) {
      showToast(`${tab === 'events' ? 'Event' : 'Article'} saved!`)
      setForm(tab === 'events' ? blankEvent : blankNews)
      clearImage()
      fetchAll().then(setAllData)
    } else {
      showToast(res.error || 'Save failed', false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    const res = await deleteItem(tab, id)
    if (res.success) {
      showToast('Deleted')
      fetchAll().then(setAllData)
    } else {
      showToast('Delete failed', false)
    }
  }

  const f = (key: string) => ({
    value: form[key as keyof FormData]?.toString() || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  })

  // ── login screen ────────────────────────────────────────────────────────────
  if (!authed)
    return (
      <div style={s.loginWrap}>
        <div style={s.loginCard}>
          <div style={s.loginLogo}>
            <img
              src="/rotary-logo.png"
              alt="Rotary"
              style={{ height: 56 }}
              onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
            />
          </div>
          <h2 style={s.loginTitle}>Admin Portal</h2>
          <p style={s.loginSub}>RCN Bustani · Events &amp; News</p>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={{ ...s.input, ...(pwError ? s.inputError : {}) }}
              type="password"
              placeholder="Enter admin password"
              value={pwInput}
              onChange={(e) => {
                setPwInput(e.target.value)
                setPwError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              autoFocus
            />
            {pwError && <p style={s.errorMsg}>{pwError}</p>}
          </div>

          <button style={s.btnPrimary} onClick={login}>
            Sign in
          </button>
        </div>
      </div>
    )

  // ── admin dashboard ─────────────────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      {/* toast */}
      {toast && (
        <div style={{ ...s.toast, background: toast.ok ? '#1a6b3a' : '#b91c1c' }}>
          {toast.msg}
        </div>
      )}

      {/* header */}
      <div style={s.header}>
        <div>
          <div style={s.headerTitle}>Admin Portal</div>
          <div style={s.headerSub}>Rotary Club of Northlands Bustani</div>
        </div>
        <a href="/" style={s.backLink}>
          ← Back to site
        </a>
      </div>

      <div style={s.body}>
        {/* tabs */}
        <div style={s.tabs}>
          {(['events', 'news'] as const).map((t) => (
            <button
              key={t}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
              onClick={() => switchTab(t)}
            >
              {t === 'events' ? '📅 Events' : '📰 News'}
              <span style={s.badge}>{allData[t].length}</span>
            </button>
          ))}
        </div>

        <div style={s.columns}>
          {/* ── left: form ── */}
          <div style={s.formCard}>
            <h3 style={s.cardTitle}>
              {tab === 'events' ? 'Add New Event' : 'Add New Article'}
            </h3>

            <div style={s.field}>
              <label style={s.label}>Title *</label>
              <input
                style={s.input}
                placeholder={
                  tab === 'events'
                    ? 'e.g. Community Tree Planting Drive'
                    : 'e.g. Bustani Wins Club of the Year'
                }
                {...f('title')}
              />
            </div>

            {tab === 'events' && (
              <>
                <div style={s.row}>
                  <div style={{ ...s.field, flex: 1 }}>
                    <label style={s.label}>Date *</label>
                    <input style={s.input} type="date" {...f('date')} />
                  </div>
                  <div style={{ ...s.field, flex: 2 }}>
                    <label style={s.label}>Location</label>
                    <input
                      style={s.input}
                      placeholder="e.g. Karura Forest, Nairobi"
                      {...f('location')}
                    />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Description</label>
                  <textarea
                    style={{ ...s.input, ...s.textarea }}
                    placeholder="Describe the event…"
                    {...f('description')}
                  />
                </div>
              </>
            )}

            {tab === 'news' && (
              <div style={s.field}>
                <label style={s.label}>Article Body *</label>
                <textarea
                  style={{ ...s.input, ...s.textarea, minHeight: 180 }}
                  placeholder="Write the full article here…"
                  {...f('body')}
                />
              </div>
            )}

            {/* image upload */}
            <div style={s.field}>
              <label style={s.label}>Image (optional · max 5 MB)</label>
              <div style={s.uploadBox} onClick={() => fileRef.current?.click()}>
                {preview ? (
                  <img src={preview} alt="preview" style={s.previewImg} />
                ) : (
                  <div style={s.uploadPlaceholder}>
                    <span style={{ fontSize: 28 }}>🖼️</span>
                    <span style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                      Click to choose an image
                    </span>
                    <span style={{ fontSize: 11, color: '#999' }}>
                      JPG, PNG, WEBP — up to 5 MB
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={pickImage}
              />
              {preview && (
                <button style={s.btnGhost} onClick={clearImage}>
                  ✕ Remove image
                </button>
              )}
            </div>

            <button
              style={{ ...s.btnPrimary, opacity: saving ? 0.6 : 1 }}
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Saving…' : `Publish ${tab === 'events' ? 'Event' : 'Article'}`}
            </button>
          </div>

          {/* ── right: existing items ── */}
          <div style={s.listCard}>
            <h3 style={s.cardTitle}>
              Published {tab === 'events' ? 'Events' : 'Articles'}
              <span style={{ fontWeight: 400, color: '#888', fontSize: 14 }}>
                {' '}
                ({allData[tab].length})
              </span>
            </h3>

            {allData[tab].length === 0 ? (
              <div style={s.empty}>No {tab} yet. Create one on the left!</div>
            ) : (
              allData[tab].map((item: any) => (
                <div key={item.id} style={s.listItem}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} style={s.listThumb} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.listTitle}>{item.title}</div>
                    <div style={s.listMeta}>
                      {tab === 'events'
                        ? [item.date, item.location].filter(Boolean).join(' · ')
                        : new Date(item.created_at).toLocaleDateString('en-KE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                    </div>
                  </div>
                  <button
                    style={s.btnDelete}
                    onClick={() => remove(item.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── styles ──────────────────────────────────────────────────────────────────
const gold = '#C8A84B'
const navy = '#0A2463'
const s = {
  wrap: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    minHeight: '100vh',
    background: '#f4f5f7',
    color: '#111',
  } as React.CSSProperties,
  header: {
    background: navy,
    color: '#fff',
    padding: '18px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  headerTitle: { fontWeight: 700, fontSize: 20, letterSpacing: '0.02em' } as React.CSSProperties,
  headerSub: { fontSize: 12, opacity: 0.65, marginTop: 2 } as React.CSSProperties,
  backLink: { color: gold, textDecoration: 'none', fontSize: 13, fontWeight: 600 } as React.CSSProperties,
  body: { maxWidth: 1100, margin: '0 auto', padding: '28px 20px' } as React.CSSProperties,

  tabs: { display: 'flex', gap: 8, marginBottom: 24 } as React.CSSProperties,
  tab: {
    padding: '10px 22px',
    borderRadius: 8,
    border: `2px solid #ddd`,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all .15s',
  } as React.CSSProperties,
  tabActive: { borderColor: navy, background: navy, color: '#fff' } as React.CSSProperties,
  badge: {
    background: gold,
    color: '#fff',
    borderRadius: 99,
    padding: '1px 7px',
    fontSize: 11,
    fontWeight: 700,
  } as React.CSSProperties,

  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  } as React.CSSProperties,
  formCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 28,
    boxShadow: '0 1px 4px rgba(0,0,0,.07)',
  } as React.CSSProperties,
  listCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 28,
    boxShadow: '0 1px 4px rgba(0,0,0,.07)',
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: navy,
    marginBottom: 20,
    marginTop: 0,
  } as React.CSSProperties,

  field: { marginBottom: 16 } as React.CSSProperties,
  row: { display: 'flex', gap: 12 } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    background: '#fafafa',
    transition: 'border .15s',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  inputError: { borderColor: '#e74c3c' } as React.CSSProperties,
  textarea: { minHeight: 110, resize: 'vertical' } as React.CSSProperties,
  errorMsg: { color: '#e74c3c', fontSize: 12, marginTop: 4 } as React.CSSProperties,

  uploadBox: {
    border: '2px dashed #ddd',
    borderRadius: 10,
    cursor: 'pointer',
    overflow: 'hidden',
    minHeight: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fafafa',
    transition: 'border .15s',
  } as React.CSSProperties,
  uploadPlaceholder: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 2,
    padding: 20,
  } as React.CSSProperties,
  previewImg: {
    width: '100%',
    maxHeight: 220,
    objectFit: 'cover' as const,
    display: 'block',
  } as React.CSSProperties,

  btnPrimary: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 8,
    background: navy,
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
    letterSpacing: '0.03em',
    transition: 'opacity .15s',
  } as React.CSSProperties,
  btnGhost: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: 12,
    cursor: 'pointer',
    padding: '4px 0',
    marginTop: 4,
  } as React.CSSProperties,
  btnDelete: {
    background: '#fff0f0',
    border: '1px solid #fecaca',
    borderRadius: 6,
    color: '#dc2626',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 8px',
    flexShrink: 0,
  } as React.CSSProperties,

  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  } as React.CSSProperties,
  listThumb: {
    width: 54,
    height: 54,
    objectFit: 'cover' as const,
    borderRadius: 6,
    flexShrink: 0,
  } as React.CSSProperties,
  listTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: '#111',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  listMeta: { fontSize: 12, color: '#888', marginTop: 2 } as React.CSSProperties,
  empty: { color: '#aaa', fontSize: 14, textAlign: 'center' as const, padding: '40px 0' } as React.CSSProperties,

  toast: {
    position: 'fixed' as const,
    top: 20,
    right: 20,
    zIndex: 9999,
    padding: '12px 22px',
    borderRadius: 8,
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 4px 16px rgba(0,0,0,.2)',
  } as React.CSSProperties,

  // login
  loginWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${navy} 0%, #1a3a7a 100%)`,
  } as React.CSSProperties,
  loginCard: {
    background: '#fff',
    borderRadius: 16,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 380,
    boxShadow: '0 20px 60px rgba(0,0,0,.25)',
  } as React.CSSProperties,
  loginLogo: { textAlign: 'center' as const, marginBottom: 16 } as React.CSSProperties,
  loginTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: navy,
    textAlign: 'center' as const,
    margin: '0 0 4px',
  } as React.CSSProperties,
  loginSub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center' as const,
    marginBottom: 28,
  } as React.CSSProperties,
}
