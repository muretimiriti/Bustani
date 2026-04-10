import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import GalleryImages from '@/components/GalleryImages';

const galleryImages = [
  { src: '/images/DSC_5546.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5563.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5577.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5581.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5615.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5630 (1).jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5630.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5633.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5689.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5693.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5729.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5735.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5737.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5770.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5820.jpg', alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: '/images/DSC_5906.jpg', alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: '/images/DSC_5908.jpg', alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: '/images/DSC_5948.jpg', alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: '/images/DSC_6026.jpg', alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: '/images/DSC_6030.jpg', alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: '/images/DSC_6049.jpg', alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: '/images/DSC_6068.jpg', alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: '/images/DSC_6220.jpg', alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: '/images/IMG_0102.jpg', alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: '/images/IMG_0105.jpg', alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: '/images/IMG_0221.jpg', alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: '/images/IMG_9434.jpg', alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: '/images/IMG_9438.jpg', alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: '/images/IMG_9451.jpg', alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: '/images/IMG_9460.jpg', alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: '/images/IMG_9513.jpg', alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: '/images/IMG_9566.jpg', alt: 'YoungLife Africa — Early Christmas Visit', caption: 'YoungLife Africa Visit' },
  { src: '/images/IMG_9721.jpg', alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: '/images/IMG_9946.jpg', alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
];

export default function GalleryPage() {
  return (
    <main style={{ paddingTop: '142px' }}>
      <PageHero
        eyebrow="A Growing Archive"
        title="Gallery"
        subtitle="Glimpses of fellowship, service, and the moments that make our club what it is."
      />

      <section className="section-pad" style={{ background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow">Club Moments</span>
          <span className="gold-rule" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '3rem', maxWidth: '560px' }}>
            The Garden in Bloom
          </h2>

          <GalleryImages images={galleryImages} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-sand-light)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1rem' }}>
            Be Part of the Story
          </h2>
          <p style={{
            fontFamily: "var(--font-jost), 'Jost', system-ui, sans-serif",
            fontWeight: 300, fontSize: '1rem', lineHeight: 1.8,
            color: 'var(--ink-mid)', marginBottom: '2rem',
          }}>
            Every member adds to the richness of our club. Join us, and help write the next chapter.
          </p>
          <Link href="/membership" className="btn-gold">Become a Member</Link>
        </div>
      </section>
    </main>
  );
}
