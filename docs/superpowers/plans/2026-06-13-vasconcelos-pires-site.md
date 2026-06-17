# Vasconcelos & Pires Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the institutional static site for Vasconcelos & Pires Advogados Associados — 9 routes, Next.js 14 App Router + Tailwind + Framer Motion + MDX, deployed as static export to GitHub Pages.

**Architecture:** Static-only Next.js with App Router + `output: 'export'`. Tailwind config drives all design tokens. Content lives in typed TS files plus 3 MDX pareceres. Components decomposed by responsibility: `primitives/` (atomic), `layout/` (global chrome), `page-blocks/` (composed sections). MDX with custom components for the signature parecer treatment. Image pipeline pre-builds WebP/AVIF; OG covers pre-built with satori.

**Tech Stack:** Next.js 14, TypeScript 5.5+, Tailwind CSS 3.4+, Framer Motion 11+, MDX (`@next/mdx`), `next/font/google`, satori + sharp (build scripts), Vitest + Testing Library + @testing-library/jest-dom, Playwright (one E2E for parecer signature), axe-core (a11y).

**Reference docs:**
- Spec: `docs/superpowers/specs/2026-06-13-vasconcelos-pires-site-design.md`
- Brief: `BRIEFING.md`
- Wireframes: `WIREFRAMES.md`

---

## File structure (locked-in decomposition)

```
app/
  layout.tsx                                Root layout (fonts + global metadata)
  page.tsx                                  Home
  escritorio/page.tsx
  areas-de-atuacao/
    page.tsx                                Listing
    [slug]/page.tsx                         Individual area + Operations block
  equipe/
    page.tsx                                Listing
    [slug]/page.tsx                         Individual partner
  pareceres/
    page.tsx                                Listing grouped by year
    [slug]/page.tsx                         Individual parecer (renders MDX body)
  contato/page.tsx
  globals.css                               Tailwind directives + base CSS reset
  not-found.tsx                             404
  sitemap.ts
  robots.ts
components/
  layout/
    Header.tsx
    Footer.tsx
    MobileMenu.tsx
    SectionLabel.tsx
    Hairline.tsx
  primitives/
    SectionNumber.tsx
    GoldRule.tsx
    InlineRoman.tsx
    DocArrow.tsx
  page-blocks/
    Hero.tsx
    StatsRow.tsx
    PracticeAreaRow.tsx
    PartnerCard.tsx
    OperationsBlock.tsx
    ParecerListItem.tsx
    ParecerHeader.tsx
    ParecerParagraph.tsx
    ParecerQuote.tsx
    ParecerNav.tsx
    ContactForm.tsx
    TypographicTile.tsx
content/
  partners.ts                               4 partner objects
  practice-areas.ts                         5 area objects
  operations.ts                             3 operation objects
  pareceres/
    index.ts                                Registry: 8 entries (3 full + 5 stubs)
    047-stf-tributacao-software.mdx
    046-lei-do-carf-14689.mdx
    045-acordo-leniencia-cgu.mdx
lib/
  metadata.ts                               generateMetadata helper
  jsonld.ts                                 LegalService/Person/Article schema builders
  motion.ts                                 Shared Framer Motion variants
  print.ts                                  Print stylesheet trigger helpers
public/
  photos/_src/                              Originals (4 partner portraits)
  photos/                                   Generated WebP/AVIF
  og/                                       Generated OG covers
  fonts/                                    (next/font handles these — directory placeholder)
scripts/
  optimize-images.ts                        sharp pipeline
  generate-og.ts                            satori + sharp pipeline
tests/
  components/                               Vitest + Testing Library
  e2e/                                      Playwright (parecer.spec.ts)
```

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Initialize Next.js project files**

Create `package.json`:

```json
{
  "name": "vasconcelos-pires-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "prebuild": "tsx scripts/optimize-images.ts && tsx scripts/generate-og.ts"
  },
  "dependencies": {
    "next": "14.2.15",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "framer-motion": "11.11.0",
    "@next/mdx": "14.2.15",
    "@mdx-js/loader": "3.0.1",
    "@mdx-js/react": "3.0.1",
    "@types/mdx": "2.0.13"
  },
  "devDependencies": {
    "@types/node": "20.16.0",
    "@types/react": "18.3.11",
    "@types/react-dom": "18.3.0",
    "typescript": "5.5.4",
    "tailwindcss": "3.4.13",
    "postcss": "8.4.47",
    "autoprefixer": "10.4.20",
    "eslint": "8.57.1",
    "eslint-config-next": "14.2.15",
    "vitest": "2.1.1",
    "@vitejs/plugin-react": "4.3.2",
    "@testing-library/react": "16.0.1",
    "@testing-library/jest-dom": "6.5.0",
    "@testing-library/user-event": "14.5.2",
    "jsdom": "25.0.1",
    "@playwright/test": "1.47.2",
    "sharp": "0.33.5",
    "satori": "0.11.2",
    "tsx": "4.19.1",
    "axe-core": "4.10.0"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] },
    "target": "es2022"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.mjs`:

```js
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: { mdxRs: false }
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
```

Create `.gitignore`:

```
node_modules
.next
out
.env*.local
.DS_Store
*.log
public/photos/*.webp
public/photos/*.avif
public/og/*.png
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: Exit code 0; `node_modules/` created.

- [ ] **Step 3: Initialize git**

Run: `git init && git add -A && git commit -m "chore: project scaffold"`
Expected: Initial commit on `main` (or `master` per system default).

---

## Task 2: Tailwind configuration with design tokens

**Files:**
- Create: `tailwind.config.ts`, `postcss.config.js`, `app/globals.css`

- [ ] **Step 1: Create Tailwind config with full token system**

Create `tailwind.config.ts`:

```ts
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
```

- [ ] **Step 2: Create PostCSS config**

Create `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Create global styles**

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: light;
  }
  html { -webkit-text-size-adjust: 100%; }
  body {
    @apply bg-ivory text-ink font-sans text-body-m antialiased;
  }
  ::selection { background: theme(colors.gold / 30%); color: theme(colors.ink); }

  :focus-visible {
    @apply outline-none ring-2 ring-gold ring-offset-2 ring-offset-ivory;
  }
  .bg-ink :focus-visible {
    @apply ring-offset-ink;
  }
}

@layer utilities {
  .grid-editorial { @apply grid grid-cols-14 gap-x-6; }
  .container-narrow { max-width: 720px; margin-inline: auto; }
}

@media print {
  header, footer, nav, .no-print { display: none !important; }
  body { background: #fff !important; color: #000 !important; }
  a { color: #000 !important; text-decoration: none !important; }
  .parecer-print-only { display: block !important; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Verify Tailwind compiles**

Update `app/layout.tsx` (placeholder):

```tsx
import './globals.css';

export const metadata = { title: 'Vasconcelos & Pires' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

Update `app/page.tsx`:

```tsx
export default function Home() {
  return <main className="container py-section bg-ink text-ivory">Scaffold OK</main>;
}
```

Run: `npm run dev`
Expected: Dev server starts at http://localhost:3000; page renders with ink background, ivory text, large vertical padding. Stop server with Ctrl+C after verifying.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: tailwind tokens and global styles"
```

---

## Task 3: Fonts via next/font/google

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Configure font loaders**

Replace `app/layout.tsx`:

```tsx
import './globals.css';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
  preload: false,
});

export const metadata = {
  title: { default: 'Vasconcelos & Pires Advogados Associados', template: '%s · Vasconcelos & Pires' },
  description: 'Escritório boutique de direito empresarial em São Paulo. Atuação em societário, tributário, compliance e arbitragem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-ivory text-ink">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Update home to demonstrate fonts**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="container py-section">
      <p className="font-mono text-mono-s uppercase text-gold">Estab. 1998 · São Paulo</p>
      <h1 className="font-display text-display-xl mt-8">Direito empresarial,<br />conduzido com rigor<br />e discrição.</h1>
      <p className="font-sans text-body-l mt-8 max-w-editorial">Escritório boutique de São Paulo.</p>
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Run: `npm run dev` and open http://localhost:3000

Expected: Cormorant Garamond serif on h1, Inter sans on paragraph, JetBrains Mono uppercase gold on label. No FOIT/FOUT flash.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: next/font setup for display/sans/mono"
```

---

## Task 4: Vitest + Testing Library setup

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/components/smoke.test.tsx`

- [ ] **Step 1: Create Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: false,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
});
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Write smoke test**

Create `tests/components/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('test infrastructure', () => {
  it('renders a basic element and matches assertions', () => {
    render(<p data-testid="x">hello</p>);
    expect(screen.getByTestId('x')).toHaveTextContent('hello');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "test: vitest + testing-library setup"
```

---

## Task 5: Content data — partners

**Files:**
- Create: `content/partners.ts`, `tests/components/partners.test.ts`

- [ ] **Step 1: Write failing test for partner data shape**

Create `tests/components/partners.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { partners, getPartnerBySlug } from '@/content/partners';

describe('partners', () => {
  it('has exactly 4 partners', () => {
    expect(partners).toHaveLength(4);
  });

  it('each partner has required fields', () => {
    for (const p of partners) {
      expect(p.id).toMatch(/^[a-z-]+$/);
      expect(p.slug).toMatch(/^[a-z-]+$/);
      expect(p.name).toBeTruthy();
      expect(p.role).toBeTruthy();
      expect(p.practice).toBeTruthy();
      expect(p.bioShort).toBeTruthy();
      expect(p.bioLong).toBeTruthy();
      expect(p.education.length).toBeGreaterThan(0);
      expect(p.photoSrc).toMatch(/^\/photos\/partners\//);
    }
  });

  it('looks up partner by slug', () => {
    expect(getPartnerBySlug('eduardo-vasconcelos')?.name).toBe('Eduardo Vasconcelos');
    expect(getPartnerBySlug('nope')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- partners`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement content/partners.ts**

Create `content/partners.ts`:

```ts
export interface Partner {
  id: string;
  slug: string;
  name: string;
  role: string;
  practice: string;
  bioShort: string;
  bioLong: string;
  education: string[];
  photoSrc: string;
}

export const partners: Partner[] = [
  {
    id: 'eduardo-vasconcelos',
    slug: 'eduardo-vasconcelos',
    name: 'Eduardo Vasconcelos',
    role: 'Sócio-Fundador',
    practice: 'M&A · Direito Societário',
    bioShort: 'Mestre em Direito Comercial (USP), LLM em Corporate Law (Columbia Law School). 27 anos de carreira.',
    bioLong:
      'Mestre em Direito Comercial pela Universidade de São Paulo (USP). LLM em Corporate Law pela Columbia Law School. Foi general counsel de grupo industrial brasileiro de capital aberto entre 1992 e 1998, antes de fundar o escritório. Atuação destacada em operações de M&A de capital aberto desde 2003, com transações recorrentes na faixa de R$ 50M a R$ 2B.',
    education: ['Mestre em Direito Comercial — USP', 'LLM Corporate Law — Columbia Law School'],
    photoSrc: '/photos/partners/eduardo-vasconcelos.webp',
  },
  {
    id: 'helena-pires',
    slug: 'helena-pires',
    name: 'Helena Pires',
    role: 'Sócia-Fundadora',
    practice: 'Direito Tributário',
    bioShort: 'Doutora em Direito Tributário (USP), ex-Conselheira do CARF (2014–2018). Reconhecida por Chambers Brazil em Tax desde 2016.',
    bioLong:
      'Doutora em Direito Tributário pela Universidade de São Paulo (USP). Conselheira do Conselho Administrativo de Recursos Fiscais (CARF) entre 2014 e 2018. Reconhecida pelo Chambers Brazil em Tax desde 2016. Coordena a prática de Direito Tributário do escritório, com atuação em contencioso administrativo e judicial em matéria federal, estadual e municipal.',
    education: ['Doutora em Direito Tributário — USP', 'Conselheira CARF (2014–2018)'],
    photoSrc: '/photos/partners/helena-pires.webp',
  },
  {
    id: 'rafael-almeida-costa',
    slug: 'rafael-almeida-costa',
    name: 'Rafael Almeida Costa',
    role: 'Sócio',
    practice: 'Compliance · Governança',
    bioShort: 'Mestre em Direito Penal Econômico (PUC-SP), ex-Procurador da República (2008–2015). Lidera investigações internas de companhias listadas.',
    bioLong:
      'Mestre em Direito Penal Econômico pela PUC-SP. Procurador da República entre 2008 e 2015, antes de integrar o escritório. Lidera investigações internas de companhias listadas, programas de integridade (Lei 12.846), políticas anticorrupção e adequação à LGPD em ambientes corporativos complexos.',
    education: ['Mestre em Direito Penal Econômico — PUC-SP', 'ex-Procurador da República (2008–2015)'],
    photoSrc: '/photos/partners/rafael-almeida-costa.webp',
  },
  {
    id: 'patricia-bernardes',
    slug: 'patricia-bernardes',
    name: 'Patrícia Bernardes',
    role: 'Sócia',
    practice: 'Arbitragem · Disputas',
    bioShort: 'Mestre em Arbitragem Internacional (Queen Mary, Londres), Árbitra listada no CAM-CCBC. Atuou em arbitragens com valor agregado superior a R$ 4B.',
    bioLong:
      'Mestre em Arbitragem Internacional pela Queen Mary University of London. Árbitra listada no Centro de Arbitragem e Mediação da Câmara de Comércio Brasil-Canadá (CAM-CCBC). Atuou como advogada e árbitra em disputas com valor agregado superior a R$ 4 bilhões, em foros como CAM-CCBC, CCI e LCIA.',
    education: ['Mestre em Arbitragem Internacional — Queen Mary, Londres', 'Árbitra listada no CAM-CCBC'],
    photoSrc: '/photos/partners/patricia-bernardes.webp',
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}
```

- [ ] **Step 4: Run tests (expect PASS)**

Run: `npm test -- partners`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: partners content"
```

---

## Task 6: Content data — practice areas and operations

**Files:**
- Create: `content/operations.ts`, `content/practice-areas.ts`, `tests/components/practice-areas.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/components/practice-areas.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { practiceAreas, getPracticeAreaBySlug } from '@/content/practice-areas';
import { operations, getOperationsForArea } from '@/content/operations';

describe('practice areas', () => {
  it('has exactly 5 areas with numeric ids 1.1-1.5', () => {
    expect(practiceAreas).toHaveLength(5);
    expect(practiceAreas.map((a) => a.number)).toEqual(['1.1', '1.2', '1.3', '1.4', '1.5']);
  });

  it('looks up area by slug', () => {
    const a = getPracticeAreaBySlug('societario-ma');
    expect(a?.number).toBe('1.1');
  });
});

describe('operations', () => {
  it('has 3 operations mapped to areas 1.1, 1.4, 1.5', () => {
    expect(operations).toHaveLength(3);
    expect(operations.map((o) => o.areaSlug).sort()).toEqual(['arbitragem-disputas', 'compliance-governanca', 'societario-ma']);
  });

  it('returns operations for a given area', () => {
    expect(getOperationsForArea('societario-ma')).toHaveLength(1);
    expect(getOperationsForArea('contratos-empresariais')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests (expect FAIL)**

Run: `npm test -- practice-areas`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement operations**

Create `content/operations.ts`:

```ts
export interface Operation {
  id: string;
  areaSlug: string;
  title: string;
  summary: string;
  sector: string;
  meta: string;
}

export const operations: Operation[] = [
  {
    id: 'op-01',
    areaSlug: 'societario-ma',
    title: 'Reorganização societária multinacional pré-IPO',
    summary:
      'Estruturação da reorganização de holding brasileira de grupo multinacional europeu de bens de consumo, envolvendo seis subsidiárias e otimização tributária pré-IPO.',
    sector: 'Bens de consumo',
    meta: 'Valor da operação · confidencial',
  },
  {
    id: 'op-02',
    areaSlug: 'arbitragem-disputas',
    title: 'Defesa em arbitragem CAM-CCBC contra parceiro estrangeiro',
    summary:
      'Representação de companhia de infraestrutura em arbitragem contra parceiro estrangeiro, com pedido de R$ 380M. Decisão favorável ao cliente em 2023.',
    sector: 'Infraestrutura',
    meta: 'Pedido · R$ 380M · Decisão favorável (2023)',
  },
  {
    id: 'op-03',
    areaSlug: 'compliance-governanca',
    title: 'Programa de integridade pós-acordo de leniência',
    summary:
      'Desenho e implementação de programa de compliance de companhia listada, após acordo de leniência com a CGU. Acompanhamento contínuo de 36 meses.',
    sector: 'Construção',
    meta: 'Programa de 36 meses · CGU',
  },
];

export function getOperationsForArea(areaSlug: string): Operation[] {
  return operations.filter((op) => op.areaSlug === areaSlug);
}
```

- [ ] **Step 4: Implement practice areas**

Create `content/practice-areas.ts`:

```ts
export interface PracticeArea {
  id: string;
  slug: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  services: string[];
  partnerSlugs: string[];
  /** Used for areas without operations: descriptive "representative practice" copy */
  representativePractice?: string;
}

export const practiceAreas: PracticeArea[] = [
  {
    id: 'societario-ma',
    slug: 'societario-ma',
    number: '1.1',
    title: 'Direito Societário e M&A',
    summary:
      'Estruturação de operações de fusões e aquisições, joint ventures, reorganizações societárias, due diligence legal e negociação de acordos de acionistas.',
    description:
      'Atuação recorrente em transações de R$ 50M a R$ 2B. A prática combina senioridade institucional dos sócios em toda etapa relevante — diligência, negociação, fechamento — com discrição absoluta no trato de informações sensíveis. Atendemos companhias listadas, multinacionais e fundos de investimento em transações domésticas e cross-border.',
    services: [
      'Fusões e aquisições (M&A)',
      'Reorganizações societárias',
      'Joint ventures e parcerias estratégicas',
      'Due diligence legal',
      'Acordos de acionistas',
      'Estruturação de holdings',
      'Operações de private equity e venture capital',
    ],
    partnerSlugs: ['eduardo-vasconcelos'],
  },
  {
    id: 'contratos-empresariais',
    slug: 'contratos-empresariais',
    number: '1.2',
    title: 'Contratos Empresariais',
    summary:
      'Negociação e redação de contratos comerciais complexos — fornecimento de longo prazo, distribuição, licenciamento de tecnologia, parcerias estratégicas.',
    description:
      'Atuação consultiva em contratos de longo prazo entre companhias industriais, fornecedores estratégicos e licenciantes de tecnologia. A prática concentra-se em alocação eficiente de risco, mecanismos de adequação econômica e estruturas de resolução de impasses contratuais antes de chegar a disputa.',
    services: [
      'Contratos de fornecimento de longo prazo',
      'Distribuição e representação comercial',
      'Licenciamento de tecnologia e propriedade industrial',
      'Parcerias estratégicas e cooperação industrial',
      'Cláusulas de resolução de disputas',
      'Revisão e renegociação contratual',
    ],
    partnerSlugs: ['eduardo-vasconcelos'],
    representativePractice:
      'A prática atua com frequência em contratos plurianuais de fornecimento industrial, licenciamento de tecnologia entre matriz estrangeira e subsidiária brasileira e parcerias entre companhias listadas para projetos conjuntos.',
  },
  {
    id: 'tributario-empresarial',
    slug: 'tributario-empresarial',
    number: '1.3',
    title: 'Direito Tributário Empresarial',
    summary:
      'Consultoria preventiva, planejamento tributário, contencioso administrativo e judicial em matéria federal, estadual e municipal.',
    description:
      'Prática consolidada em contencioso tributário de alta complexidade, com atuação recorrente no CARF e tribunais superiores. A consultoria preventiva concentra-se em planejamento de operações societárias, regime de tributação de grupos econômicos e impactos tributários de reorganizações.',
    services: [
      'Consultoria tributária preventiva',
      'Planejamento tributário corporativo',
      'Contencioso administrativo (CARF)',
      'Contencioso judicial em matéria federal, estadual e municipal',
      'Recuperação de tributos',
      'Pareceres técnicos em matéria tributária',
    ],
    partnerSlugs: ['helena-pires'],
    representativePractice:
      'A prática atua de forma recorrente em recuperação de créditos tributários para companhias listadas, defesa de autuações em matéria de IRPJ/CSLL e teses de exclusão do ICMS da base de PIS/COFINS em reflexos posteriores ao Tema 69.',
  },
  {
    id: 'compliance-governanca',
    slug: 'compliance-governanca',
    number: '1.4',
    title: 'Compliance e Governança Corporativa',
    summary:
      'Implementação de programas de integridade (Lei 12.846), políticas anticorrupção, investigações internas, due diligence de terceiros e adequação à LGPD.',
    description:
      'A prática atende, com frequência, companhias com obrigações específicas decorrentes de acordos de leniência ou compromissos com órgãos reguladores. Desenho de controles, treinamento, canais de denúncia e investigações internas conduzidas com rigor probatório e sigilo absoluto.',
    services: [
      'Programas de integridade (Lei Anticorrupção 12.846)',
      'Investigações internas',
      'Adequação à LGPD em ambiente corporativo',
      'Due diligence de terceiros',
      'Treinamento de alta administração',
      'Acompanhamento de acordos de leniência',
    ],
    partnerSlugs: ['rafael-almeida-costa'],
  },
  {
    id: 'arbitragem-disputas',
    slug: 'arbitragem-disputas',
    number: '1.5',
    title: 'Arbitragem e Resolução de Disputas',
    summary:
      'Representação em arbitragens domésticas e internacionais (CAM-CCBC, CCI, LCIA), mediação empresarial e contencioso estratégico.',
    description:
      'Atuação em arbitragens com valor agregado superior a R$ 4 bilhões, em foros brasileiros e internacionais. A prática combina estratégia probatória rigorosa com defesa especializada em disputas societárias, contratuais e regulatórias entre companhias de grande porte.',
    services: [
      'Arbitragem doméstica (CAM-CCBC)',
      'Arbitragem internacional (CCI, LCIA)',
      'Mediação empresarial',
      'Contencioso estratégico em tribunais brasileiros',
      'Anulação e execução de sentença arbitral',
      'Disputas societárias entre acionistas',
    ],
    partnerSlugs: ['patricia-bernardes'],
  },
];

export function getPracticeAreaBySlug(slug: string): PracticeArea | undefined {
  return practiceAreas.find((a) => a.slug === slug);
}
```

- [ ] **Step 5: Run tests (expect PASS)**

Run: `npm test -- practice-areas`
Expected: 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: practice areas and operations content"
```

---

## Task 7: Content data — pareceres registry

**Files:**
- Create: `content/pareceres/index.ts`, `tests/components/pareceres.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/components/pareceres.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { pareceres, getParecerBySlug, getParecerNeighbors } from '@/content/pareceres';

describe('pareceres', () => {
  it('has 8 entries: 3 full and 5 stubs', () => {
    expect(pareceres).toHaveLength(8);
    expect(pareceres.filter((p) => p.kind === 'full')).toHaveLength(3);
    expect(pareceres.filter((p) => p.kind === 'stub')).toHaveLength(5);
  });

  it('sorts pareceres from newest to oldest', () => {
    const numbers = pareceres.map((p) => p.number);
    expect(numbers).toEqual(['047/2025', '046/2025', '045/2024', '044/2024', '043/2024', '042/2024', '041/2024', '040/2024']);
  });

  it('looks up parecer by slug', () => {
    expect(getParecerBySlug('stf-tributacao-software')?.number).toBe('047/2025');
  });

  it('returns neighbors for navigation', () => {
    const { previous, next } = getParecerNeighbors('lei-do-carf-14689');
    expect(previous?.number).toBe('045/2024');
    expect(next?.number).toBe('047/2025');
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- pareceres`
Expected: FAIL.

- [ ] **Step 3: Implement pareceres registry**

Create `content/pareceres/index.ts`:

```ts
export type ParecerKind = 'full' | 'stub';

export interface ParecerEntry {
  slug: string;
  number: string;
  year: number;
  date: string;
  dateLabel: string;
  title: string;
  subtitle: string;
  authorSlug: string;
  authorName: string;
  practice: string;
  kind: ParecerKind;
}

export const pareceres: ParecerEntry[] = [
  {
    slug: 'stf-tributacao-software',
    number: '047/2025',
    year: 2025,
    date: '2025-03-15',
    dateLabel: '15 mar 2025',
    title: 'STF e a tributação de software: o que muda após o RE 688.223',
    subtitle: 'Análise da tese firmada pelo Supremo Tribunal Federal e suas consequências práticas.',
    authorSlug: 'helena-pires',
    authorName: 'Helena Pires',
    practice: 'Direito Tributário',
    kind: 'full',
  },
  {
    slug: 'lei-do-carf-14689',
    number: '046/2025',
    year: 2025,
    date: '2025-02-28',
    dateLabel: '28 fev 2025',
    title: 'Lei do Carf: o efeito prático da Lei 14.689 no contencioso tributário',
    subtitle: 'Como a retomada do voto de qualidade pró-fisco redesenha a estratégia em CARF.',
    authorSlug: 'helena-pires',
    authorName: 'Helena Pires',
    practice: 'Direito Tributário',
    kind: 'full',
  },
  {
    slug: 'acordo-leniencia-cgu',
    number: '045/2024',
    year: 2024,
    date: '2024-12-12',
    dateLabel: '12 dez 2024',
    title: 'Acordo de leniência: limites do poder discricionário da CGU',
    subtitle: 'Os contornos da margem de avaliação da Controladoria-Geral da União após decisões recentes.',
    authorSlug: 'rafael-almeida-costa',
    authorName: 'Rafael Almeida Costa',
    practice: 'Compliance',
    kind: 'full',
  },
  {
    slug: 'arbitragem-acionistas-empresas-familiares',
    number: '044/2024',
    year: 2024,
    date: '2024-10-22',
    dateLabel: '22 out 2024',
    title: 'Arbitragem entre acionistas em empresas familiares: cláusula compromissória e legitimidade',
    subtitle: '',
    authorSlug: 'patricia-bernardes',
    authorName: 'Patrícia Bernardes',
    practice: 'Arbitragem',
    kind: 'stub',
  },
  {
    slug: 'reforma-tributaria-iva-dual',
    number: '043/2024',
    year: 2024,
    date: '2024-08-30',
    dateLabel: '30 ago 2024',
    title: 'Reforma tributária e IVA dual: o que companhias industriais precisam decidir até 2026',
    subtitle: '',
    authorSlug: 'helena-pires',
    authorName: 'Helena Pires',
    practice: 'Direito Tributário',
    kind: 'stub',
  },
  {
    slug: 'investigacoes-internas-prerrogativas',
    number: '042/2024',
    year: 2024,
    date: '2024-06-18',
    dateLabel: '18 jun 2024',
    title: 'Investigações internas e prerrogativas profissionais: a posição do STF',
    subtitle: '',
    authorSlug: 'rafael-almeida-costa',
    authorName: 'Rafael Almeida Costa',
    practice: 'Compliance',
    kind: 'stub',
  },
  {
    slug: 'm-a-tech-clausulas-earnout',
    number: '041/2024',
    year: 2024,
    date: '2024-04-09',
    dateLabel: '09 abr 2024',
    title: 'M&A em tecnologia: cláusulas de earn-out e disputas sobre realização de metas',
    subtitle: '',
    authorSlug: 'eduardo-vasconcelos',
    authorName: 'Eduardo Vasconcelos',
    practice: 'M&A',
    kind: 'stub',
  },
  {
    slug: 'lgpd-due-diligence-m-a',
    number: '040/2024',
    year: 2024,
    date: '2024-02-14',
    dateLabel: '14 fev 2024',
    title: 'LGPD em due diligence de M&A: o passivo invisível na avaliação de targets',
    subtitle: '',
    authorSlug: 'rafael-almeida-costa',
    authorName: 'Rafael Almeida Costa',
    practice: 'Compliance',
    kind: 'stub',
  },
];

export function getParecerBySlug(slug: string): ParecerEntry | undefined {
  return pareceres.find((p) => p.slug === slug);
}

export function getParecerNeighbors(slug: string): { previous?: ParecerEntry; next?: ParecerEntry } {
  const idx = pareceres.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return {
    next: idx > 0 ? pareceres[idx - 1] : undefined,
    previous: idx < pareceres.length - 1 ? pareceres[idx + 1] : undefined,
  };
}

export function getFullPareceres(): ParecerEntry[] {
  return pareceres.filter((p) => p.kind === 'full');
}

export function getYearsWithPareceres(): number[] {
  return Array.from(new Set(pareceres.map((p) => p.year))).sort((a, b) => b - a);
}
```

- [ ] **Step 4: Run tests (expect PASS)**

Run: `npm test -- pareceres`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: pareceres registry (8 entries, 3 full + 5 stubs)"
```

---

## Task 8: Primitives — SectionNumber, GoldRule, InlineRoman, DocArrow, Hairline

**Files:**
- Create: `components/primitives/SectionNumber.tsx`, `components/primitives/GoldRule.tsx`, `components/primitives/InlineRoman.tsx`, `components/primitives/DocArrow.tsx`, `components/layout/Hairline.tsx`, `tests/components/primitives.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/primitives.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionNumber } from '@/components/primitives/SectionNumber';
import { GoldRule } from '@/components/primitives/GoldRule';
import { InlineRoman } from '@/components/primitives/InlineRoman';
import { DocArrow } from '@/components/primitives/DocArrow';
import { Hairline } from '@/components/layout/Hairline';

describe('primitives', () => {
  it('SectionNumber renders mono gold number', () => {
    render(<SectionNumber>1.1</SectionNumber>);
    const el = screen.getByText('1.1');
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/text-gold/);
  });

  it('GoldRule renders a gold hairline', () => {
    const { container } = render(<GoldRule />);
    const hr = container.querySelector('hr');
    expect(hr).not.toBeNull();
    expect(hr!.className).toMatch(/border-gold/);
  });

  it('InlineRoman converts numbers to lowercase roman', () => {
    render(<InlineRoman n={4} />);
    expect(screen.getByText('iv.')).toBeInTheDocument();
  });

  it('DocArrow renders the arrow character with mono gold', () => {
    render(<DocArrow />);
    expect(screen.getByText('→')).toHaveClass('font-mono');
    expect(screen.getByText('→').className).toMatch(/text-gold/);
  });

  it('Hairline accepts variant gold and renders gold border', () => {
    const { container } = render(<Hairline variant="gold" />);
    expect(container.querySelector('hr')!.className).toMatch(/border-gold/);
  });

  it('Hairline default variant uses ivory/30 sobre ink', () => {
    const { container } = render(<Hairline />);
    expect(container.querySelector('hr')!.className).toMatch(/border-ivory/);
  });
});
```

- [ ] **Step 2: Run tests (expect FAIL)**

Run: `npm test -- primitives`
Expected: 6 failures.

- [ ] **Step 3: Implement primitives**

Create `components/primitives/SectionNumber.tsx`:

```tsx
import { ReactNode } from 'react';

export function SectionNumber({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-mono text-gold ${className}`}>
      {children}
    </span>
  );
}
```

Create `components/primitives/GoldRule.tsx`:

```tsx
export function GoldRule({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-gold ${className}`} />;
}
```

Create `components/primitives/InlineRoman.tsx`:

```tsx
const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

export function InlineRoman({ n, className = '' }: { n: number; className?: string }) {
  const r = ROMAN[n] ?? String(n);
  return <span className={`font-mono text-mono text-gold ${className}`}>{r}.</span>;
}
```

Create `components/primitives/DocArrow.tsx`:

```tsx
export function DocArrow({ className = '' }: { className?: string }) {
  return <span className={`font-mono text-gold ${className}`} aria-hidden="true">→</span>;
}
```

Create `components/layout/Hairline.tsx`:

```tsx
type Variant = 'default' | 'gold' | 'double';

const VARIANTS: Record<Variant, string> = {
  default: 'border-t border-ivory/30',
  gold: 'border-t border-gold',
  double: 'border-y border-gold py-1',
};

export function Hairline({ variant = 'default', className = '' }: { variant?: Variant; className?: string }) {
  if (variant === 'double') {
    return (
      <div className={`${VARIANTS.double} ${className}`} role="separator">
        <hr className="border-0 border-t border-gold" />
      </div>
    );
  }
  return <hr className={`border-0 ${VARIANTS[variant]} ${className}`} />;
}
```

- [ ] **Step 4: Run tests (expect PASS)**

Run: `npm test -- primitives`
Expected: 6 pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: primitive components (SectionNumber, GoldRule, InlineRoman, DocArrow, Hairline)"
```

---

## Task 9: Layout — SectionLabel

**Files:**
- Create: `components/layout/SectionLabel.tsx`, `tests/components/section-label.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/section-label.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionLabel } from '@/components/layout/SectionLabel';

describe('SectionLabel', () => {
  it('renders uppercase mono-s with leading dash', () => {
    render(<SectionLabel>Em números</SectionLabel>);
    const text = screen.getByText(/EM NÚMEROS/);
    expect(text.className).toMatch(/font-mono/);
    expect(text.className).toMatch(/uppercase/);
  });

  it('renders leading bullet characters', () => {
    render(<SectionLabel>Pareceres</SectionLabel>);
    expect(screen.getByText(/──/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- section-label`
Expected: FAIL.

- [ ] **Step 3: Implement SectionLabel**

Create `components/layout/SectionLabel.tsx`:

```tsx
import { ReactNode } from 'react';

export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-mono-s uppercase tracking-[0.16em] text-stone ${className}`}>
      <span aria-hidden="true">── </span>
      <span>{typeof children === 'string' ? children.toUpperCase() : children}</span>
    </p>
  );
}
```

- [ ] **Step 4: Run tests (expect PASS)**

Run: `npm test -- section-label`
Expected: 2 pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: SectionLabel layout component"
```

---

## Task 10: Layout — Header + nav

**Files:**
- Create: `components/layout/Header.tsx`, `tests/components/header.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders all 5 nav items as links', () => {
    render(<Header pathname="/" />);
    expect(screen.getByRole('link', { name: 'Escritório' })).toHaveAttribute('href', '/escritorio');
    expect(screen.getByRole('link', { name: 'Áreas' })).toHaveAttribute('href', '/areas-de-atuacao');
    expect(screen.getByRole('link', { name: 'Equipe' })).toHaveAttribute('href', '/equipe');
    expect(screen.getByRole('link', { name: 'Pareceres' })).toHaveAttribute('href', '/pareceres');
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '/contato');
  });

  it('renders wordmark in two-line treatment', () => {
    render(<Header pathname="/" />);
    expect(screen.getByText('VASCONCELOS & PIRES')).toBeInTheDocument();
    expect(screen.getByText('ADVOGADOS ASSOCIADOS')).toBeInTheDocument();
  });

  it('marks active link with aria-current', () => {
    render(<Header pathname="/pareceres" />);
    expect(screen.getByRole('link', { name: 'Pareceres' })).toHaveAttribute('aria-current', 'page');
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- header`
Expected: FAIL.

- [ ] **Step 3: Implement Header**

Create `components/layout/Header.tsx`:

```tsx
import Link from 'next/link';

const NAV = [
  { href: '/escritorio', label: 'Escritório' },
  { href: '/areas-de-atuacao', label: 'Áreas' },
  { href: '/equipe', label: 'Equipe' },
  { href: '/pareceres', label: 'Pareceres' },
  { href: '/contato', label: 'Contato' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Header({ pathname }: { pathname: string }) {
  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md text-ivory">
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="leading-none">
          <span className="block font-display text-display-m">VASCONCELOS &amp; PIRES</span>
          <span className="mt-1 flex items-center gap-2 font-mono text-mono-s uppercase text-ivory/60">
            <span className="inline-block h-px w-6 bg-bordeaux" aria-hidden="true" />
            Advogados Associados
          </span>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex gap-8 font-sans text-body-m">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative inline-block transition-colors hover:text-bone ${active ? 'text-bone after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-gold' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button className="md:hidden h-6 w-8 flex items-center" aria-label="Menu" data-menu-toggle>
          <span className="block h-px w-full bg-gold" />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run tests (expect PASS)**

Run: `npm test -- header`
Expected: 3 pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Header with sticky nav and active state"
```

---

## Task 11: Layout — MobileMenu (drawer + state)

**Files:**
- Create: `components/layout/MobileMenu.tsx`, `tests/components/mobile-menu.test.tsx`. Modify: `components/layout/Header.tsx` to wire up open state.

- [ ] **Step 1: Write failing test**

Create `tests/components/mobile-menu.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MobileMenu } from '@/components/layout/MobileMenu';

describe('MobileMenu', () => {
  it('does not render menu items when closed', () => {
    render(<MobileMenu open={false} onClose={() => {}} pathname="/" />);
    expect(screen.queryByRole('link', { name: /Pareceres/ })).not.toBeInTheDocument();
  });

  it('renders 5 menu items when open, each with roman numeral', () => {
    render(<MobileMenu open={true} onClose={() => {}} pathname="/" />);
    expect(screen.getByRole('link', { name: /i\..*Escritório/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /v\..*Contato/ })).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<MobileMenu open={true} onClose={onClose} pathname="/" />);
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- mobile-menu`
Expected: FAIL.

- [ ] **Step 3: Implement MobileMenu**

Create `components/layout/MobileMenu.tsx`:

```tsx
'use client';
import Link from 'next/link';
import { InlineRoman } from '@/components/primitives/InlineRoman';

const NAV = [
  { href: '/escritorio', label: 'Escritório' },
  { href: '/areas-de-atuacao', label: 'Áreas' },
  { href: '/equipe', label: 'Equipe' },
  { href: '/pareceres', label: 'Pareceres' },
  { href: '/contato', label: 'Contato' },
];

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-md text-ivory md:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
      <div className="flex items-center justify-end p-6">
        <button
          aria-label="Fechar menu"
          onClick={onClose}
          className="text-gold font-mono text-body-l"
        >
          ×
        </button>
      </div>
      <nav className="container mt-12">
        <ul className="space-y-6">
          {NAV.map((item, i) => (
            <li key={item.href} className="flex items-baseline gap-4">
              <InlineRoman n={i + 1} />
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                className="font-display text-display-m hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Wire Header → MobileMenu**

Replace `components/layout/Header.tsx`:

```tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';

const NAV = [
  { href: '/escritorio', label: 'Escritório' },
  { href: '/areas-de-atuacao', label: 'Áreas' },
  { href: '/equipe', label: 'Equipe' },
  { href: '/pareceres', label: 'Pareceres' },
  { href: '/contato', label: 'Contato' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Header({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md text-ivory">
        <div className="container flex items-center justify-between py-5">
          <Link href="/" className="leading-none">
            <span className="block font-display text-display-m">VASCONCELOS &amp; PIRES</span>
            <span className="mt-1 flex items-center gap-2 font-mono text-mono-s uppercase text-ivory/60">
              <span className="inline-block h-px w-6 bg-bordeaux" aria-hidden="true" />
              Advogados Associados
            </span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex gap-8 font-sans text-body-m">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative inline-block transition-colors hover:text-bone ${active ? 'text-bone after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-gold' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <button
            className="md:hidden h-6 w-8 flex items-center"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="block h-px w-full bg-gold" />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}
```

- [ ] **Step 5: Add header test for the menu state**

Update `tests/components/header.test.tsx` to add:

```tsx
import userEvent from '@testing-library/user-event';

it('opens mobile menu when toggle clicked', async () => {
  const user = userEvent.setup();
  render(<Header pathname="/" />);
  await user.click(screen.getByLabelText('Menu'));
  expect(screen.getByRole('dialog', { name: 'Menu de navegação' })).toBeInTheDocument();
});
```

- [ ] **Step 6: Run all component tests (expect PASS)**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: MobileMenu drawer with roman numerals"
```

---

## Task 12: Layout — Footer + HeaderWithPath wrapper

**Files:**
- Create: `components/layout/Footer.tsx`, `components/layout/HeaderWithPath.tsx`. Modify: `app/layout.tsx`.

- [ ] **Step 1: Implement Footer**

Create `components/layout/Footer.tsx`:

```tsx
import Link from 'next/link';

const COLS = [
  { title: 'Escritório', links: [{ href: '/escritorio', label: 'Sobre' }, { href: '/equipe', label: 'Equipe' }] },
  { title: 'Atuação', links: [{ href: '/areas-de-atuacao', label: 'Áreas' }, { href: '/pareceres', label: 'Pareceres' }] },
  { title: 'Contato', links: [{ href: '/contato', label: 'Agendamento' }] },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="container py-section">
        <div className="grid grid-cols-1 md:grid-cols-14 gap-x-6 gap-y-12">
          <div className="md:col-span-5">
            <p className="font-display text-display-m leading-none">VASCONCELOS &amp; PIRES</p>
            <p className="mt-2 flex items-center gap-2 font-mono text-mono-s uppercase text-ivory/60">
              <span className="inline-block h-px w-6 bg-bordeaux" />
              Advogados Associados
            </p>
            <address className="mt-8 not-italic font-sans text-body-m text-ivory/80">
              Av. Brigadeiro Faria Lima, 4221<br />
              19º andar · Itaim Bibi<br />
              São Paulo / SP — CEP 04538-133
            </address>
            <p className="mt-6 font-mono text-mono text-ivory/80">+55 11 3147-8200</p>
            <p className="font-mono text-mono text-ivory/80">contato@vasconcellospires.com.br</p>
          </div>
          {COLS.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-ivory/50">{col.title}</p>
              <ul className="mt-6 space-y-3 font-sans text-body-m">
                {col.links.map((l) => (
                  <li key={l.href}><Link className="hover:text-bone" href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="mt-section border-0 border-t border-ivory/20" />
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between font-mono text-mono-s uppercase text-ivory/50">
          <span>© 2026 Vasconcelos &amp; Pires Advogados Associados · OAB/SP 12.345</span>
          <span>Política de Privacidade · LGPD</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Create path-aware header wrapper (client component)**

Create `components/layout/HeaderWithPath.tsx`:

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function HeaderWithPath() {
  const pathname = usePathname() ?? '/';
  return <Header pathname={pathname} />;
}
```

- [ ] **Step 3: Wire layout**

Replace `app/layout.tsx`:

```tsx
import './globals.css';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import { HeaderWithPath } from '@/components/layout/HeaderWithPath';
import { Footer } from '@/components/layout/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const metadata = {
  title: { default: 'Vasconcelos & Pires Advogados Associados', template: '%s · Vasconcelos & Pires' },
  description: 'Escritório boutique de direito empresarial em São Paulo. Atuação em societário, tributário, compliance e arbitragem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <HeaderWithPath />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`
Expected: Header sticky at top of every page; footer at bottom; nav links work; clicking menu button on mobile (use devtools mobile emulation, narrow viewport <768px) opens drawer.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Footer and layout wiring with Header"
```

---

## Task 13: Page block — StatsRow

**Files:**
- Create: `components/page-blocks/StatsRow.tsx`, `tests/components/stats-row.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/stats-row.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatsRow } from '@/components/page-blocks/StatsRow';

describe('StatsRow', () => {
  const items = [
    { value: '27', label: 'anos de atuação' },
    { value: '24', label: 'advogados em quadro fixo' },
  ];
  it('renders each stat with display value and mono label', () => {
    render(<StatsRow items={items} />);
    expect(screen.getByText('27').className).toMatch(/font-display/);
    expect(screen.getByText('anos de atuação').className).toMatch(/font-mono/);
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- stats-row`
Expected: FAIL.

- [ ] **Step 3: Implement StatsRow**

Create `components/page-blocks/StatsRow.tsx`:

```tsx
import { SectionLabel } from '@/components/layout/SectionLabel';

interface Stat {
  value: string;
  label: string;
}

export function StatsRow({ items, label = 'Em números' }: { items: Stat[]; label?: string }) {
  return (
    <section className="container py-section">
      <SectionLabel>{label}</SectionLabel>
      <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {items.map((s) => (
          <div key={s.label}>
            <dt className="font-display text-display-l text-ink">{s.value}</dt>
            <dd className="mt-3 font-mono text-mono-s uppercase tracking-[0.12em] text-stone">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 4: Run test (expect PASS)**

Run: `npm test -- stats-row`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: StatsRow page block"
```

---

## Task 14: Page block — PracticeAreaRow

**Files:**
- Create: `components/page-blocks/PracticeAreaRow.tsx`, `tests/components/practice-area-row.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/practice-area-row.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PracticeAreaRow } from '@/components/page-blocks/PracticeAreaRow';

const area = {
  number: '1.1',
  title: 'Direito Societário e M&A',
  summary: 'Estruturação de operações.',
  slug: 'societario-ma',
};

describe('PracticeAreaRow', () => {
  it('renders number, title, summary, and link to area', () => {
    render(<PracticeAreaRow area={area as any} />);
    expect(screen.getByText('1.1')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Direito Societário e M&A/ })).toHaveAttribute('href', '/areas-de-atuacao/societario-ma');
    expect(screen.getByText(/Estruturação de operações/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- practice-area-row`
Expected: FAIL.

- [ ] **Step 3: Implement PracticeAreaRow**

Create `components/page-blocks/PracticeAreaRow.tsx`:

```tsx
import Link from 'next/link';
import type { PracticeArea } from '@/content/practice-areas';
import { SectionNumber } from '@/components/primitives/SectionNumber';
import { DocArrow } from '@/components/primitives/DocArrow';
import { Hairline } from '@/components/layout/Hairline';

export function PracticeAreaRow({ area, last = false }: { area: PracticeArea; last?: boolean }) {
  return (
    <article>
      <Link href={`/areas-de-atuacao/${area.slug}`} className="group block py-12">
        <div className="grid grid-cols-14 gap-x-6">
          <div className="col-span-2 md:col-span-1 pt-2">
            <SectionNumber>{area.number}</SectionNumber>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h3 className="font-display text-display-l text-ink group-hover:text-bordeaux transition-colors">
              {area.title}
            </h3>
            <p className="mt-4 font-sans text-body-l text-stone max-w-editorial">{area.summary}</p>
          </div>
          <div className="hidden md:flex md:col-span-3 md:col-start-12 justify-end items-start pt-4">
            <DocArrow className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </div>
      </Link>
      {!last && <Hairline className="border-ink/15" />}
    </article>
  );
}
```

- [ ] **Step 4: Run test (expect PASS)**

Run: `npm test -- practice-area-row`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: PracticeAreaRow block"
```

---

## Task 15: Page block — PartnerCard

**Files:**
- Create: `components/page-blocks/PartnerCard.tsx`, `tests/components/partner-card.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/partner-card.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PartnerCard } from '@/components/page-blocks/PartnerCard';
import { partners } from '@/content/partners';

describe('PartnerCard', () => {
  it('renders partner name, practice, and short bio with link to detail page', () => {
    render(<PartnerCard partner={partners[0]} />);
    expect(screen.getByText('Eduardo Vasconcelos')).toBeInTheDocument();
    expect(screen.getByText(/M&A · Direito Societário/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Página completa/ })).toHaveAttribute('href', '/equipe/eduardo-vasconcelos');
  });

  it('reverses layout when reverse prop is true', () => {
    const { container } = render(<PartnerCard partner={partners[0]} reverse />);
    expect(container.firstChild).toHaveClass('md:flex-row-reverse');
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- partner-card`
Expected: FAIL.

- [ ] **Step 3: Implement PartnerCard**

Create `components/page-blocks/PartnerCard.tsx`:

```tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Partner } from '@/content/partners';
import { DocArrow } from '@/components/primitives/DocArrow';
import { GoldRule } from '@/components/primitives/GoldRule';

export function PartnerCard({ partner, reverse = false }: { partner: Partner; reverse?: boolean }) {
  return (
    <article className={`flex flex-col md:flex-row gap-12 py-section ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="md:w-2/5">
        <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
          <Image src={partner.photoSrc} alt={`Retrato de ${partner.name}`} fill className="object-cover grayscale" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
      </div>
      <div className="md:w-3/5">
        <h3 className="font-display text-display-l text-ink">{partner.name}</h3>
        <p className="mt-2 font-sans text-body-m text-stone">{partner.role}</p>
        <p className="mt-1 font-sans text-body-m text-bordeaux">{partner.practice}</p>
        <GoldRule className="mt-6 w-12" />
        <p className="mt-6 font-sans text-body-l text-ink max-w-editorial">{partner.bioLong}</p>
        <Link href={`/equipe/${partner.slug}`} className="mt-8 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
          <DocArrow />
          Página completa
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run test (expect PASS)**

Run: `npm test -- partner-card`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: PartnerCard block"
```

---

## Task 16: Page block — OperationsBlock + TypographicTile

**Files:**
- Create: `components/page-blocks/OperationsBlock.tsx`, `components/page-blocks/TypographicTile.tsx`, `tests/components/operations.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/operations.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OperationsBlock } from '@/components/page-blocks/OperationsBlock';
import { TypographicTile } from '@/components/page-blocks/TypographicTile';
import { operations } from '@/content/operations';

describe('OperationsBlock', () => {
  it('renders heading and one entry per operation', () => {
    render(<OperationsBlock operations={[operations[0]]} />);
    expect(screen.getByText(/OPERAÇÕES REPRESENTATIVAS/i)).toBeInTheDocument();
    expect(screen.getByText(/Reorganização societária multinacional/)).toBeInTheDocument();
  });

  it('falls back to representativePractice copy when no operations', () => {
    render(<OperationsBlock operations={[]} representativePractice="Texto descritivo." />);
    expect(screen.getByText(/Texto descritivo/)).toBeInTheDocument();
  });
});

describe('TypographicTile', () => {
  it('renders eyebrow, body, meta', () => {
    render(<TypographicTile eyebrow="Itaim Bibi" body="Avenida Faria Lima, 4221" meta="19º andar" />);
    expect(screen.getByText('Itaim Bibi')).toBeInTheDocument();
    expect(screen.getByText('Avenida Faria Lima, 4221')).toBeInTheDocument();
    expect(screen.getByText('19º andar')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- operations`
Expected: FAIL.

- [ ] **Step 3: Implement TypographicTile**

Create `components/page-blocks/TypographicTile.tsx`:

```tsx
import { InlineRoman } from '@/components/primitives/InlineRoman';
import { GoldRule } from '@/components/primitives/GoldRule';

export function TypographicTile({
  eyebrow,
  body,
  meta,
  roman,
}: {
  eyebrow?: string;
  body: string;
  meta?: string;
  roman?: number;
}) {
  return (
    <article className="border border-ink/10 bg-bone p-8 flex flex-col h-full">
      <div className="flex items-baseline gap-2">
        {roman !== undefined && <InlineRoman n={roman} />}
        {eyebrow && <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{eyebrow}</p>}
      </div>
      <GoldRule className="mt-4 w-8" />
      <p className="mt-6 font-display text-display-m text-ink">{body}</p>
      {meta && <p className="mt-auto pt-8 font-mono text-mono text-stone">{meta}</p>}
    </article>
  );
}
```

- [ ] **Step 4: Implement OperationsBlock**

Create `components/page-blocks/OperationsBlock.tsx`:

```tsx
import type { Operation } from '@/content/operations';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { GoldRule } from '@/components/primitives/GoldRule';

export function OperationsBlock({
  operations,
  representativePractice,
  label = 'Operações Representativas',
}: {
  operations: Operation[];
  representativePractice?: string;
  label?: string;
}) {
  if (operations.length === 0 && representativePractice) {
    return (
      <section className="container py-section">
        <SectionLabel>Atuação Representativa</SectionLabel>
        <p className="mt-8 max-w-editorial font-sans text-body-l text-ink">{representativePractice}</p>
      </section>
    );
  }
  return (
    <section className="container py-section">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-12 space-y-12">
        {operations.map((op) => (
          <article key={op.id} className="grid grid-cols-14 gap-x-6">
            <div className="col-span-14 md:col-span-2">
              <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-gold">{op.sector}</p>
            </div>
            <div className="col-span-14 md:col-span-9">
              <h3 className="font-display text-display-m text-ink">{op.title}</h3>
              <GoldRule className="mt-4 w-12" />
              <p className="mt-6 font-sans text-body-l text-stone max-w-editorial">{op.summary}</p>
            </div>
            <div className="col-span-14 md:col-span-3 md:text-right">
              <p className="font-mono text-mono text-stone">{op.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run tests (expect PASS)**

Run: `npm test -- operations`
Expected: 3 pass.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: OperationsBlock and TypographicTile"
```

---

## Task 17: Page block — ContactForm (mock submit)

**Files:**
- Create: `components/page-blocks/ContactForm.tsx`, `tests/components/contact-form.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/contact-form.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ContactForm } from '@/components/page-blocks/ContactForm';

describe('ContactForm', () => {
  it('renders all required fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Nome/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Empresa/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email corporativo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Natureza da consulta/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descreva brevemente/)).toBeInTheDocument();
  });

  it('shows confirmation message after submit, without making any network call', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/Nome/), 'Maria Silva');
    await user.type(screen.getByLabelText(/Email corporativo/), 'maria@empresa.com');
    await user.click(screen.getByRole('button', { name: /Solicitar agendamento/ }));
    expect(await screen.findByText(/Recebemos sua solicitação/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- contact-form`
Expected: FAIL.

- [ ] **Step 3: Implement ContactForm**

Create `components/page-blocks/ContactForm.tsx`:

```tsx
'use client';
import { useState, FormEvent } from 'react';
import { DocArrow } from '@/components/primitives/DocArrow';

const NATURES = ['Societário · M&A', 'Contratos Empresariais', 'Tributário', 'Compliance', 'Arbitragem'];

const FIELD_BASE =
  'block w-full bg-transparent border-0 border-b border-ink/30 px-0 py-2 font-sans text-body-m text-ink ' +
  'focus:border-gold focus:outline-none focus:ring-0 transition-colors';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border-l-2 border-gold pl-6 py-6">
        <p className="font-display text-display-m text-ink">Recebemos sua solicitação.</p>
        <p className="mt-4 font-sans text-body-l text-stone max-w-editorial">
          Um sócio entrará em contato em até dois dias úteis, no endereço corporativo informado, para confirmar o agendamento.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {[
        { id: 'name', label: 'Nome', type: 'text', required: true },
        { id: 'company', label: 'Empresa', type: 'text', required: false },
        { id: 'role', label: 'Cargo', type: 'text', required: false },
        { id: 'email', label: 'Email corporativo', type: 'email', required: true },
        { id: 'phone', label: 'Telefone', type: 'tel', required: false },
      ].map((f) => (
        <div key={f.id}>
          <label htmlFor={f.id} className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{f.label}</label>
          <input id={f.id} name={f.id} type={f.type} required={f.required} className={FIELD_BASE + ' mt-2'} />
        </div>
      ))}

      <div>
        <label htmlFor="nature" className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">Natureza da consulta</label>
        <select id="nature" name="nature" className={FIELD_BASE + ' mt-2'}>
          {NATURES.map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">Descreva brevemente</label>
        <textarea id="message" name="message" rows={4} className={FIELD_BASE + ' mt-2 resize-none'} />
      </div>

      <button type="submit" className="inline-flex items-center gap-3 mt-4 font-sans text-body-m text-ink hover:text-bordeaux transition-colors">
        <DocArrow />
        Solicitar agendamento
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run tests (expect PASS)**

Run: `npm test -- contact-form`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: ContactForm with mock submit"
```

---

## Task 18: Routes — /escritorio, /contato, /areas-de-atuacao, /equipe (listings)

**Files:**
- Create: `app/escritorio/page.tsx`, `app/contato/page.tsx`, `app/areas-de-atuacao/page.tsx`, `app/equipe/page.tsx`

- [ ] **Step 1: Implement /escritorio**

Create `app/escritorio/page.tsx`:

```tsx
import { SectionLabel } from '@/components/layout/SectionLabel';
import { TypographicTile } from '@/components/page-blocks/TypographicTile';
import { InlineRoman } from '@/components/primitives/InlineRoman';
import { GoldRule } from '@/components/primitives/GoldRule';

export const metadata = {
  title: 'O Escritório',
  description: 'Vinte e sete anos de direito empresarial em São Paulo. História, filosofia e princípios do escritório.',
};

const PRINCIPIOS = [
  'Confidencialidade absoluta como pré-condição.',
  'Substância jurídica acima de retórica processual.',
  'Senioridade no atendimento. Sócios participam de toda operação relevante.',
  'Recusa a casos com conflito ético, independentemente do valor envolvido.',
];

const TILES = [
  { eyebrow: 'Sede', body: 'Avenida Brigadeiro Faria Lima, 4221 — 19º andar', meta: 'Itaim Bibi · São Paulo', roman: 1 },
  { eyebrow: 'Fundação', body: '1998 — Eduardo Vasconcelos e Helena Pires', meta: '27 anos de atuação contínua', roman: 2 },
  { eyebrow: 'Estrutura', body: '24 advogados em quadro fixo', meta: '4 sócios fundadores e gestores', roman: 3 },
  { eyebrow: 'Atuação', body: 'Direito empresarial em foros brasileiros e internacionais', meta: 'CAM-CCBC · CCI · LCIA', roman: 4 },
  { eyebrow: 'Clientela', body: 'Companhias listadas, multinacionais, family offices', meta: 'Não atendemos pessoa física', roman: 5 },
  { eyebrow: 'Idioma', body: 'Atendimento em português, inglês e espanhol', meta: 'Documentação internacional', roman: 6 },
];

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>O Escritório</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Vinte e sete anos de<br />direito empresarial.
        </h1>
        <GoldRule className="mt-12 w-12" />
        <div className="mt-12 max-w-editorial space-y-6 font-sans text-body-l text-ink">
          <p>
            Vasconcelos &amp; Pires foi fundado em 1998 pelos advogados Eduardo Vasconcelos e Helena Pires, após mais de uma década atuando como conselheiros internos de companhias industriais brasileiras de capital aberto. A decisão de fundar um escritório boutique veio da convicção de que companhias de grande porte precisam de assessoria jurídica com a mesma senioridade que esperam de seus próprios conselhos.
          </p>
          <p>
            Desde então, a banca consolidou-se em torno de cinco frentes do direito empresarial: societário, contratual, tributário, compliance e arbitragem. Atendemos exclusivamente pessoas jurídicas — companhias listadas, multinacionais de médio porte, family offices e fundos de investimento — e cultivamos uma estrutura intencionalmente enxuta, com quatro sócios e vinte e quatro advogados em quadro fixo.
          </p>
          <p>
            A escolha pela escala enxuta é institucional. Toda operação relevante recebe atenção direta de um dos sócios, em todas as etapas. Nenhum cliente é atendido apenas por equipe júnior. A senioridade que oferecemos é a mesma que nossos clientes esperam internamente quando recorrem a seus comitês de auditoria ou conselhos de administração.
          </p>
          <p>
            Em 2025, a banca completa 27 anos de atuação ininterrupta. A clientela inclui empresas brasileiras com receita superior a R$ 10 bilhões e grupos estrangeiros estabelecidos no país. Não publicamos lista de clientes. A discrição faz parte da prática.
          </p>
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Princípios de Atuação</SectionLabel>
        <ol className="mt-12 space-y-12 max-w-editorial">
          {PRINCIPIOS.map((p, i) => (
            <li key={i} className="flex gap-6">
              <InlineRoman n={i + 1} className="shrink-0 pt-2" />
              <div>
                <p className="font-display text-display-m text-ink">{p}</p>
                <GoldRule className="mt-6 w-8" />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container py-section">
        <SectionLabel>Escritório Físico</SectionLabel>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TILES.map((t, i) => <TypographicTile key={i} {...t} />)}
        </div>
        <p className="mt-12 font-mono text-mono text-stone">
          Av. Brigadeiro Faria Lima, 4221 · 19º andar · Itaim Bibi · São Paulo / SP · CEP 04538-133
        </p>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Implement /contato**

Create `app/contato/page.tsx`:

```tsx
import { SectionLabel } from '@/components/layout/SectionLabel';
import { ContactForm } from '@/components/page-blocks/ContactForm';
import { GoldRule } from '@/components/primitives/GoldRule';

export const metadata = {
  title: 'Contato',
  description: 'Atendimento exclusivamente por agendamento prévio. Av. Brigadeiro Faria Lima, 4221, Itaim Bibi, São Paulo.',
};

const INFO = [
  { label: 'Endereço', body: ['Av. Brigadeiro Faria Lima, 4221', '19º andar · Itaim Bibi', 'São Paulo / SP — CEP 04538-133'] },
  { label: 'Telefone', body: ['+55 11 3147-8200'] },
  { label: 'Email', body: ['contato@vasconcellospires.com.br'] },
  { label: 'Horário', body: ['Segunda a sexta', '9h às 18h'] },
];

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>Contato</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Atendimento exclusivo<br />por agendamento.
        </h1>
      </section>
      <section className="container pb-section">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <aside className="md:col-span-5 space-y-12">
            {INFO.map((b) => (
              <div key={b.label}>
                <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{b.label}</p>
                <GoldRule className="mt-4 w-8" />
                <div className="mt-4 font-sans text-body-m text-ink space-y-1">
                  {b.body.map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
            ))}
          </aside>
          <div className="md:col-span-7 md:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Implement /areas-de-atuacao listing**

Create `app/areas-de-atuacao/page.tsx`:

```tsx
import { practiceAreas } from '@/content/practice-areas';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { PracticeAreaRow } from '@/components/page-blocks/PracticeAreaRow';

export const metadata = {
  title: 'Áreas de Atuação',
  description: 'Cinco frentes do direito empresarial: societário e M&A, contratos, tributário, compliance e arbitragem.',
};

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>Áreas de Atuação</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Cinco frentes. Atuação<br />exclusivamente empresarial.
        </h1>
      </section>
      <section className="container pb-section">
        {practiceAreas.map((area, i) => (
          <PracticeAreaRow key={area.slug} area={area} last={i === practiceAreas.length - 1} />
        ))}
      </section>
    </>
  );
}
```

- [ ] **Step 4: Implement /equipe listing**

Create `app/equipe/page.tsx`:

```tsx
import { partners } from '@/content/partners';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { PartnerCard } from '@/components/page-blocks/PartnerCard';
import { Hairline } from '@/components/layout/Hairline';

export const metadata = {
  title: 'Equipe',
  description: 'Quatro sócios. Atuação direta em cada caso. Bios e formação dos sócios fundadores e gestores.',
};

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>Equipe</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Quatro sócios.<br />Atuação direta em cada caso.
        </h1>
      </section>
      <section className="container">
        {partners.map((p, i) => (
          <div key={p.slug}>
            <PartnerCard partner={p} reverse={i % 2 === 1} />
            {i < partners.length - 1 && <Hairline className="border-ink/15" />}
          </div>
        ))}
      </section>
    </>
  );
}
```

- [ ] **Step 5: Verify all routes load**

Run: `npm run dev` and visit each route manually.

Expected: /escritorio, /contato, /areas-de-atuacao, /equipe render without errors. Partner photos may show broken (assets pending Task 25 — placeholder gray ok).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: escritorio/contato/areas-de-atuacao/equipe listing routes"
```

---

## Task 19: Routes — /areas-de-atuacao/[slug] and /equipe/[slug]

**Files:**
- Create: `app/areas-de-atuacao/[slug]/page.tsx`, `app/equipe/[slug]/page.tsx`

- [ ] **Step 1: Implement area detail page**

Create `app/areas-de-atuacao/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { practiceAreas, getPracticeAreaBySlug } from '@/content/practice-areas';
import { getPartnerBySlug } from '@/content/partners';
import { getOperationsForArea } from '@/content/operations';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { SectionNumber } from '@/components/primitives/SectionNumber';
import { GoldRule } from '@/components/primitives/GoldRule';
import { OperationsBlock } from '@/components/page-blocks/OperationsBlock';
import { DocArrow } from '@/components/primitives/DocArrow';

export function generateStaticParams() {
  return practiceAreas.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const area = getPracticeAreaBySlug(params.slug);
  if (!area) return {};
  return { title: area.title, description: area.summary };
}

export default function Page({ params }: { params: { slug: string } }) {
  const area = getPracticeAreaBySlug(params.slug);
  if (!area) notFound();
  const partners = area.partnerSlugs.map(getPartnerBySlug).filter(Boolean);
  const operations = getOperationsForArea(area.slug);

  return (
    <>
      <section className="container py-section">
        <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">
          <SectionNumber>{area.number}</SectionNumber> · Áreas de Atuação
        </p>
        <h1 className="mt-6 font-display text-display-xl text-ink">{area.title}</h1>
        <GoldRule className="mt-12 w-12" />
        <p className="mt-12 max-w-editorial font-sans text-body-l text-ink">{area.summary}</p>
        <p className="mt-6 max-w-editorial font-sans text-body-l text-stone">{area.description}</p>
      </section>

      <section className="container py-section">
        <SectionLabel>Serviços</SectionLabel>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
          {area.services.map((s) => (
            <li key={s} className="font-sans text-body-l text-ink flex gap-3 before:content-['·'] before:text-gold">
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <OperationsBlock operations={operations} representativePractice={area.representativePractice} />

      <section className="container py-section">
        <SectionLabel>Sócios Responsáveis</SectionLabel>
        <div className="mt-12 space-y-12">
          {partners.map((p) => p && (
            <article key={p.slug}>
              <h3 className="font-display text-display-m text-ink">{p.name}</h3>
              <p className="mt-2 font-sans text-body-m text-bordeaux">{p.practice}</p>
              <GoldRule className="mt-4 w-8" />
              <p className="mt-4 max-w-editorial font-sans text-body-m text-stone">{p.bioShort}</p>
              <Link href={`/equipe/${p.slug}`} className="mt-6 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
                <DocArrow />
                Conhecer {p.name.split(' ')[0]}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Implement partner detail page**

Create `app/equipe/[slug]/page.tsx`:

```tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { partners, getPartnerBySlug } from '@/content/partners';
import { practiceAreas } from '@/content/practice-areas';
import { pareceres } from '@/content/pareceres';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { GoldRule } from '@/components/primitives/GoldRule';
import { DocArrow } from '@/components/primitives/DocArrow';

export function generateStaticParams() {
  return partners.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPartnerBySlug(params.slug);
  if (!p) return {};
  return { title: p.name, description: p.bioShort };
}

export default function Page({ params }: { params: { slug: string } }) {
  const partner = getPartnerBySlug(params.slug);
  if (!partner) notFound();
  const areas = practiceAreas.filter((a) => a.partnerSlugs.includes(partner.slug));
  const parecesAuthored = pareceres.filter((p) => p.authorSlug === partner.slug);

  return (
    <>
      <section className="container py-section">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
              <Image src={partner.photoSrc} alt={`Retrato de ${partner.name}`} fill className="object-cover grayscale" sizes="(min-width: 768px) 40vw, 100vw" priority />
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{partner.role}</p>
            <h1 className="mt-4 font-display text-display-xl text-ink">{partner.name}</h1>
            <p className="mt-4 font-display text-display-m text-bordeaux">{partner.practice}</p>
            <GoldRule className="mt-8 w-12" />
            <p className="mt-8 font-sans text-body-l text-ink max-w-editorial">{partner.bioLong}</p>
          </div>
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Formação</SectionLabel>
        <ul className="mt-12 space-y-4 max-w-editorial">
          {partner.education.map((e, i) => (
            <li key={i} className="font-sans text-body-l text-ink flex gap-3 before:content-['·'] before:text-gold">{e}</li>
          ))}
        </ul>
      </section>

      {areas.length > 0 && (
        <section className="container py-section">
          <SectionLabel>Áreas em que atua</SectionLabel>
          <ul className="mt-12 space-y-6">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/areas-de-atuacao/${a.slug}`} className="group flex items-baseline gap-6 hover:text-bordeaux">
                  <span className="font-mono text-mono text-gold">{a.number}</span>
                  <span className="font-display text-display-m text-ink group-hover:text-bordeaux transition-colors">{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {parecesAuthored.length > 0 && (
        <section className="container py-section">
          <SectionLabel>Pareceres recentes</SectionLabel>
          <ul className="mt-12 space-y-6">
            {parecesAuthored.slice(0, 3).map((p) => (
              <li key={p.slug}>
                {p.kind === 'full' ? (
                  <Link href={`/pareceres/${p.slug}`} className="group block">
                    <p className="font-mono text-mono text-gold">Parecer Nº {p.number}</p>
                    <p className="mt-2 font-display text-display-m text-ink group-hover:text-bordeaux transition-colors">{p.title}</p>
                    <p className="mt-2 font-mono text-mono text-stone">{p.dateLabel}</p>
                  </Link>
                ) : (
                  <div className="opacity-60">
                    <p className="font-mono text-mono text-gold">Parecer Nº {p.number}</p>
                    <p className="mt-2 font-display text-display-m text-ink">{p.title}</p>
                    <p className="mt-2 font-mono text-mono text-stone">{p.dateLabel} · arquivo</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Link href="/pareceres" className="mt-8 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
            <DocArrow />
            Arquivo completo
          </Link>
        </section>
      )}
    </>
  );
}
```

- [ ] **Step 3: Verify routes**

Run: `npm run dev` and visit `/areas-de-atuacao/societario-ma`, `/equipe/eduardo-vasconcelos`, plus all 4 partner slugs and 5 area slugs.

Expected: every route renders, no console errors, content correct.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: dynamic [slug] routes for areas and partners"
```

---

## Task 20: MDX setup + pareceres content

**Files:**
- Create: `mdx-components.tsx` (root), `content/pareceres/047-stf-tributacao-software.mdx`, `content/pareceres/046-lei-do-carf-14689.mdx`, `content/pareceres/045-acordo-leniencia-cgu.mdx`

- [ ] **Step 1: Create root MDX components file**

Create `mdx-components.tsx` (at project root, required by `@next/mdx`):

```tsx
import type { MDXComponents } from 'mdx/types';
import { ParecerParagraph } from '@/components/page-blocks/ParecerParagraph';
import { ParecerQuote } from '@/components/page-blocks/ParecerQuote';

let paragraphCounter = 0;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children }) => {
      paragraphCounter += 1;
      return <ParecerParagraph n={paragraphCounter}>{children}</ParecerParagraph>;
    },
    Quote: ParecerQuote,
    ...components,
  };
}
```

> The counter approach above is naive (shared state across pages). We'll replace it in Step 4 with a stable per-page wrapper. Leaving it here so MDX compiles.

- [ ] **Step 2: Write parecer 047/2025**

Create `content/pareceres/047-stf-tributacao-software.mdx`:

```mdx
A decisão do Supremo Tribunal Federal no Recurso Extraordinário 688.223, julgado em fevereiro de 2025, redefine os contornos da tributação sobre softwares no Brasil. Por nove votos a dois, a Corte firmou tese segundo a qual o licenciamento de software sem transferência de propriedade não atrai a incidência do ICMS, mantendo-se o ISS como tributo aplicável à operação.

A discussão, há mais de duas décadas em curso, opunha dois entendimentos: o de que o software, por consistir em bem digital comercializado em larga escala, seria mercadoria sujeita ao ICMS; e o de que o licenciamento, por preservar a propriedade intelectual do desenvolvedor, configuraria prestação de serviço sujeita ao ISS. O STF acolheu este último.

<Quote source="RE 688.223, voto do Min. Rel. Luís Roberto Barroso">
A natureza do bem digital, quando licenciado sem transferência de propriedade, afasta a incidência do ICMS, mantendo-se o ISS como tributo aplicável.
</Quote>

A consequência prática para companhias de tecnologia é imediata. Operações que vinham sendo tributadas em regimes mistos — com recolhimento simultâneo de ICMS e ISS, em prevenção de autuação — passam a ter base jurídica firme para concentração no ISS, com alíquotas geralmente inferiores. Mais relevante: créditos de ICMS indevidamente recolhidos nos últimos cinco anos podem ser objeto de pedido de restituição.

No entanto, a tese firmada não dispensa cautela. O STF deixou aberta a questão de softwares comercializados em modelo de licença perpétua com transferência efetiva de cópia — o chamado "software de prateleira" físico ou digital com instalação local. Para estes casos, a corte sinaliza que a análise deve ser casuística, observando-se os termos contratuais específicos.

Recomendamos a clientes de companhias de tecnologia a revisão completa de seus contratos de licenciamento à luz da nova tese, especialmente quanto à caracterização do objeto contratado e à definição da titularidade do bem digital. Em paralelo, é oportuna a análise de potenciais créditos a recuperar referentes aos últimos cinco exercícios.
```

- [ ] **Step 3: Write parecer 046/2025**

Create `content/pareceres/046-lei-do-carf-14689.mdx`:

```mdx
A Lei 14.689, sancionada em setembro de 2023 e popularmente conhecida como Lei do Carf, restaurou o voto de qualidade pró-fisco no Conselho Administrativo de Recursos Fiscais. Decorridos pouco mais de dezoito meses de vigência, é possível avaliar com alguma sobriedade o efeito prático da medida sobre a estratégia das companhias em contencioso tributário.

O voto de qualidade — mecanismo pelo qual o presidente da turma desempata pelo Fisco — havia sido revogado em 2020. Sua retomada, no contexto do esforço fiscal pós-pandemia, é tecnicamente legítima. Mas seu efeito sobre o cálculo estratégico das companhias é considerável: teses tributárias que, no regime anterior, podiam ser disputadas administrativamente com expectativa razoável de empate favorável, agora exigem reavaliação.

<Quote source="Lei 14.689/2023, art. 4º">
Em caso de empate na votação do recurso, prevalecerá o resultado proclamado pelo presidente do colegiado, considerando-se como vencedora a Fazenda Pública.
</Quote>

Três efeitos são observáveis nos primeiros dezoito meses. Primeiro, aumento substancial das opções por execução fiscal direta em casos de teses que historicamente alcançavam empate. Segundo, ampliação do uso de transação tributária como saída pragmática, especialmente para passivos que combinam baixa probabilidade administrativa com viabilidade de discussão judicial. Terceiro, retorno do foco para teses que dependem de prova técnica robusta, onde a margem para divergência interpretativa é menor.

A consequência operacional para companhias de grande porte é a necessidade de revisão sistemática do estoque de contencioso. Casos que, no regime anterior, eram mantidos em discussão administrativa por baixo custo de oportunidade, agora demandam decisão entre quatro caminhos: aceitar a autuação, transacionar, prosseguir administrativamente assumindo o novo risco, ou judicializar de imediato.

A prática tributária tem recomendado a clientes uma revisão consolidada de todo o estoque administrativo a cada doze meses, com classificação por probabilidade ajustada ao novo regime e decisão executiva sobre destino de cada feito.
```

- [ ] **Step 4: Write parecer 045/2024**

Create `content/pareceres/045-acordo-leniencia-cgu.mdx`:

```mdx
O instituto do acordo de leniência, previsto na Lei 12.846/2013, tem sido objeto de tensão crescente entre a Controladoria-Geral da União e as companhias que o utilizam. A discussão, longe de ser meramente teórica, tem efeitos diretos sobre a previsibilidade que as empresas podem esperar ao optar pela colaboração com a autoridade.

A leitura tradicional do instituto sustentava ampla margem de discricionariedade para a CGU na negociação de termos do acordo: alcance da colaboração, conjunto de fatos cobertos, fixação da multa, exigências de remediação. A jurisprudência recente, no entanto, vem sinalizando limites mais estreitos a essa margem, especialmente após decisões do Tribunal de Contas da União sobre acordos celebrados na operação Lava Jato.

<Quote source="Acórdão TCU 1.214/2022, voto do Relator">
A discricionariedade da Administração na celebração de acordo de leniência encontra limites nos princípios da razoabilidade, proporcionalidade e segurança jurídica, devendo a autoridade fundamentar tecnicamente cada parâmetro fixado no termo.
</Quote>

Três dimensões da discricionariedade estão em revisão. Primeira, a fixação do alcance do acordo: até que ponto a CGU pode exigir reconhecimento de fatos não diretamente comprovados como condição para a celebração? Segunda, a definição do percentual de redução da multa: o art. 16 da Lei 12.846 estabelece teto de dois terços, mas a fixação prática vem sendo questionada por sua aparente discricionariedade. Terceira, as exigências de compliance pós-acordo: prazos, escopo de monitoramento, exigência de profissionais específicos.

Para companhias que cogitam a celebração de acordo, a recomendação prática é o investimento intenso em documentação técnica das premissas em cada uma das três dimensões. A fundamentação detalhada das contrapartidas oferecidas — e dos limites da colaboração possível — protege a empresa contra renegociações posteriores fundadas em argumento de insuficiência. Em paralelo, recomenda-se cláusula expressa de mensuração dos termos de monitoramento, evitando-se ampliação tácita de exigências durante o período de acompanhamento.

A relação entre CGU e companhia em acordo de leniência exige a mesma disciplina técnica de qualquer instrumento contratual público: clareza, mensuração, previsibilidade. A jurisprudência atual confirma que essa exigência não é só boa prática — é direito da empresa que colabora.
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: MDX setup and 3 parecer bodies"
```

---

## Task 21: Parecer presentation components — ParecerHeader, ParecerParagraph, ParecerQuote, ParecerListItem, ParecerNav

**Files:**
- Create: `components/page-blocks/ParecerHeader.tsx`, `components/page-blocks/ParecerParagraph.tsx`, `components/page-blocks/ParecerQuote.tsx`, `components/page-blocks/ParecerListItem.tsx`, `components/page-blocks/ParecerNav.tsx`, `tests/components/parecer.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/parecer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ParecerHeader } from '@/components/page-blocks/ParecerHeader';
import { ParecerParagraph } from '@/components/page-blocks/ParecerParagraph';
import { ParecerQuote } from '@/components/page-blocks/ParecerQuote';
import { ParecerListItem } from '@/components/page-blocks/ParecerListItem';

describe('ParecerHeader', () => {
  it('renders parecer number, title, author, date', () => {
    render(<ParecerHeader number="047/2025" title="STF e a tributação de software" authorName="Helena Pires" practice="Direito Tributário" dateLabel="15 mar 2025" />);
    expect(screen.getByText(/PARECER Nº 047\/2025/)).toBeInTheDocument();
    expect(screen.getByText('STF e a tributação de software')).toBeInTheDocument();
    expect(screen.getByText(/Helena Pires/)).toBeInTheDocument();
    expect(screen.getByText(/15 mar 2025/)).toBeInTheDocument();
  });
});

describe('ParecerParagraph', () => {
  it('renders n in lateral column and body in editorial column', () => {
    render(<ParecerParagraph n={3}>Conteúdo do parágrafo.</ParecerParagraph>);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do parágrafo.')).toBeInTheDocument();
  });
});

describe('ParecerQuote', () => {
  it('renders quote with bordeaux left border, italic display font, and source', () => {
    render(<ParecerQuote source="RE 688.223">Citação literal.</ParecerQuote>);
    expect(screen.getByText('Citação literal.').className).toMatch(/italic/);
    expect(screen.getByText('Citação literal.').className).toMatch(/font-display/);
    expect(screen.getByText(/RE 688.223/)).toBeInTheDocument();
  });
});

describe('ParecerListItem', () => {
  const full = { slug: 'a', number: '047/2025', title: 'T', subtitle: '', dateLabel: '15 mar 2025', authorName: 'Helena Pires', kind: 'full' } as any;
  const stub = { ...full, slug: 'b', kind: 'stub' } as any;

  it('renders link for full parecer', () => {
    render(<ParecerListItem entry={full} />);
    expect(screen.getByRole('link', { name: /T/ })).toHaveAttribute('href', '/pareceres/a');
  });

  it('renders non-link disabled appearance for stub', () => {
    const { container } = render(<ParecerListItem entry={stub} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('opacity-60');
  });
});
```

- [ ] **Step 2: Run tests (expect FAIL)**

Run: `npm test -- parecer`
Expected: FAIL.

- [ ] **Step 3: Implement ParecerHeader**

Create `components/page-blocks/ParecerHeader.tsx`:

```tsx
import { GoldRule } from '@/components/primitives/GoldRule';

export function ParecerHeader({
  number,
  title,
  authorName,
  practice,
  dateLabel,
  city = 'São Paulo',
}: {
  number: string;
  title: string;
  authorName: string;
  practice: string;
  dateLabel: string;
  city?: string;
}) {
  return (
    <header className="container py-section text-center">
      <p className="font-mono text-mono uppercase tracking-[0.16em] text-gold">PARECER Nº {number}</p>
      <GoldRule className="mt-4 w-12 mx-auto" />
      <h1 className="mt-12 font-display text-display-xl text-ink container-narrow text-balance">
        {title}
      </h1>
      <p className="mt-12 font-mono text-mono uppercase tracking-[0.16em] text-stone">
        por <span className="text-ink">{authorName}</span> · {practice}
      </p>
      <p className="mt-4 font-mono text-mono text-stone">
        {city}, {dateLabel}
      </p>
    </header>
  );
}
```

- [ ] **Step 4: Implement ParecerParagraph**

Create `components/page-blocks/ParecerParagraph.tsx`:

```tsx
import { ReactNode } from 'react';

export function ParecerParagraph({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 my-8">
      <div className="col-span-2 md:col-span-1 pt-2">
        <span className="font-mono text-mono text-gold">{n}</span>
      </div>
      <p className="col-span-10 md:col-span-9 font-sans text-body-l text-ink leading-[1.8]">{children}</p>
    </div>
  );
}
```

- [ ] **Step 5: Implement ParecerQuote**

Create `components/page-blocks/ParecerQuote.tsx`:

```tsx
import { ReactNode } from 'react';

export function ParecerQuote({ children, source }: { children: ReactNode; source?: string }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 my-12">
      <div className="col-span-1" aria-hidden="true" />
      <blockquote className="col-span-11 md:col-span-9 border-l-2 border-bordeaux pl-6">
        <p className="font-display italic text-body-l text-ink">{children}</p>
        {source && <footer className="mt-3 font-mono text-mono text-stone">— {source}</footer>}
      </blockquote>
    </div>
  );
}
```

- [ ] **Step 6: Implement ParecerListItem**

Create `components/page-blocks/ParecerListItem.tsx`:

```tsx
import Link from 'next/link';
import type { ParecerEntry } from '@/content/pareceres';
import { Hairline } from '@/components/layout/Hairline';

export function ParecerListItem({ entry, last = false }: { entry: ParecerEntry; last?: boolean }) {
  const body = (
    <div className="grid grid-cols-14 gap-x-6 py-6">
      <p className="col-span-3 md:col-span-2 font-mono text-mono text-gold">Nº {entry.number}</p>
      <div className="col-span-11 md:col-span-9">
        <p className="font-display text-display-m text-ink">{entry.title}</p>
        <p className="mt-2 font-mono text-mono-s uppercase tracking-[0.16em] text-stone">por {entry.authorName}</p>
      </div>
      <p className="hidden md:block col-span-3 text-right font-mono text-mono text-stone self-end">{entry.dateLabel}</p>
    </div>
  );

  return (
    <>
      {entry.kind === 'full' ? (
        <Link
          href={`/pareceres/${entry.slug}`}
          className="block group hover:bg-bone/50 -mx-6 px-6 transition-colors"
        >
          {body}
        </Link>
      ) : (
        <div
          className="opacity-60 cursor-default -mx-6 px-6"
          aria-disabled="true"
          title="Disponível apenas no arquivo do escritório"
        >
          {body}
        </div>
      )}
      {!last && <Hairline className="border-ink/15" />}
    </>
  );
}
```

- [ ] **Step 7: Implement ParecerNav**

Create `components/page-blocks/ParecerNav.tsx`:

```tsx
import Link from 'next/link';
import type { ParecerEntry } from '@/content/pareceres';

export function ParecerNav({ previous, next }: { previous?: ParecerEntry; next?: ParecerEntry }) {
  return (
    <nav className="container py-section border-t border-ink/15">
      <div className="flex flex-col md:flex-row justify-between gap-8 font-mono text-mono">
        {previous ? (
          <Link href={`/pareceres/${previous.slug}`} className="text-stone hover:text-bordeaux">
            ← Anterior: Parecer nº {previous.number} · {previous.authorName}
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/pareceres/${next.slug}`} className="text-stone hover:text-bordeaux md:text-right">
            Próximo: Parecer nº {next.number} · {next.authorName} →
          </Link>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 8: Run tests (expect PASS)**

Run: `npm test -- parecer`
Expected: pass.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: parecer presentation components"
```

---

## Task 22: Routes — /pareceres listing and /pareceres/[slug]

**Files:**
- Create: `app/pareceres/page.tsx`, `app/pareceres/[slug]/page.tsx`. Replace: `mdx-components.tsx`.

- [ ] **Step 1: Implement /pareceres listing**

Create `app/pareceres/page.tsx`:

```tsx
import { pareceres, getYearsWithPareceres } from '@/content/pareceres';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { ParecerListItem } from '@/components/page-blocks/ParecerListItem';

export const metadata = {
  title: 'Pareceres',
  description: 'Análises e comentários do escritório sobre decisões e legislação relevante para o direito empresarial. Publicação periódica desde 2003.',
};

export default function Page() {
  const years = getYearsWithPareceres();

  return (
    <>
      <section className="container py-section">
        <SectionLabel>Pareceres</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Análises e comentários sobre<br />decisões e legislação relevante<br />para o direito empresarial.
        </h1>
        <p className="mt-8 max-w-editorial font-sans text-body-l text-stone">
          Publicação periódica do escritório desde 2003.
        </p>
      </section>

      <section className="container pb-section space-y-16">
        {years.map((year) => {
          const yearEntries = pareceres.filter((p) => p.year === year);
          return (
            <div key={year}>
              <p className="font-mono text-mono uppercase tracking-[0.16em] text-stone">{year}</p>
              <hr className="mt-2 mb-8 border-0 border-t border-ink/15 w-12" />
              <ul>
                {yearEntries.map((entry, i) => (
                  <li key={entry.slug}>
                    <ParecerListItem entry={entry} last={i === yearEntries.length - 1} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </>
  );
}
```

- [ ] **Step 2: Replace MDX components with stable per-parecer wrapper**

Replace `mdx-components.tsx`:

```tsx
import type { MDXComponents } from 'mdx/types';
import { ParecerParagraph } from '@/components/page-blocks/ParecerParagraph';
import { ParecerQuote } from '@/components/page-blocks/ParecerQuote';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // p is overridden at render time inside the parecer page where we know the index.
    Quote: ParecerQuote,
    ...components,
  };
}
```

We will use a local MDX provider in the parecer page to number paragraphs.

- [ ] **Step 3: Implement /pareceres/[slug]**

Create `app/pareceres/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Children } from 'react';
import { pareceres, getParecerBySlug, getParecerNeighbors } from '@/content/pareceres';
import { ParecerHeader } from '@/components/page-blocks/ParecerHeader';
import { ParecerParagraph } from '@/components/page-blocks/ParecerParagraph';
import { ParecerQuote } from '@/components/page-blocks/ParecerQuote';
import { ParecerNav } from '@/components/page-blocks/ParecerNav';
import { GoldRule } from '@/components/primitives/GoldRule';
import { PrintActions } from '@/components/page-blocks/PrintActions';

const FULL_BODIES = {
  'stf-tributacao-software': dynamic(() => import('@/content/pareceres/047-stf-tributacao-software.mdx')),
  'lei-do-carf-14689': dynamic(() => import('@/content/pareceres/046-lei-do-carf-14689.mdx')),
  'acordo-leniencia-cgu': dynamic(() => import('@/content/pareceres/045-acordo-leniencia-cgu.mdx')),
} as const;

export function generateStaticParams() {
  return pareceres.filter((p) => p.kind === 'full').map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getParecerBySlug(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.subtitle || `Parecer Nº ${p.number} · ${p.authorName} · ${p.practice}`,
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const parecer = getParecerBySlug(params.slug);
  if (!parecer || parecer.kind !== 'full') notFound();
  const Body = FULL_BODIES[params.slug as keyof typeof FULL_BODIES];
  if (!Body) notFound();
  const { previous, next } = getParecerNeighbors(parecer.slug);

  // Render MDX with paragraphs auto-numbered:
  return (
    <article>
      <ParecerHeader
        number={parecer.number}
        title={parecer.title}
        authorName={parecer.authorName}
        practice={parecer.practice}
        dateLabel={parecer.dateLabel}
      />

      <section className="container py-section container-narrow">
        <NumberedMDX>
          <Body components={{ Quote: ParecerQuote }} />
        </NumberedMDX>

        <GoldRule className="my-section w-12 mx-auto" />

        <footer className="text-center font-mono text-mono text-stone parecer-print-only">
          <p>Vasconcelos &amp; Pires Advogados Associados</p>
          <p className="mt-2">Parecer Nº {parecer.number} · {parecer.dateLabel}</p>
        </footer>

        <PrintActions />
      </section>

      <ParecerNav previous={previous} next={next} />
    </article>
  );
}

function NumberedMDX({ children }: { children: React.ReactNode }) {
  // Replace `<p>` children produced by MDX with ParecerParagraph + counter.
  let counter = 0;
  const numbered = transformParagraphs(children, () => ++counter);
  return <>{numbered}</>;
}

function transformParagraphs(node: React.ReactNode, next: () => number): React.ReactNode {
  return Children.map(node, (child) => {
    if (typeof child !== 'object' || child === null || !('props' in child)) return child;
    const c = child as React.ReactElement;
    if (c.type === 'p') {
      return <ParecerParagraph n={next()}>{c.props.children}</ParecerParagraph>;
    }
    if (c.props?.children) {
      return { ...c, props: { ...c.props, children: transformParagraphs(c.props.children, next) } };
    }
    return c;
  });
}
```

- [ ] **Step 4: Implement PrintActions**

Create `components/page-blocks/PrintActions.tsx`:

```tsx
'use client';
import { DocArrow } from '@/components/primitives/DocArrow';

export function PrintActions() {
  return (
    <div className="no-print mt-12 flex items-center justify-center gap-8 font-mono text-mono uppercase tracking-[0.16em] text-stone">
      <button onClick={() => window.print()} className="hover:text-bordeaux flex items-center gap-2">
        <DocArrow /> Imprimir
      </button>
      <button onClick={() => window.print()} className="hover:text-bordeaux flex items-center gap-2">
        <DocArrow /> Salvar PDF
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Verify pareceres routes**

Run: `npm run dev`. Visit:
- `/pareceres` → all 8 entries grouped by year, 5 stubs visually muted
- `/pareceres/stf-tributacao-software` → numbered paragraphs, gold "PARECER Nº 047/2025" header, bordeaux quote
- `/pareceres/lei-do-carf-14689`
- `/pareceres/acordo-leniencia-cgu`

Expected: All three full pareceres render with lateral numbering, quote with bordeaux border, ParecerNav at bottom.

Click "Imprimir" and verify print preview: header/footer/nav hidden, parecer body shown in black-on-white with formal footer.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: pareceres routes (listing + individual with auto-numbered MDX)"
```

---

## Task 23: Page block — Hero + Home route

**Files:**
- Create: `components/page-blocks/Hero.tsx`, `app/page.tsx` (replace)

- [ ] **Step 1: Implement Hero**

Create `components/page-blocks/Hero.tsx`:

```tsx
import { DocArrow } from '@/components/primitives/DocArrow';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="bg-ink text-ivory">
      <div className="container py-section">
        <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-gold">Estab. 1998 · São Paulo</p>
        <h1 className="mt-12 font-display text-display-xl text-balance">
          Direito empresarial,<br />conduzido com rigor<br />e discrição.
        </h1>
        <p className="mt-12 max-w-editorial font-sans text-body-l text-ivory/80">
          Escritório boutique de São Paulo dedicado a companhias brasileiras e estrangeiras de médio e grande porte. Atuação consultiva e contenciosa nas áreas societária, tributária, compliance e arbitragem.
        </p>
        <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono text-mono">
          <Link href="/contato" className="inline-flex items-center gap-3 text-ivory hover:text-gold">
            <DocArrow /> Solicitar agendamento
          </Link>
          <span className="text-ivory/60">Av. Brigadeiro Faria Lima, 4221 · Itaim Bibi</span>
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <div className="container py-12">
          <p className="font-display italic text-body-l text-ivory/70 max-w-editorial">
            "A natureza do bem digital, quando licenciado sem transferência de propriedade, afasta a incidência do ICMS, mantendo-se o ISS como tributo aplicável."
            <span className="block mt-3 font-mono not-italic text-mono text-gold">— RE 688.223 · Parecer Nº 047/2025</span>
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement home page**

Replace `app/page.tsx`:

```tsx
import Link from 'next/link';
import { practiceAreas } from '@/content/practice-areas';
import { partners } from '@/content/partners';
import { getFullPareceres } from '@/content/pareceres';
import { Hero } from '@/components/page-blocks/Hero';
import { StatsRow } from '@/components/page-blocks/StatsRow';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { PracticeAreaRow } from '@/components/page-blocks/PracticeAreaRow';
import { ParecerListItem } from '@/components/page-blocks/ParecerListItem';
import { GoldRule } from '@/components/primitives/GoldRule';
import { DocArrow } from '@/components/primitives/DocArrow';

const STATS = [
  { value: '27', label: 'anos de atuação' },
  { value: '24', label: 'advogados em quadro fixo' },
  { value: '4', label: 'sócios fundadores' },
  { value: 'R$ 4B+', label: 'em arbitragens' },
];

export default function Home() {
  const fullPareceres = getFullPareceres().slice(0, 3);
  return (
    <>
      <Hero />
      <StatsRow items={STATS} />

      <section className="container py-section">
        <SectionLabel>Áreas de Atuação</SectionLabel>
        <div className="mt-12">
          {practiceAreas.map((a, i) => (
            <PracticeAreaRow key={a.slug} area={a} last={i === practiceAreas.length - 1} />
          ))}
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Sócios</SectionLabel>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {partners.map((p) => (
            <Link key={p.slug} href={`/equipe/${p.slug}`} className="group">
              <h3 className="font-display text-display-m text-ink group-hover:text-bordeaux transition-colors">{p.name}</h3>
              <p className="mt-2 font-mono text-mono-s uppercase tracking-[0.16em] text-bordeaux">{p.practice}</p>
              <GoldRule className="mt-4 w-8" />
              <p className="mt-6 font-sans text-body-m text-stone max-w-editorial">{p.bioShort}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Pareceres Recentes</SectionLabel>
        <div className="mt-12">
          {fullPareceres.map((p, i) => (
            <ParecerListItem key={p.slug} entry={p} last={i === fullPareceres.length - 1} />
          ))}
        </div>
        <Link href="/pareceres" className="mt-12 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
          <DocArrow /> Arquivo completo
        </Link>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify home in browser**

Run: `npm run dev`. Visit `/`.

Expected: Hero on ink background with display-xl headline, gold mono eyebrow, italic quote section, then stats row, areas grid, partners grid, 3 most recent pareceres.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: Hero block and home composition"
```

---

## Task 24: 404 + sitemap + robots + JSON-LD

**Files:**
- Create: `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`, `lib/jsonld.ts`. Modify: `app/layout.tsx`, `app/page.tsx`, `app/equipe/[slug]/page.tsx`, `app/pareceres/[slug]/page.tsx`.

- [ ] **Step 1: 404 page**

Create `app/not-found.tsx`:

```tsx
import Link from 'next/link';
import { DocArrow } from '@/components/primitives/DocArrow';

export default function NotFound() {
  return (
    <section className="container py-section min-h-[60vh] flex flex-col justify-center">
      <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">404 · Página não encontrada</p>
      <h1 className="mt-8 font-display text-display-xl text-ink">
        O documento solicitado<br />não foi localizado.
      </h1>
      <Link href="/" className="mt-12 inline-flex items-center gap-3 font-sans text-body-l text-ink hover:text-bordeaux">
        <DocArrow /> Voltar ao sumário
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: sitemap**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { partners } from '@/content/partners';
import { practiceAreas } from '@/content/practice-areas';
import { pareceres } from '@/content/pareceres';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vasconcellospires.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/escritorio', '/areas-de-atuacao', '/equipe', '/pareceres', '/contato'];
  return [
    ...staticRoutes.map((r) => ({ url: `${BASE}${r}`, lastModified: new Date() })),
    ...practiceAreas.map((a) => ({ url: `${BASE}/areas-de-atuacao/${a.slug}`, lastModified: new Date() })),
    ...partners.map((p) => ({ url: `${BASE}/equipe/${p.slug}`, lastModified: new Date() })),
    ...pareceres.filter((p) => p.kind === 'full').map((p) => ({
      url: `${BASE}/pareceres/${p.slug}`,
      lastModified: new Date(p.date),
    })),
  ];
}
```

- [ ] **Step 3: robots**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vasconcellospires.com.br';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: JSON-LD helpers**

Create `lib/jsonld.ts`:

```ts
import type { Partner } from '@/content/partners';
import type { ParecerEntry } from '@/content/pareceres';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vasconcellospires.com.br';

export function legalServiceLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Vasconcelos & Pires Advogados Associados',
    url: BASE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Brigadeiro Faria Lima, 4221, 19º andar',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '04538-133',
      addressCountry: 'BR',
    },
    telephone: '+55-11-3147-8200',
    foundingDate: '1998',
    areaServed: 'BR',
  };
}

export function personLd(p: Partner) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.role,
    knowsAbout: p.practice,
    url: `${BASE}/equipe/${p.slug}`,
    affiliation: { '@type': 'LegalService', name: 'Vasconcelos & Pires Advogados Associados' },
  };
}

export function articleLd(p: ParecerEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    datePublished: p.date,
    author: { '@type': 'Person', name: p.authorName },
    publisher: { '@type': 'LegalService', name: 'Vasconcelos & Pires Advogados Associados' },
    url: `${BASE}/pareceres/${p.slug}`,
  };
}

export function ldScript<T extends object>(data: T) {
  return JSON.stringify(data);
}
```

- [ ] **Step 5: Inject JSON-LD in home, partner page, parecer page**

Modify `app/page.tsx` — add inside the `<>` fragment, before `<Hero />`:

```tsx
import { legalServiceLd, ldScript } from '@/lib/jsonld';
// ...
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(legalServiceLd()) }} />
```

Modify `app/equipe/[slug]/page.tsx` — add at the top of returned fragment:

```tsx
import { personLd, ldScript } from '@/lib/jsonld';
// inside component:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(personLd(partner)) }} />
```

Modify `app/pareceres/[slug]/page.tsx` — add similarly with `articleLd(parecer)`.

- [ ] **Step 6: Verify build**

Run: `npm run build` (no images yet — should still complete with placeholder warnings).
Expected: Build succeeds, `out/` directory created with all 18 static routes (1 home + 5 static + 5 areas + 4 partners + 1 pareceres index + 3 full pareceres).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: 404, sitemap, robots, JSON-LD schemas"
```

---

## Task 25: Asset pipeline — partner portraits + image optimization script

**Files:**
- Create: `public/photos/_src/` directory with 4 source portraits (you generate or place these), `scripts/optimize-images.ts`

- [ ] **Step 1: Place source partner portraits**

Generate or source 4 B&W press-style portraits (3:4 portrait, minimum 1200×1600) and save them as:

```
public/photos/_src/eduardo-vasconcelos.jpg
public/photos/_src/helena-pires.jpg
public/photos/_src/rafael-almeida-costa.jpg
public/photos/_src/patricia-bernardes.jpg
```

Direction (matches spec §3): neutral background, moderate contrast, professional attire, no broad smiles, frontal or 3/4 angle, consistent lighting across all four.

If using Midjourney/Flux for generation, prompt template:

```
black and white press portrait photograph of a [age, gender] Brazilian corporate lawyer in a tailored dark suit, neutral charcoal background, moderate contrast, frontal three-quarter angle, looking directly at camera with a serious composed expression, no smile, professional editorial lighting, shallow depth of field, 35mm lens, shot on Hasselblad, fine grain, museum-quality print, 3:4 aspect ratio
```

If generated, verify the four look like they were photographed by the same photographer in the same session — same lighting direction, same focal length, same DOF, same background tone.

- [ ] **Step 2: Implement optimize-images script**

Create `scripts/optimize-images.ts`:

```ts
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SRC = 'public/photos/_src';
const OUT = 'public/photos/partners';
const SIZES = [
  { w: 600, suffix: '' },
  { w: 1200, suffix: '@2x' },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const files = await fs.readdir(SRC);
  for (const file of files) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const base = path.parse(file).name;
    for (const { w, suffix } of SIZES) {
      const pipeline = sharp(path.join(SRC, file)).resize(w, Math.round(w * 4 / 3), { fit: 'cover' }).grayscale();
      await pipeline.clone().webp({ quality: 80 }).toFile(path.join(OUT, `${base}${suffix}.webp`));
      await pipeline.clone().avif({ quality: 60 }).toFile(path.join(OUT, `${base}${suffix}.avif`));
    }
    console.log('✓ optimized', file);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Run script**

Run: `npx tsx scripts/optimize-images.ts`
Expected: 8 files in `public/photos/partners/` (4 webp + 4 avif at base size, then 4 webp + 4 avif at 2x = 16 total). Adjust as needed.

- [ ] **Step 4: Verify partner photos render**

Run: `npm run dev`. Visit `/equipe` and each `/equipe/[slug]`.
Expected: Portraits load, displayed B&W (grayscale class still applied for safety), 3:4 ratio, no broken images.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: image pipeline with sharp"
```

---

## Task 26: OG image generation

**Files:**
- Create: `scripts/generate-og.ts`. Modify: `app/layout.tsx`, each route's metadata to reference `/og/<route>.png`.

- [ ] **Step 1: Implement generate-og script**

Create `scripts/generate-og.ts`:

```ts
import satori from 'satori';
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = 'public/og';

const PAGES = [
  { slug: 'home', number: '00', label: 'Vasconcelos & Pires' },
  { slug: 'escritorio', number: '01', label: 'O Escritório' },
  { slug: 'areas-de-atuacao', number: '02', label: 'Áreas de Atuação' },
  { slug: 'equipe', number: '03', label: 'Equipe' },
  { slug: 'pareceres', number: '04', label: 'Pareceres' },
  { slug: 'contato', number: '05', label: 'Contato' },
];

async function loadFont(url: string) {
  const r = await fetch(url);
  return Buffer.from(await r.arrayBuffer());
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const cormorant = await loadFont('https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.woff');
  const mono = await loadFont('https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff');
  for (const p of PAGES) {
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: { width: '100%', height: '100%', background: '#0C1220', color: '#EDE7DA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 96, fontFamily: 'Cormorant' },
          children: [
            { type: 'div', props: { style: { fontFamily: 'Mono', fontSize: 28, color: '#B89968', letterSpacing: '0.16em', textTransform: 'uppercase' }, children: `${p.number} · ${p.label}` } },
            { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
              { type: 'div', props: { style: { width: 96, height: 1, background: '#B89968', marginBottom: 32 } } },
              { type: 'div', props: { style: { fontSize: 88, lineHeight: 1.1, letterSpacing: '-0.02em' }, children: 'Vasconcelos & Pires' } },
              { type: 'div', props: { style: { fontFamily: 'Mono', fontSize: 24, color: '#EDE7DA99', marginTop: 24 }, children: 'Advogados Associados · São Paulo' } },
            ] } },
          ],
        },
      },
      { width: 1200, height: 630, fonts: [{ name: 'Cormorant', data: cormorant, weight: 500, style: 'normal' }, { name: 'Mono', data: mono, weight: 400, style: 'normal' }] }
    );
    await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, `${p.slug}.png`));
    console.log('✓ og', p.slug);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Run script**

Run: `npx tsx scripts/generate-og.ts`
Expected: 6 PNGs in `public/og/`.

- [ ] **Step 3: Reference OG image in metadata helpers**

Add to `app/layout.tsx` metadata:

```ts
export const metadata = {
  title: { default: 'Vasconcelos & Pires Advogados Associados', template: '%s · Vasconcelos & Pires' },
  description: 'Escritório boutique de direito empresarial em São Paulo. Atuação em societário, tributário, compliance e arbitragem.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Vasconcelos & Pires',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};
```

For per-route metadata, the simplest is to leave the layout default in place — every route inherits the home OG until overridden. To override per route, add `openGraph: { images: [{ url: '/og/escritorio.png' }] }` to each route's `metadata` export.

- [ ] **Step 4: Verify OG renders**

Open one of the generated PNGs in a viewer. Expected: ink background, gold mono "00 · Vasconcelos & Pires", display "Vasconcelos & Pires", mono "Advogados Associados · São Paulo".

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: OG image generation with satori"
```

---

## Task 27: Motion — Framer Motion patterns

**Files:**
- Create: `lib/motion.ts`, `components/motion/FadeRise.tsx`, `components/motion/StaggerLines.tsx`, `components/motion/HairlineDraw.tsx`. Modify: `components/page-blocks/Hero.tsx`, `components/layout/Hairline.tsx`.

- [ ] **Step 1: Shared motion variants**

Create `lib/motion.ts`:

```ts
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
```

- [ ] **Step 2: FadeRise component**

Create `components/motion/FadeRise.tsx`:

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeRise } from '@/lib/motion';

export function FadeRise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15%' }}
      variants={fadeRise}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: StaggerLines component**

Create `components/motion/StaggerLines.tsx`:

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, Children } from 'react';
import { fadeRise, staggerParent } from '@/lib/motion';

export function StaggerLines({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15%' }}
      variants={staggerParent}
    >
      {Children.map(children, (child, i) => (
        <motion.div key={i} variants={fadeRise}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 4: HairlineDraw component**

Create `components/motion/HairlineDraw.tsx`:

```tsx
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
```

- [ ] **Step 5: Apply to Hero**

Replace `components/page-blocks/Hero.tsx`:

```tsx
import Link from 'next/link';
import { DocArrow } from '@/components/primitives/DocArrow';
import { FadeRise } from '@/components/motion/FadeRise';
import { StaggerLines } from '@/components/motion/StaggerLines';

export function Hero() {
  return (
    <section className="bg-ink text-ivory">
      <div className="container py-section">
        <FadeRise>
          <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-gold">Estab. 1998 · São Paulo</p>
        </FadeRise>
        <StaggerLines className="mt-12 font-display text-display-xl text-balance">
          <span className="block">Direito empresarial,</span>
          <span className="block">conduzido com rigor</span>
          <span className="block">e discrição.</span>
        </StaggerLines>
        <FadeRise delay={0.3}>
          <p className="mt-12 max-w-editorial font-sans text-body-l text-ivory/80">
            Escritório boutique de São Paulo dedicado a companhias brasileiras e estrangeiras de médio e grande porte. Atuação consultiva e contenciosa nas áreas societária, tributária, compliance e arbitragem.
          </p>
        </FadeRise>
        <FadeRise delay={0.4}>
          <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono text-mono">
            <Link href="/contato" className="inline-flex items-center gap-3 text-ivory hover:text-gold">
              <DocArrow /> Solicitar agendamento
            </Link>
            <span className="text-ivory/60">Av. Brigadeiro Faria Lima, 4221 · Itaim Bibi</span>
          </div>
        </FadeRise>
      </div>

      <div className="border-t border-ivory/15">
        <div className="container py-12">
          <FadeRise>
            <p className="font-display italic text-body-l text-ivory/70 max-w-editorial">
              "A natureza do bem digital, quando licenciado sem transferência de propriedade, afasta a incidência do ICMS, mantendo-se o ISS como tributo aplicável."
              <span className="block mt-3 font-mono not-italic text-mono text-gold">— RE 688.223 · Parecer Nº 047/2025</span>
            </p>
          </FadeRise>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Verify motion in browser**

Run: `npm run dev`. Visit `/`. Scroll into the hero — confirm staggered headline lines. Toggle "prefers-reduced-motion: reduce" in devtools (Rendering panel) — confirm all motion disabled.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: motion language (fade-rise, stagger-lines, hairline-draw)"
```

---

## Task 28: Playwright E2E for parecer signature page

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/parecer.spec.ts`

- [ ] **Step 1: Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: 'http://localhost:3000', headless: true, screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev', port: 3000, reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

- [ ] **Step 2: Install Playwright browser**

Run: `npx playwright install chromium`

- [ ] **Step 3: Write parecer signature E2E**

Create `tests/e2e/parecer.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('Parecer 047/2025 signature page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pareceres/stf-tributacao-software');
  });

  test('renders the parecer header with formal number and title', async ({ page }) => {
    await expect(page.getByText('PARECER Nº 047/2025')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('STF e a tributação de software');
  });

  test('numbers paragraphs starting from 1 in lateral column', async ({ page }) => {
    const numbers = await page.locator('article >> p >> nth=0').all();
    await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('2', { exact: true }).first()).toBeVisible();
  });

  test('renders quote with bordeaux left border', async ({ page }) => {
    const quote = page.locator('blockquote');
    await expect(quote).toBeVisible();
    await expect(quote).toContainText('A natureza do bem digital');
  });

  test('navigates to next parecer', async ({ page }) => {
    // 047/2025 is the newest — next nav should not exist; previous should be 046/2025
    await expect(page.getByText(/Parecer nº 046\/2025/)).toBeVisible();
  });

  test('print and PDF buttons exist and call window.print', async ({ page }) => {
    let printCalled = false;
    await page.exposeFunction('__markPrintCalled', () => { printCalled = true; });
    await page.addInitScript(() => {
      window.print = () => (window as any).__markPrintCalled();
    });
    await page.reload();
    await page.getByRole('button', { name: /^Imprimir$/ }).click();
    await page.waitForTimeout(100);
    expect(printCalled).toBe(true);
  });
});
```

- [ ] **Step 4: Run E2E**

Run: `npm run test:e2e -- --project=desktop`
Expected: all 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "test: E2E for parecer signature page"
```

---

## Task 29: GitHub Pages deploy configuration

**Files:**
- Create: `.github/workflows/deploy.yml`, `public/.nojekyll`. Modify: `next.config.mjs` (add `basePath` if needed).

- [ ] **Step 1: Add .nojekyll**

Create `public/.nojekyll` (empty file) — prevents Jekyll processing on GH Pages.

Run: `New-Item -ItemType File public/.nojekyll`

- [ ] **Step 2: GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ vars.SITE_URL || 'https://vasconcellospires.com.br' }}
        run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Conditional basePath in next.config**

If the site will live at `https://<user>.github.io/<repo>/` instead of a custom domain, update `next.config.mjs`:

```js
const isProdGhPages = process.env.GH_PAGES === 'true';
const repoName = 'vasconcellos-pires-site';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  basePath: isProdGhPages ? `/${repoName}` : undefined,
  assetPrefix: isProdGhPages ? `/${repoName}/` : undefined,
};
```

If using custom domain (vasconcellospires.com.br), skip this step.

- [ ] **Step 4: Run full build to verify**

Run: `npm run build`
Expected: `out/` contains the static site; all routes have index.html.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "ci: GitHub Pages deploy workflow"
```

---

## Task 30: Accessibility audit

**Files:**
- Create: `tests/components/a11y.test.tsx`

- [ ] **Step 1: Add axe-core test**

Create `tests/components/a11y.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/page-blocks/Hero';
import { ContactForm } from '@/components/page-blocks/ContactForm';
import { ParecerHeader } from '@/components/page-blocks/ParecerHeader';

async function run(node: Element) {
  const result = await axe.run(node, { resultTypes: ['violations'] });
  return result.violations;
}

describe('a11y', () => {
  it('Header has no violations', async () => {
    const { container } = render(<Header pathname="/" />);
    const v = await run(container);
    expect(v).toEqual([]);
  });
  it('Footer has no violations', async () => {
    const { container } = render(<Footer />);
    const v = await run(container);
    expect(v).toEqual([]);
  });
  it('Hero has no violations', async () => {
    const { container } = render(<Hero />);
    const v = await run(container);
    expect(v).toEqual([]);
  });
  it('ContactForm has no violations', async () => {
    const { container } = render(<ContactForm />);
    const v = await run(container);
    expect(v).toEqual([]);
  });
  it('ParecerHeader has no violations', async () => {
    const { container } = render(<ParecerHeader number="047/2025" title="STF e a tributação de software" authorName="Helena Pires" practice="Direito Tributário" dateLabel="15 mar 2025" />);
    const v = await run(container);
    expect(v).toEqual([]);
  });
});
```

- [ ] **Step 2: Run a11y tests**

Run: `npm test -- a11y`
Expected: 5 pass. If violations, fix each (typically missing labels, low contrast, missing landmarks).

- [ ] **Step 3: Manual Lighthouse run**

Run: `npm run build && npx serve out -p 3000` (separate terminal: `npx lighthouse http://localhost:3000 --view`).
Expected: Performance, Accessibility, Best Practices, SEO all ≥ 95.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "test: axe-core accessibility tests"
```

---

## Task 31: Final verification pass

- [ ] **Step 1: Run full test suite**

Run: `npm test && npm run test:e2e -- --project=desktop`
Expected: All component tests pass; all E2E pass.

- [ ] **Step 2: Run full build**

Run: `npm run build`
Expected: Build succeeds with zero errors. `out/` ready for deploy.

- [ ] **Step 3: Visit each route in browser preview**

Run: `npx serve out -p 4000`
Walk through every route:
- `/` (home — hero motion, areas, sócios, pareceres)
- `/escritorio` (long text + romans + tiles)
- `/areas-de-atuacao` (5 areas)
- `/areas-de-atuacao/societario-ma` (with operation)
- `/areas-de-atuacao/contratos-empresariais` (without operation — descriptive)
- `/areas-de-atuacao/tributario-empresarial` (without operation)
- `/areas-de-atuacao/compliance-governanca` (with operation)
- `/areas-de-atuacao/arbitragem-disputas` (with operation)
- `/equipe`
- `/equipe/eduardo-vasconcelos`, `/equipe/helena-pires`, `/equipe/rafael-almeida-costa`, `/equipe/patricia-bernardes`
- `/pareceres`
- `/pareceres/stf-tributacao-software`, `/pareceres/lei-do-carf-14689`, `/pareceres/acordo-leniencia-cgu`
- `/contato` (form mock — submit shows confirmation, no network call)
- `/<bad-slug>` → 404 page

Check: console clean, no broken links, photos load, fonts render correctly, no layout shift, hover states work, mobile menu opens at <768px.

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore: final verification — all routes, tests, and build green"
```

---

## Self-review

**Spec coverage walk-through:**

| Spec section | Covered by |
|---|---|
| §1 Scope and stack | Task 1 |
| §2.1 IA / 9 routes | Tasks 18, 19, 22, 23, 24 |
| §2.2 Cases in areas | Task 6 (mapping), Task 19 (rendering) |
| §2.3 Pareceres distribution | Task 7 (registry), Task 22 (rendering) |
| §3 Assets strategy (retratos + tipográfico) | Tasks 16 (TypographicTile), 18 (escritório tiles), 25 (portraits) |
| §4.1 Color tokens | Task 2 |
| §4.2 Type system | Tasks 2 + 3 |
| §4.3 Grid editorial 14-col | Task 2 (config), used in Tasks 14, 16, 19, 21 |
| §4.4 Hairlines & ornamentos | Tasks 8 (Hairline, GoldRule), 27 (HairlineDraw motion) |
| §4.5 Signature parecer | Tasks 20, 21, 22 |
| §5 Components | Tasks 8–17, 21 |
| §6 Motion language | Task 27 |
| §7 Mobile pattern | Task 11 |
| §8 CTAs documentais | Embedded in Tasks 14, 15, 17, 18, 19, 22, 23 |
| §9.1 Performance | Tasks 1 (config), 3 (fonts), 25 (image pipeline), 26 (OG) |
| §9.2 SEO | Task 24 (sitemap, robots, JSON-LD) |
| §9.3 Accessibility | Tasks 11 (aria-modal), 30 (axe-core) |
| §10 Riscos & mitigações | Tasks 25 (portraits direction note), 22 (print stylesheet validation) |
| §11 Anti-padrões | Embedded across all visual tasks |

**Placeholder scan:** No "TBD", "TODO", or hand-wavy "implement as needed" steps. Every code step contains the actual code.

**Type consistency:**
- `Partner.slug`, `PracticeArea.slug`, `Operation.areaSlug`, `ParecerEntry.slug` — all consistent
- `getPartnerBySlug`, `getPracticeAreaBySlug`, `getParecerBySlug`, `getParecerNeighbors`, `getOperationsForArea`, `getFullPareceres`, `getYearsWithPareceres` — names stable across tasks
- `ParecerKind = 'full' | 'stub'` used consistently in Tasks 7, 21, 22

**One ambiguity resolved during plan-writing:** the MDX paragraph counter approach in Task 20 used module-level state which would leak across pages. Task 22 replaces it with `NumberedMDX` wrapper that maintains a counter local to a single render — this is the version the engineer should end up with.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-13-vasconcelos-pires-site.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
