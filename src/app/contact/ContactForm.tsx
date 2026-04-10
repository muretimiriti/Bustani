'use client';

import { useState } from 'react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xlgoybpg';

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
  fontWeight: 300, fontSize: '0.9375rem', color: 'var(--ink)',
  background: 'var(--bg-off-white)', border: '1px solid var(--ink-rule)',
  padding: '0.875rem 1rem', width: '100%', outline: 'none',
  transition: 'border-color 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
  fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: 'var(--ink-muted)',
  display: 'block', marginBottom: '0.5rem',
};

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', newsletter: false });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          newsletter: form.newsletter ? 'Yes — add to mailing list' : 'No',
        }),
      });
      if (res.ok) { setSubmitted(true); } else { setError(true); }
    } catch { setError(true); }
  }

  if (submitted) return (
    <div style={{ background: 'var(--blue-ghost)', padding: '2rem', borderLeft: '3px solid var(--blue-mid)' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Message Received</h3>
      <p style={{ fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif", fontWeight: 300, fontSize: '0.9375rem', color: 'var(--ink-mid)', margin: 0 }}>
        Thank you for reaching out. A member of our team will respond shortly.
        {form.newsletter && ' We\'ll also add you to our mailing list.'}
      </p>
    </div>
  );

  if (error) return (
    <div style={{ background: '#fff5f5', padding: '2rem', borderLeft: '3px solid #c0392b' }}>
      <h3 style={{ fontSize: '1.125rem', color: '#c0392b', marginBottom: '0.5rem' }}>Message Not Sent</h3>
      <p style={{ fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif", fontWeight: 300, fontSize: '0.9375rem', color: 'var(--ink-mid)', margin: '0 0 1rem' }}>
        Something went wrong. Please email us directly at{' '}
        <a href="mailto:info@rcnbustani.co.ke" style={{ color: 'var(--blue-mid)' }}>info@rcnbustani.co.ke</a>.
      </p>
      <button onClick={() => setError(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue-mid)', padding: 0, fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif", fontSize: '0.875rem' }}>
        Try again &rarr;
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="name" style={labelStyle}>Full Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--blue-mid)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--ink-rule)'; }} />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--blue-mid)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--ink-rule)'; }} />
        </div>
      </div>
      <div>
        <label htmlFor="subject" style={labelStyle}>Subject</label>
        <select id="subject" name="subject" required value={form.subject} onChange={handleChange}
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--blue-mid)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--ink-rule)'; }}>
          <option value="">Select a subject…</option>
          <option value="membership">Membership Enquiry</option>
          <option value="project">Project / Partnership Proposal</option>
          <option value="visit">Visiting a Meeting</option>
          <option value="event">Event / Charter Celebration</option>
          <option value="media">Media / Press</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" style={labelStyle}>Message</label>
        <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--blue-mid)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--ink-rule)'; }} />
      </div>

      {/* Newsletter opt-in */}
      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer',
        padding: '1rem', background: 'var(--bg-off-white)', border: '1px solid var(--ink-rule)',
      }}>
        <input
          type="checkbox"
          name="newsletter"
          checked={form.newsletter}
          onChange={handleChange}
          style={{ marginTop: '0.15rem', accentColor: 'var(--blue-mid)', width: '1rem', height: '1rem', flexShrink: 0 }}
        />
        <span style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300, fontSize: '0.875rem', color: 'var(--ink-mid)', lineHeight: 1.6,
        }}>
          Keep me updated — add me to the Rotary Club of Northlands Bustani mailing list for news, events, and fellowship updates.
        </span>
      </label>

      <button type="submit" className="btn-gold" style={{ alignSelf: 'flex-start' }}>Send Message</button>
    </form>
  );
}
