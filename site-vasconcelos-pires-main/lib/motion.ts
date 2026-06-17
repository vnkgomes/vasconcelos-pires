import type { Variants } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const hairlineDraw: Variants = {
  hidden: { scaleX: 0, transformOrigin: '0% 50%' },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};
