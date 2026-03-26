'use client';

import Image, { StaticImageData } from 'next/image';

interface GalleryImagesProps {
  images: { src: StaticImageData; alt: string; caption: string }[];
}

export default function GalleryImages({ images }: GalleryImagesProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '4rem',
    }}>
      {images.map((img) => (
        <div
          key={img.caption}
          style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', cursor: 'pointer' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget.querySelector('img');
            if (el) el.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget.querySelector('img');
            if (el) el.style.transform = 'scale(1)';
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(13,44,94,0.75) 0%, transparent 100%)',
            padding: '1.5rem',
          }}>
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 700, fontStyle: 'italic', fontSize: '1rem',
              color: '#ffffff', margin: 0,
            }}>
              {img.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
