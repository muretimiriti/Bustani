import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import GalleryImages from '@/components/GalleryImages';

import img01 from '@/app/images/DSC_5546.jpg';
import img02 from '@/app/images/DSC_5563.jpg';
import img03 from '@/app/images/DSC_5577.jpg';
import img04 from '@/app/images/DSC_5581.jpg';
import img05 from '@/app/images/DSC_5615.jpg';
import img06 from '@/app/images/DSC_5630 (1).jpg';
import img07 from '@/app/images/DSC_5630.jpg';
import img08 from '@/app/images/DSC_5633.jpg';
import img09 from '@/app/images/DSC_5689.jpg';
import img10 from '@/app/images/DSC_5693.jpg';
import img11 from '@/app/images/DSC_5729.jpg';
import img12 from '@/app/images/DSC_5735.jpg';
import img13 from '@/app/images/DSC_5737.jpg';
import img14 from '@/app/images/DSC_5770.jpg';
import img15 from '@/app/images/DSC_5820.jpg';
import img16 from '@/app/images/DSC_5906.jpg';
import img17 from '@/app/images/DSC_5908.jpg';
import img18 from '@/app/images/DSC_5948.jpg';
import img19 from '@/app/images/DSC_6026.jpg';
import img20 from '@/app/images/DSC_6030.jpg';
import img21 from '@/app/images/DSC_6049.jpg';
import img22 from '@/app/images/DSC_6068.jpg';
import img23 from '@/app/images/DSC_6220.jpg';
import img24 from '@/app/images/IMG_0102.jpg';
import img25 from '@/app/images/IMG_0105.jpg';
import img26 from '@/app/images/IMG_0221.jpg';
import img27 from '@/app/images/IMG_9434.jpg';
import img28 from '@/app/images/IMG_9438.jpg';
import img29 from '@/app/images/IMG_9451.jpg';
import img30 from '@/app/images/IMG_9460.jpg';
import img31 from '@/app/images/IMG_9513.jpg';
import img32 from '@/app/images/IMG_9566.jpg';
import img33 from '@/app/images/IMG_9721.jpg';
import img34 from '@/app/images/IMG_9946.jpg';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from weekly meetings, fellowship events, and service projects of the Rotary Club of Northlands Bustani, District 9212. A growing visual archive of community, service, and Ubuntu in action.',
  openGraph: {
    title: 'Gallery | Rotary Club of Northlands Bustani',
    description: 'A growing visual archive of fellowship, community service, and Ubuntu in action — District 9212, Kenya.',
    type: 'website',
  },
};

const galleryImages = [
  { src: img01, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img02, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img03, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img04, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img05, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img06, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img07, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img08, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img09, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img10, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img11, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img12, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img13, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img14, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img15, alt: 'Northlands Bustani club members', caption: 'Northlands Bustani' },
  { src: img16, alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: img17, alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: img18, alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: img19, alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: img20, alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: img21, alt: 'Service project — YoungLife Africa', caption: 'YoungLife Africa Visit' },
  { src: img22, alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: img23, alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: img24, alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: img25, alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: img26, alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: img27, alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: img28, alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: img29, alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
  { src: img30, alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: img31, alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: img32, alt: 'YoungLife Africa — Early Christmas Visit', caption: 'YoungLife Africa Visit' },
  { src: img33, alt: 'Northlands Bustani fellowship', caption: 'Fellowship' },
  { src: img34, alt: 'Being CEO with Phil Karanja', caption: 'Being CEO — Phil Karanja' },
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
