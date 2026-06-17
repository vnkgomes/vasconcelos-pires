'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeRise } from '@/lib/motion';

type Mode = 'inView' | 'mount';

export function FadeRise({
  children,
  className,
  delay = 0,
  mode = 'inView',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  mode?: Mode;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const trigger =
    mode === 'mount'
      ? { animate: 'visible' as const }
      : { whileInView: 'visible' as const, viewport: { once: true, margin: '-15%' } };
  return (
    <motion.div
      className={className}
      initial="hidden"
      {...trigger}
      variants={fadeRise}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
