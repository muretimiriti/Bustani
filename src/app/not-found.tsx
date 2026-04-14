import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ paddingTop: '142px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <span style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: '1rem',
        }}>
          404 — Page Not Found
        </span>
        <span style={{ display: 'block', width: '2.5rem', height: '2px', background: 'var(--gold-bright)', margin: '0 auto 2rem' }} />
        <h1 style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'var(--blue-mid)', margin: '0 0 1.25rem', lineHeight: 1.15,
        }}>
          This Page Hasn&rsquo;t Been Planted Yet
        </h1>
        <p style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
          color: 'var(--ink-mid)', maxWidth: '480px', margin: '0 auto 2.5rem',
        }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
          Return to the garden and find your way from there.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-gold">Back to Homepage</Link>
          <Link to="/contact" className="btn-outline-white" style={{ color: 'var(--blue-mid)', borderColor: 'var(--blue-mid)' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
