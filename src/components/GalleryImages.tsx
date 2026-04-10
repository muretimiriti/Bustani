

interface GalleryImagesProps {
  images: { src: string; alt: string; caption: string }[];
}

export default function GalleryImages({ images }: GalleryImagesProps) {
  return (
    <>
      <style>{`
        .gallery-item { position:relative; aspect-ratio:4/3; overflow:hidden; cursor:pointer; }
        .gallery-item img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .gallery-item:hover img { transform: scale(1.06); }
        .gallery-caption { position:absolute; bottom:0; left:0; right:0;
          background:linear-gradient(to top,rgba(13,44,94,0.85) 0%,transparent 100%);
          padding:1.5rem; opacity:0.7; transition:opacity 0.3s ease; }
        .gallery-item:hover .gallery-caption { opacity:1; }
        .gallery-caption p { transform:translateY(4px); transition:transform 0.3s ease; }
        .gallery-item:hover .gallery-caption p { transform:translateY(0); }
      `}</style>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '4rem',
      }}>
        {images.map((img, i) => (
          <div key={i} className="gallery-item">
            <img
              src={img.src}
              alt={img.alt}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              loading={i < 6 ? 'eager' : 'lazy'}
            />
            <div className="gallery-caption">
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
    </>
  );
}
