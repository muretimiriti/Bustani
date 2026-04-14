
import { Link, useLocation } from 'react-router-dom';

const labels: Record<string, string> = {
  projects: 'Our Projects',
  gallery: 'Gallery',
  'news-events': 'News & Events',
  leadership: 'Leadership',
  membership: 'Membership',
  contact: 'Contact Us',
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        background: 'var(--bg-off-white)',
        borderBottom: '1px solid var(--ink-rule)',
        paddingTop: '142px',
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.625rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
        fontWeight: 300,
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
      }}>
        <Link to="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          Home
        </Link>
        {segments.map((seg, i) => {
          const href = '/' + segments.slice(0, i + 1).join('/');
          const isLast = i === segments.length - 1;
          const label = labels[seg] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return (
            <span key={href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--ink-rule)', fontSize: '0.65rem' }}>›</span>
              {isLast ? (
                <span style={{ color: 'var(--blue-mid)' }}>{label}</span>
              ) : (
                <Link to={href} style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>{label}</Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
