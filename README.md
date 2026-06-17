# Vasconcelos & Pires — Site Institucional

**Status:** Privado · Em desenvolvimento · Não publicado

Peça de portfólio da **Nuvvo Studio**. Site institucional fictício de escritório boutique de direito empresarial brasileiro. Todo o conteúdo (nome do escritório, sócios, cases, pareceres, endereço) é ficção autoral, gerado especificamente para demonstrar capacidade técnica e estética para futuros clientes corporativos. Nenhum cliente real está envolvido.

## Stack

- **Next.js 14.2** (App Router) — export estático (`output: 'export'`, sem servidor em runtime)
- **TypeScript 5.5** estrito
- **Tailwind CSS 3.4** com tokens custom em `tailwind.config.ts`
- **Framer Motion 11.11** — animações via wrappers em `components/motion/`
- **next/font/google** — Cormorant Garamond (display), Inter (sans), JetBrains Mono (mono)
- **@next/mdx 14.2** — pareceres em MDX
- **Vitest 2.1** + React Testing Library + jsdom — 42+ testes
- **Playwright 1.47** — suite e2e mínima
- **Sharp 0.33** e **Satori 0.11** rodando no `prebuild` (otimização de imagens + geração de OG)
- **GitHub Pages** como alvo de deploy quando publicar (não está publicado agora)

## Setup local (Vinicius)

### Pré-requisitos

- **Node.js 20+ LTS**
- **npm 10+** (ou `corepack enable` para usar pnpm/yarn — não testado)
- **Git** com Personal Access Token ou GitHub CLI autenticado

### Primeira execução

```bash
git clone https://github.com/AndreoliFe/site-vasconcelos-pires.git
cd site-vasconcelos-pires
npm install
npm run dev
```

Acesse <http://localhost:3000>. Se a porta estiver ocupada, Next.js sobe em 3001.

### Comandos

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build estático de produção em `out/` (roda `prebuild`: optimize-images + generate-og) |
| `npm test` | Roda Vitest (42+ testes) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:e2e` | Playwright |
| `npm run lint` | ESLint (`next lint`) |

## Estrutura

```
.
├── app/                          # App Router (Next 14)
│   ├── layout.tsx                # Root layout, fonts, CSP via meta
│   ├── page.tsx                  # Home
│   ├── icon.svg, favicon.ico     # Marca pequena
│   ├── escritorio/               # /escritorio
│   ├── areas-de-atuacao/         # /areas-de-atuacao + [slug]
│   ├── equipe/                   # /equipe + [slug]
│   ├── pareceres/                # /pareceres + [slug] (signature element)
│   ├── contato/                  # /contato
│   ├── sitemap.ts, robots.ts     # SEO
│   └── globals.css               # Tailwind base + utilities
│
├── components/
│   ├── layout/                   # Header, Footer, MobileMenu, Hairline, SectionLabel
│   ├── page-blocks/              # Hero, PartnerCard, ParecerHeader/Quote/Paragraph, OperationsBlock, ContactForm, etc.
│   ├── primitives/               # DocArrow, GoldRule, SectionNumber, InlineRoman, PlaceholderPhoto
│   └── motion/                   # FadeRise, StaggerLines, HairlineDraw — todos respeitam useReducedMotion
│
├── content/                      # Dados tipados (sem CMS)
│   ├── partners.ts               # 4 sócios
│   ├── practice-areas.ts         # 5 áreas
│   ├── operations.ts             # Cases representativos
│   ├── pareceres.ts              # Index de pareceres
│   └── pareceres/*.mdx           # Pareceres em MDX (full body)
│
├── lib/
│   ├── jsonld.ts                 # JSON-LD helpers + escape-safe ldScript()
│   ├── csp.ts                    # buildCSP(env) — env-aware policy
│   └── motion.ts                 # Variants compartilhados (fadeRise, staggerParent, EASE)
│
├── public/                       # Estáticos (favicons, og/, photos/ vazio)
├── scripts/                      # prebuild: optimize-images, generate-og
├── tests/components/             # Vitest specs
├── tests/e2e/                    # Playwright
└── docs/superpowers/             # Specs e planos de implementação
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste:

```bash
cp .env.example .env.local
```

A única var hoje é `NEXT_PUBLIC_SITE_URL`, usada em JSON-LD, sitemap e robots para gerar URLs canônicas. Em dev, `http://localhost:3000` é o padrão.

## Documentação interna — leitura obrigatória

| Arquivo | Quando ler |
|---|---|
| **BRIEFING.md** | Antes de discutir qualquer ponto de design ou conteúdo. Define posicionamento, paleta, tipografia, anti-padrões. |
| **WIREFRAMES.md** | Antes de criar/alterar página. Tem ASCII das 9 páginas. |
| **CLAUDE.md** | Sempre que abrir uma sessão do Claude Code neste repo. |
| **SECURITY-REVIEW.md** | Antes de mexer em `lib/csp.ts`, `lib/jsonld.ts` ou no `<head>`. |
| **LIGHTHOUSE-SUMMARY.md** | Antes de mudar paleta, hierarquia de heading, ou tags. |
| **PROJECT-DELIVERY.md** | Visão executiva do estado atual e próximos passos. |

## Como contribuir

### Vinicius

- Branch feature antes de mexer em qualquer página existente.
- PR com descrição clara: o quê, por quê, screenshots se for visual.
- `npm test` verde antes de pedir review.
- Respeite os anti-padrões listados em `BRIEFING.md §7.6` (sem gradientes, sem balança, sem hover scale, sem CTA laranja).
- Não use cores fora da paleta declarada (`ink`, `ivory`, `bordeaux`, `gold`, `stone`, `bone`). Sem hex hardcoded no JSX.
- Mudanças no signature element (`/pareceres/[slug]` e componentes `Parecer*`) precisam ser discutidas com Felipe antes de codar.

### Felipe

- Reviewer obrigatório em qualquer mudança visual.
- Decisão final sobre identidade, paleta, copy institucional.

## Status de entrega

- ✅ 9 páginas implementadas (Home, Escritório, Áreas + 5 slugs, Equipe + 4 slugs, Pareceres + 3 slugs, Contato)
- ✅ Design system tokenizado (cores, tipografia, espaçamento)
- ✅ Signature element (`/pareceres/[slug]`) com numeração lateral, citação com filete bordô, header formal
- ✅ Auditoria de segurança aplicada — JSON-LD escape, CSP env-aware, Referrer-Policy
- ✅ Auditoria de acessibilidade aplicada — color-contrast, heading-order, hydration error, favicon, CSP frame-ancestors warning
- ✅ 42 testes automatizados verdes
- ✅ Build de produção verde (23 páginas estáticas geradas)
- ✅ Documentação técnica completa (BRIEFING, WIREFRAMES, CLAUDE, SECURITY-REVIEW, LIGHTHOUSE-SUMMARY, PROJECT-DELIVERY)
- ✅ Workspace pronto para 2-dev (`.gitattributes`, `.vscode/`, `.env.example`)
- ⬜ Deploy público (intencionalmente adiado — repo privado)
- ⬜ Fotos B&W reais dos sócios (placeholders SVG inline funcionam para portfólio)
- ⬜ Conteúdo MDX dos pareceres "archive" (3 full prontos, restante é teaser)

---

Desenvolvido por **Nuvvo Studio**
Felipe Andreoli Garcia · Vinicius Gomes
