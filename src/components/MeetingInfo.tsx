import Link from 'next/link';

export default function MeetingInfo() {
  return (
    <section
      style={{
        background: 'var(--bg-sand-light)',
        borderTop: '1px solid var(--ink-rule)',
        borderBottom: '1px solid var(--ink-rule)',
        padding: '4rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        {/* Label */}
        <div>
          <span style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'var(--ink-muted)',
            display: 'block', marginBottom: '0.5rem',
          }}>
            Weekly Meeting
          </span>
          <span style={{ display: 'block', width: '2rem', height: '2px', background: 'var(--gold-bright)', marginBottom: '1rem' }} />
          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            color: 'var(--blue-mid)', margin: 0,
          }}>
            We Meet Every Week
          </h2>
        </div>

        {/* Meeting details */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
          {[
            { icon: '📅', label: 'Day', value: 'Every Thursday' },
            { icon: '🕖', label: 'Time', value: '6:30 PM' },
            { icon: '📍', label: 'Venue', value: 'Northlands, Nairobi' },
          ].map((item) => (
            <div key={item.label}>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 0.25rem',
              }}>
                {item.label}
              </p>
              <p style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontWeight: 700, fontSize: '1.125rem', color: 'var(--ink)', margin: 0,
              }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/news-events"
          style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--blue-mid)',
            textDecoration: 'none', borderBottom: '1px solid var(--blue-tint)',
            paddingBottom: '2px', whiteSpace: 'nowrap',
          }}
        >
          Full schedule &rarr;
        </Link>
      </div>
    </section>
  );
}
