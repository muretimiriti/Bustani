import type { Variants } from 'framer-motion';

// ─── Entrance animations ───────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Stagger containers ────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
};

// ─── Hero stagger (longer delay between items) ────────────────────────────

export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Card hover ────────────────────────────────────────────────────────────

export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 0px 0px rgba(23,69,143,0)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  hover: {
    y: -6,
    boxShadow: '0 16px 40px rgba(23,69,143,0.12)',
    transition: { type: 'spring' as const, stiffness: 380, damping: 22 },
  },
};

export const cardHoverGold = {
  rest: {
    y: 0,
    boxShadow: '0 0px 0px rgba(200,146,26,0)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  hover: {
    y: -5,
    boxShadow: '0 12px 32px rgba(200,146,26,0.15)',
    transition: { type: 'spring' as const, stiffness: 380, damping: 22 },
  },
};

// ─── Button hover ──────────────────────────────────────────────────────────

export const buttonTap = {
  tap: { scale: 0.97 },
};

// ─── Image zoom hover ──────────────────────────────────────────────────────

export const imageZoom = {
  rest: { scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  hover: { scale: 1.06, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Shared whileInView config ─────────────────────────────────────────────

export const viewportConfig = { once: true, margin: '-80px' };
