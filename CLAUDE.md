# CLAUDE.md — Contexto do Projeto

> Instruções para sessões do Claude Code neste repositório. Leia antes de tocar em qualquer arquivo. Vale tanto para Felipe quanto para Vinicius.

## Identidade do projeto

Site institucional **fictício** do escritório **"Vasconcelos & Pires Advogados Associados"** — peça de portfólio da agência **Nuvvo Studio**. O site demonstra capacidade de construir interfaces densas, editoriais, anti-template para clientes B2B premium. Todo o conteúdo (sócios, cases, pareceres, endereço) é ficção autoral; nada é cliente real.

O projeto **não vai ao ar publicamente** no momento. O repo é privado e existe para colaboração interna e para servir de vitrine em apresentações.

## Stack

- **Framework:** Next.js 14.2 (App Router) — `output: 'export'` (gera estático em `out/`)
- **Linguagem:** TypeScript 5.5 estrito (`strict: true`, sem `any`)
- **Estilo:** Tailwind CSS 3.4 com tokens custom em `tailwind.config.ts`
- **Tipografia:** `next/font/google` — Cormorant Garamond (display), Inter (sans), JetBrains Mono (mono)
- **Animação:** Framer Motion 11.11 — sempre via wrappers em `components/motion/`, sempre respeitando `useReducedMotion`
- **MDX:** `@next/mdx` 14.2 — pareceres em `content/pareceres/*.mdx`
- **Testes:** Vitest 2.1 + React Testing Library 16 + jsdom 25 — `npm test`
- **E2E:** Playwright 1.47 — `npm run test:e2e` (suite mínima, ainda)
- **Lint:** ESLint via `next lint`
- **Assets:** Sharp 0.33 (otimização de imagens via `scripts/optimize-images.ts`), Satori 0.11 (gerador de OG via `scripts/generate-og.ts`) — rodam no `prebuild`

## Convenções

### TypeScript
- Zero `any`. Use `unknown` + narrowing se precisar.
- Tipos de dados de conteúdo ficam em `content/*.ts` (ex: `Partner`, `Operation`, `ParecerEntry`).
- Server vs client: marque `'use client'` apenas onde houver `useState`/`useEffect`/Framer hooks. Páginas e blocos puramente apresentacionais ficam como Server Components.

### Componentes
- Pequenos e específicos. Um `PartnerCard` faz uma coisa só.
- Pastas: `components/layout/`, `components/page-blocks/`, `components/primitives/`, `components/motion/`.
- Não crie wrappers genéricos do tipo `<Card>` / `<Container>` — o sistema editorial vive da especificidade.

### Estilo
- **SÓ via Tailwind**, e SÓ via tokens declarados em `tailwind.config.ts`.
- **Cores: SOMENTE** `ink`, `ivory`, `bordeaux`, `gold`, `stone`, `bone`. Nunca hex direto no JSX (`text-[#cc0000]` é proibido).
- **Tipografia: SÓ** via `font-display` / `font-sans` / `font-mono` + escala (`text-display-xl`, `text-body-l`, `text-mono`, etc.).
- Spacing custom: use `py-section` para seções de página (já é o `clamp(96px, 12vh, 160px)` do tailwind config).

### Animações
- Framer Motion **só** dentro de `components/motion/` (`FadeRise`, `StaggerLines`, `HairlineDraw`). Não use `motion.div` direto em página/bloco — passe pelos wrappers.
- Todo wrapper de motion respeita `useReducedMotion` e retorna `<div>` cru quando o usuário pediu redução. Mantenha isso ao criar wrappers novos.
- `FadeRise` / `StaggerLines` aceitam `mode="mount" | "inView"`. Use `"mount"` para conteúdo acima da dobra (Hero) que precisa aparecer no carregamento. Use `"inView"` (default) para conteúdo que entra durante scroll.

### Imagens
- **`PlaceholderPhoto.tsx`** é o componente de portaria enquanto não há fotos B&W reais dos sócios. SVG inline, cor nanquim com texto mono dourado. NÃO substitua por `<img>` quebrado.
- Quando fotos chegarem (`public/photos/partners/<slug>.webp`), troque o `<PlaceholderPhoto>` por `<Image>` do `next/image` (em `next.config.mjs` está `images.unoptimized: true` por causa do `output: 'export'`).
- Sempre `alt` descritivo. Decorative SVGs levam `role="img"` + `aria-label` ou `aria-hidden="true"`.

### Acessibilidade
- Hierarquia de headings: uma `h1` por página, seguida por `h2` (não pule). Veja correção feita em PartnerCard.
- Color contrast AA: gold (`#B89968`) **só** sobre ink (`#0C1220`). Sobre bone/ivory, use bordeaux ou stone para texto funcional (Nº de parecer, labels). Gold continua como acento decorativo em divisores / setas / numerações inline.
- Inputs sempre com `<label>` associado por `htmlFor`/`id`. Botões só com ícone exigem `aria-label`.

## Anti-padrões VETADOS

Do BRIEFING §7.6 — não introduza, não sugira, não "experimente":

- ❌ Paleta cream + terracota (é o default genérico de IA — esse projeto nasceu pra contrariar isso)
- ❌ Gradientes coloridos
- ❌ Glassmorphism / blur exagerado
- ❌ Ícones de balança, martelo, livros antigos, capacete de obra
- ❌ Foto de aperto de mão / advogado em pé com toga
- ❌ Stock photos genéricas
- ❌ Hover com `transform: scale(1.05)` em cards
- ❌ Headline tipo "Excelência em soluções jurídicas"
- ❌ Bullet points com emoji
- ❌ Botão CTA grande "FALE CONOSCO" laranja
- ❌ Cores neon / acid / vibrante
- ❌ Layout "três colunas iguais — Missão · Visão · Valores"

## Signature element

`/pareceres/[slug]` é **o** diferencial visual do site. Cuidado redobrado ao editar:

- **Numeração lateral de parágrafos** (`ParecerParagraph`) — coluna mono à esquerda com número do § em bordeaux (era gold; mudou em a11y pass).
- **Citação com filete bordô** (`ParecerQuote`) — `<blockquote>` com `border-l-2 border-bordeaux`, font-display itálico. Não envelope com `<p>` (MDX já envelopa). Hidratação já quebrou uma vez por causa disso; o fix está no commit `cce8878`.
- **Header formal** (`ParecerHeader`) — "PARECER Nº xxx/AAAA" em mono bordeaux + título em display-xl.
- MDX components custom (mapeados em `app/pareceres/[slug]/page.tsx` ou no `mdx-components.tsx`): mexer com cautela.

Antes de qualquer mudança nessa página, **rode `npm test` E abra a página no browser para conferir que hidrata sem erro no console**.

## Comandos

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build estático de produção em `out/` (roda `prebuild`: optimize-images + generate-og) |
| `npm run start` | Serve o build de produção (para `output: 'export'`, use `npx serve out/` na prática) |
| `npm test` | Roda Vitest (42+ testes) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:e2e` | Playwright (mínimo) |
| `npm run lint` | ESLint |

## Antes de qualquer alteração

1. Leia **BRIEFING.md** — posicionamento, paleta, anti-padrões.
2. Leia **WIREFRAMES.md** — estrutura ASCII de todas as páginas.
3. Leia **SECURITY-REVIEW.md** — decisões de CSP, JSON-LD escape, env-aware policy.
4. Leia **LIGHTHOUSE-SUMMARY.md** — quais issues a11y já foram tratados, quais ficaram fora de escopo.
5. Leia este **CLAUDE.md**.
6. Rode `npm test` antes de tocar em qualquer componente, para ter baseline verde.

## Quando adicionar uma página nova

1. Confira nos `WIREFRAMES.md` se está prevista. Se não, **pare** e pergunte ao Felipe antes de codar.
2. Use `SectionLabel` para eyebrows (`── TÍTULO`).
3. Use `GoldRule` para divisores.
4. Adicione JSON-LD apropriado no `<head>` (helpers em `lib/jsonld.ts`) — siga o padrão do `LegalService` / `Person` / `Article`.
5. `export const metadata = { title, description }` específicos.
6. Teste em mobile (375px) antes de commitar.
7. Adicione ao `app/sitemap.ts` se for página institucional.

## Decisões arquiteturais já tomadas (não revisite sem motivo forte)

- `output: 'export'` — estático puro, sem servidor. Sem rotas API, sem Server Actions, sem revalidação.
- **CSP environment-aware** — dev permite `'unsafe-eval'` (HMR/React Refresh); produção é estrita. Lógica em `lib/csp.ts`. `frame-ancestors` propositalmente fora do meta-CSP (spec não honra via `<meta>`).
- Fontes via `next/font/google` (Cormorant Garamond, Inter, JetBrains Mono).
- **Sem CMS.** Conteúdo em arquivos TS: `content/partners.ts`, `content/practice-areas.ts`, `content/operations.ts`, `content/pareceres.ts`. Pareceres "full" em MDX: `content/pareceres/*.mdx`.
- **Sem backend.** `ContactForm` mostra confirmação otimista; nenhum dado é enviado.
- **GH Pages como alvo de deploy quando publicar** — `unoptimized: true` em `images`, `trailingSlash: true`, sem Server Actions, sem middleware.

## Equipe

- **Felipe Andreoli Garcia** (`garciaedu2012@gmail.com`) — lead. Design, dados, arquitetura, decisão final sobre identidade visual.
- **Vinicius Gomes** — dev. Integrações, AI, features.

## Branding

- Agência: **Nuvvo Studio**.
- GitHub: hoje sob conta pessoal `AndreoliFe`. Quando a agência tiver org própria, migrar o repo.
- Este projeto não é cliente real — é vitrine.

## Quando estiver em dúvida

Não invente. Pergunte ao Felipe. Mudanças em `/pareceres/*` e na paleta exigem aprovação explícita.
