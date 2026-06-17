import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', md: '2rem', lg: '3rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        ink: '#0C1220',
        ivory: '#EDE7DA',
        bordeaux: '#5C1922',
        gold: '#B89968',
        stone: '#4A4E58',
        bone: '#F8F6F1',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem',  { lineHeight: '5rem',    letterSpacing: '-0.02em' }],
        'display-l':  ['3.5rem',  { lineHeight: '4rem',    letterSpacing: '-0.02em' }],
        'display-m':  ['2.5rem',  { lineHeight: '3rem',    letterSpacing: '-0.02em' }],
        'body-l':     ['1.1875rem', { lineHeight: '1.875rem' }],
        'body-m':     ['1rem',      { lineHeight: '1.625rem' }],
        'body-s':     ['0.875rem',  { lineHeight: '1.375rem' }],
        'mono':       ['0.8125rem', { lineHeight: '1.375rem', letterSpacing: '0.04em' }],
        'mono-s':     ['0.6875rem', { lineHeight: '1rem',     letterSpacing: '0.08em' }],
      },
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
      },
      spacing: {
        'section': 'clamp(96px, 12vh, 160px)',
      },
      maxWidth: {
        'editorial': '720px',
      },
    },
  },
  plugins: [],
};

export default config;
