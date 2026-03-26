'use client';

import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp, viewportConfig } from '@/lib/variants';

interface GalleryImagesProps {
  images: { src: StaticImageData; alt: string; caption: string }[];
}

export default function GalleryImages({ images }: GalleryImagesProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '4rem',
      }}
    >
      {images.map((img) => (
        <motion.div
          key={img.caption}
          variants={fadeUp}
          whileHover="hover"
          initial="rest"
          animate="rest"
          style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', cursor: 'pointer' }}
        >
          <motion.div
            variants={{
              rest: { scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              hover: { scale: 1.06, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} />
          </motion.div>

          {/* Caption overlay fades in on hover */}
          <motion.div
            variants={{
              rest: { opacity: 0.7 },
              hover: { opacity: 1 },
            }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(13,44,94,0.85) 0%, transparent 100%)',
              padding: '1.5rem',
            }}
          >
            <motion.p
              variants={{
                rest: { y: 4, opacity: 0.8 },
                hover: { y: 0, opacity: 1, transition: { duration: 0.3 } },
              }}
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontWeight: 700, fontStyle: 'italic', fontSize: '1rem',
                color: '#ffffff', margin: 0,
              }}
            >
              {img.caption}
            </motion.p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
