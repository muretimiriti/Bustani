import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';

const benefits = [
  { title: 'Fellowship', body: 'A network of principled professionals who become lifelong colleagues and friends.' },
  { title: 'Service Impact', body: 'Direct involvement in community projects that create measurable, lasting change.' },
  { title: 'Professional Development', body: 'Access to Rotary\'s global network, vocational service, and leadership opportunities.' },
  { title: 'Global Connection', body: 'Part of a 1.4 million-strong global community spanning 200+ countries.' },
  { title: 'Personal Growth', body: 'The discipline of regular service cultivates humility, purpose, and perspective.' },
  { title: 'District Events', body: 'Participation in District 9212 conferences, inter-club events, and international exchanges.' },
];

const steps = [
  {
    number: '01',
    title: 'Enquire',
    body: 'Reach out to us directly or visit a meeting as a guest. Get a feel for our fellowship and ask us anything.',
    action: { label: 'Contact Us', href: '/contact' },
  },
  {
    number: '02',
    title: 'Meet the Club',
    body: 'Attend a few meetings and meet our members. We want you to know us — and we want to know you.',
    action: { label: 'View Meeting Schedule', href: '/news-events' },
  },
  {
    number: '03',
    title: 'Apply',
    body: 'A current member sponsors your membership. Your application is reviewed and voted on by the board. Welcome to Rotary.',
    action: { label: 'Send us a Message', href: '/contact' },
  },
];

const faqs = [
  {
    q: 'What is the difference between Rotary and Rotaract?',
    a: 'Rotary clubs are composed of established adult professionals with no upper age limit, making a lifelong commitment to service. Rotaract clubs are for young adults (18+) and became an independent Rotary membership type in 2020. The two are distinct but complementary — Rotaract bridges into Rotary membership for many members.',
  },
  {
    q: 'How much time does membership require?',
    a: 'Our weekly meetings are one evening per week. Beyond that, members are encouraged — but not obligated — to participate in service projects and club events according to their availability. We respect that our members are busy professionals.',
  },
  {
    q: 'Are there membership dues?',
    a: 'Yes. Rotary membership involves an annual club fee that covers operational costs and a contribution to the Rotary Foundation. Our club\'s current dues structure is shared during the application process. We believe the investment is far exceeded by the value of membership.',
  },
  {
    q: 'Do I need to be invited to join?',
    a: 'Traditionally, Rotary members are sponsored by an existing member. However, we encourage anyone interested to attend a meeting as a guest — that is often where the conversation begins. Reach out and we will connect you.',
  },
  {
    q: 'Can I attend a meeting before deciding?',
    a: 'Absolutely. Guests are always welcome at our weekly meetings. There is no obligation, no pressure — just fellowship and an opportunity to see Rotary from the inside.',
  },
];

export default function MembershipPage() {
  return (
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="Membership"
        title="Become a Rotarian"
        subtitle="An invitation to something greater than yourself — a lifelong commitment to service, fellowship, and professional excellence."
      />

      {/* What membership means */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '5rem', alignItems: 'center',
          }}>
            <div>
              <span className="eyebrow">What Rotary Membership Means</span>
              <span className="gold-rule" />
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1.5rem' }}>
                More Than a Club.
                <br />A Way of Life.
              </h2>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
                color: 'var(--ink-mid)', marginBottom: '1.25rem',
              }}>
                Rotary membership is not a transactional relationship. It is a covenant — with your
                community, with your fellow members, and with the values of service and integrity
                that Rotary has carried for over 120 years.
              </p>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
                color: 'var(--ink-mid)',
              }}>
                We are shaped by two guiding philosophies: <strong style={{ fontWeight: 400 }}>Bustani</strong> —
                a garden cultivated with care and intention — and <strong style={{ fontWeight: 400 }}>Ubuntu</strong> —
                the African understanding that <em>I am because we are</em>. We welcome professionals
                who are ready to bring their skills and genuine care to a community that grows
                together, because none of us flourishes alone.
              </p>
            </div>

            {/* Quote callout */}
            <div style={{ borderLeft: '3px solid var(--gold-bright)', paddingLeft: '2rem' }}>
              <p style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontWeight: 700, fontStyle: 'italic',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                color: 'var(--blue-mid)', lineHeight: 1.4, margin: '0 0 1rem',
              }}>
                &ldquo;Service Above Self&rdquo;
              </p>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '0.8125rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--gold-deep)', margin: '0 0 1.5rem',
              }}>
                Rotary International Motto
              </p>
              <p style={{
                fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                color: 'var(--ink-mid)', margin: 0,
              }}>
                Rotary clubs are composed of <strong style={{ fontWeight: 400 }}>established adult professionals</strong> —
                distinct from Rotaract clubs (for young adults 18+). There is no upper age limit
                to Rotary membership. It is a lifelong calling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-pad" style={{ background: 'var(--bg-off-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">What You Gain</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '480px' }}>
            The Value of Membership
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {benefits.map((b) => (
              <div key={b.title} style={{
                background: '#ffffff', padding: '1.75rem',
                borderBottom: '2px solid var(--blue-ghost)',
              }}>
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.125rem', color: 'var(--blue-mid)', margin: '0 0 0.75rem',
                }}>{b.title}</h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="section-pad" style={{ background: 'var(--bg-sand-light)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">The Process</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3.5rem', maxWidth: '480px' }}>
            How to Join
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '680px' }}>
            {steps.map((step, i) => (
              <div key={step.number} style={{
                display: 'grid', gridTemplateColumns: '4rem 1fr',
                gap: '2rem', alignItems: 'start',
              }}>
                <div style={{
                  width: '4rem', height: '4rem', border: i === steps.length - 1
                    ? '2px solid var(--gold-bright)' : '1px solid var(--ink-rule)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontWeight: 700, fontSize: '1.125rem',
                    color: i === steps.length - 1 ? 'var(--gold-bright)' : 'var(--ink-muted)',
                  }}>{step.number}</span>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontWeight: 700, fontSize: '1.25rem', color: 'var(--blue-mid)', margin: '0.5rem 0 0.75rem',
                  }}>{step.title}</h3>
                  <p style={{
                    fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                    fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                    color: 'var(--ink-mid)', margin: '0 0 1rem',
                  }}>{step.body}</p>
                  <Link
                    href={step.action.href}
                    style={{
                      fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                      fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: 'var(--blue-mid)',
                      textDecoration: 'none', borderBottom: '1px solid var(--blue-tint)', paddingBottom: '1px',
                    }}
                  >
                    {step.action.label} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Frequently Asked</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '480px' }}>
            Common Questions
          </h2>
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: '1.75rem 0',
                  borderBottom: '1px solid var(--ink-rule)',
                }}
              >
                <h3 style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '1.0625rem', color: 'var(--blue-mid)', margin: '0 0 0.875rem',
                }}>{faq.q}</h3>
                <p style={{
                  fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
                  fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.8,
                  color: 'var(--ink-mid)', margin: 0,
                }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-pad" style={{ background: 'var(--blue-mid)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: '-6rem', top: '50%', transform: 'translateY(-50%)',
          width: '30rem', height: '30rem', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#ffffff', margin: '0 0 1.25rem',
          }}>
            Ready to Grow With Us?
          </h2>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.75)', margin: '0 0 2.5rem',
          }}>
            Send us a message, come to a meeting, or simply say hello.
            The garden has room for you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-gold">
              Apply for Membership
            </Link>
            <Link href="/contact" className="btn-outline-blue">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
