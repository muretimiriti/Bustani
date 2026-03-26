interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section
      style={{
        background: 'var(--blue-mid)',
        paddingTop: '10rem',
        paddingBottom: '5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative rings */}
      <div style={{
        position: 'absolute', right: '-6rem', bottom: '-4rem',
        width: '28rem', height: '28rem', borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: '-3rem', bottom: '-2rem',
        width: '18rem', height: '18rem', borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
          fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
          display: 'inline-block', marginBottom: '0.5rem',
        }}>
          {eyebrow}
        </span>
        <span style={{
          display: 'block', width: '2.5rem', height: '2px',
          background: 'var(--gold-bright)', marginBottom: '1.25rem',
        }} />
        <h1 style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.75rem)',
          color: '#ffffff', margin: 0, lineHeight: 1.1,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)', margin: '1rem 0 0', maxWidth: '560px',
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
