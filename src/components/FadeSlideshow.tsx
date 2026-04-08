'use client';

import { useState, useEffect } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Fills its parent — parent must be position:relative + overflow:hidden.
 * Crossfades between images on a timer.
 */
export default function FadeSlideshow({
  images,
  interval = 4000,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  images: StaticImageData[];
  interval?: number;
  sizes?: string;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <AnimatePresence>
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={images[idx]}
            alt=""
            fill
            sizes={sizes}
            style={{ objectFit: 'cover' }}
            priority={idx === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
