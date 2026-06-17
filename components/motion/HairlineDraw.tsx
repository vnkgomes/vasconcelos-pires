'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { hairlineDraw } from '@/lib/motion';

export function HairlineDraw({ className = '', color = 'bg-gold' }: { className?: string; color?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={`h-px ${color} ${className}`} />;
  return (
    <motion.div
      className={`h-px ${color} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15%' }}
      variants={hairlineDraw}
    />
  );
}
