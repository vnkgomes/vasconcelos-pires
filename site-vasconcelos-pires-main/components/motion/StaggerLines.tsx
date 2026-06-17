'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, Children } from 'react';
import { fadeRise, staggerParent } from '@/lib/motion';

type Mode = 'inView' | 'mount';

export function StaggerLines({
  children,
  className,
  mode = 'inView',
}: {
  children: ReactNode;
  className?: string;
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
      variants={staggerParent}
    >
      {Children.map(children, (child, i) => (
        <motion.div key={i} variants={fadeRise}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
