---
project: Vasconcelos & Pires — Site institucional
date: 2026-06-13
status: aprovado para implementação
related:
  - ../../../BRIEFING.md
  - ../../../WIREFRAMES.md
---

# Spec de design — Vasconcelos & Pires Advogados Associados

> Documento que consolida as decisões do brainstorm. Reflete o conteúdo de `BRIEFING.md` e `WIREFRAMES.md`, resolve as lacunas identificadas, e define o sistema de design no nível necessário para iniciar a implementação.

---

## 1. Escopo e objetivo

Site institucional estático de escritório boutique de direito empresarial brasileiro, fictício, com 9 rotas. Posicionamento: **autoridade silenciosa**, formato editorial denso, tipografia evocando pareceres jurídicos clássicos.

**Stack obrigatório:**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS 3.4+ (tokens em `tailwind.config.ts`)
- Framer Motion 11 (uso restrito)
- MDX para corpo dos pareceres
- Deploy estático em GitHub Pages (`output: 'export'`)
- Sem backend; formulário de contato é mock

---

## 2. Arquitetura de informação

### 2.1. Rotas

```
/                          Home
/escritorio                Sobre + princípios + endereço
/areas-de-atuacao          Listagem das 5 áreas
/areas-de-atuacao/[slug]   Área individual — agora com bloco "Operações Representativas"
/equipe                    Listagem dos 4 sócios
/equipe/[slug]             Bio individual
/pareceres                 Listagem sumário agrupada por ano
/pareceres/[slug]          Parecer individual — signature page
/contato                   Endereço + formulário mock
```

### 2.2. Distribuição dos cases (decisão do brainstorm)

Os 3 cases anonimizados de `BRIEFING.md §5` ficam dentro das páginas de área correspondentes, em bloco "Operações Representativas":

| Case | Área hospedeira |
|---|---|
| 01 — Reorganização societária multinacional | 1.1 Direito Societário e M&A |
| 02 — Defesa em arbitragem CAM-CCBC | 1.5 Arbitragem e Disputas |
| 03 — Programa de integridade pós-leniência | 1.4 Compliance e Governança |

Áreas 1.2 (Contratos) e 1.3 (Tributário) **não recebem case** — em vez disso ganham bloco "Atuação representativa" descritivo (tipos de operação, sem cliente identificável). Coerência institucional: nem toda área expõe operação publicamente.

### 2.3. Distribuição dos pareceres

`/pareceres` agrupa por ano:

- **2025** — Nº 047, 046, 045 → três com corpo MDX completo (~400–600 palavras)
- **2024** — Nº 044, 043, 042, 041, 040 → stubs (metadados only)

Stubs renderizados com `cursor-default`, opacidade 60%, sem link — sinal visual claro de "arquivo histórico" sem precisar de 404. Sinaliza "publicação periódica desde 2003" sem inflar conteúdo.

**Conteúdo dos 3 pareceres completos:**

1. **Nº 047/2025** — Helena Pires — *STF e a tributação de software: o que muda após o RE 688.223*
2. **Nº 046/2025** — Helena Pires — *Lei do Carf: o efeito prático da Lei 14.689 no contencioso tributário*
3. **Nº 045/2024** — Rafael Almeida Costa — *Acordo de leniência: limites do poder discricionário da CGU*

Dois autores (Helena Pires e Rafael Almeida Costa) — mostra que a publicação tem mais de uma voz sem produzir conteúdo redundante.

---

## 3. Estratégia de assets

| Asset | Tratamento |
|---|---|
| Retratos dos 4 sócios (`/equipe`, `/equipe/[slug]`) | Gerados em estilo press portrait B&W — fundo neutro, contraste moderado, sem sorriso amplo. Direção fotográfica idêntica para os 4. |
| Foto do interior na home | Substituída por **stripe tipográfica nanquim**: extrato de parecer em itálico bordô + número de processo CNJ em mono dourado |
| Grid 3×2 do `/escritorio` | Substituído por **dossiê tipográfico** de 6 fragmentos editoriais: endereço em mono, citações estatutárias, ementas, com filete dourado e numeração romana |
| OG cover por página | Bloco nanquim sólido + wordmark serifado + filete dourado horizontal + número da página em mono (ex.: "01 · Home"). Gerado em build via script `scripts/generate-og.ts` usando `satori` + `sharp` (output PNG estático em `public/og/`). Sem `@vercel/og` runtime — incompatível com `output: 'export'`. |
| Favicon | "V" serifado em dourado mate sobre nanquim |

Decisão: 8 substituições tipográficas viram o que faz o site parecer **dossiê jurídico**, não site institucional comum.

---

## 4. Sistema de design

### 4.1. Tokens de cor

```ts
colors: {
  ink:      '#0C1220', // tinta nanquim — bg escuro, texto sobre marfim
  ivory:    '#EDE7DA', // marfim envelhecido — bg claro
  bordeaux: '#5C1922', // bordô oxidado — links hover, citações, filetes
  gold:     '#B89968', // dourado mate — numerais, hairlines signature
  stone:    '#4A4E58', // cinza pedra — texto secundário, captions
  bone:     '#F8F6F1', // branco osso — cards sobre marfim
}
```

Contraste validado (AA / AAA conforme uso):
- ink ↔ ivory: 15:1
- bordeaux / ivory: 8.6:1
- gold / ink: 5.2:1 (usado só em elementos pequenos — numerais, hairlines)
- stone / ivory: 7:1 (captions)

**Regras de superfície:**
- Seções "escuras": `bg-ink text-ivory` (hero, header fixo, footer)
- Seções "claras": `bg-ivory text-ink` (corpo de página, listagens)
- Cards sobre marfim: `bg-bone`
- Gold *nunca* em superfície grande — apenas traço, numeral, símbolo

### 4.2. Type system

Famílias via `next/font/google`:

| Token | Família | Pesos | Uso |
|---|---|---|---|
| `font-display` | Cormorant Garamond | 500, 600 | Hero, títulos de seção, citações |
| `font-sans` | Inter | 400, 500 | Body, navegação, formulários |
| `font-mono` | JetBrains Mono | 400, 500 | Numerais 1.1, CNJ/RE/REsp, datas, captions uppercase |

Escala:

```ts
fontSize: {
  'display-xl': ['4.5rem',  { lineHeight: '5rem',    letterSpacing: '-0.02em' }], // 72/80
  'display-l':  ['3.5rem',  { lineHeight: '4rem',    letterSpacing: '-0.02em' }], // 56/64
  'display-m':  ['2.5rem',  { lineHeight: '3rem',    letterSpacing: '-0.02em' }], // 40/48
  'body-l':     ['1.1875rem', { lineHeight: '1.875rem' }],                         // 19/30
  'body-m':     ['1rem',      { lineHeight: '1.625rem' }],                         // 16/26
  'body-s':     ['0.875rem',  { lineHeight: '1.375rem' }],                         // 14/22
  'mono':       ['0.8125rem', { lineHeight: '1.375rem', letterSpacing: '0.04em' }], // 13/22
  'mono-s':     ['0.6875rem', { lineHeight: '1rem',     letterSpacing: '0.08em' }], // 11/16 — labels uppercase
},
```

`mono-s` usado em labels uppercase tipo `── EM NÚMEROS`, com tracking generoso.

### 4.3. Layout — grid editorial 14-col

- Container max-width: **1280px**
- Grid de **14 colunas**, gutter 24px
- Hierarquia indentada por **anchor de coluna**, nunca por margin-left:
  - Numeração de seção (`1.1`) → col 1
  - Título display → col 2–8
  - Body → col 2–10
  - Metadados/datas → col 12–14, alinhados à direita
- Coluna editorial estreita (corpo de parecer): max-width 720px, centralizada em col 3–11
- Padding vertical de seção: `clamp(96px, 12vh, 160px)`

Esse grid encoda visualmente o look de sumário de peça jurídica.

### 4.4. Hairlines & ornamentos

- Hairline padrão: 1px `ivory/30` sobre ink, ou `ink/15` sobre ivory
- Filete dourado: 1px `gold` — usado em wordmark, sob "PARECER Nº", em divisores de "── PRINCÍPIOS"
- Filete duplo (`1px / 4px / 1px`): UMA vez por seção, como selo
- Seta documental: caractere `→` em mono dourado — nunca SVG icon

### 4.5. Signature element — tratamento do parecer

Layout do `/pareceres/[slug]`:

```
┌─ col 1 ─┬───────────── col 2–10 ────────────┬─ col 11–14 ─┐
│         │                                    │              │
│    1    │  A decisão do Supremo Tribunal     │              │
│         │  Federal no RE 688.223 redefine…   │              │
│         │                                    │              │
│    2    │  Em síntese, o STF firmou…         │              │
│         │                                    │              │
│         │  ┃ "A natureza do bem digital,     │              │
│         │  ┃ quando licenciado…" — RE 688.   │              │
│         │                                    │              │
│    3    │  A consequência prática…           │              │
└─────────┴────────────────────────────────────┴──────────────┘
```

Detalhes técnicos:
- **Numeração lateral**: `mono` dourado, em col 1, alinhada ao topo de cada parágrafo. Implementada via componente `<ParecerParagraph n={1}>` que renderiza um `<p>` com a numeração em coluna lateral via grid; mais tipado e testável do que CSS `::before`.
- **Citação**: `<blockquote>` com `border-left: 2px solid theme(colors.bordeaux)`, `padding-left: 24px`, `font-style: italic`, `font-family: display`, `body-l`.
- **Header "PARECER Nº 047/2025"**: `mono` uppercase em `gold`, tracking 0.12em, com filete dourado de 1px embaixo.
- **Footer formal**: `Vasconcelos & Pires Advogados Associados · Parecer nº 047/2025 · 15 mar 2025` centralizado, mono `ivory/60`.
- **Botões "Imprimir" e "Salvar PDF"**: ambos chamam `window.print()`. Print stylesheet força tudo em ink sobre branco, mantém estrutura editorial, esconde header/footer/menu. "Salvar PDF" é o mesmo print dialog (usuário escolhe destino).
- **Sem botões de share social** (BRIEFING 7.4 explícito).
- **Corpo dos pareceres em MDX** — permite `<Quote source="RE 688.223, Min. Barroso">…</Quote>` e `<Citation legal="Lei 14.689/2023, art. 3º">…</Citation>` inline.

---

## 5. Componentes & decomposição

```
components/
  layout/
    Header.tsx              nav fixo, bg-ink + backdrop-blur, item ativo com sublinhado dourado
    Footer.tsx              wordmark + endereço + links + OAB
    MobileMenu.tsx          drawer slide-down com numeração romana
    SectionLabel.tsx        "── PRINCÍPIOS" treatment (mono-s + hairline)
    Hairline.tsx            divisor: variantes default / gold / double
  primitives/
    SectionNumber.tsx       "1.1" em mono dourado
    GoldRule.tsx            filete dourado horizontal
    InlineRoman.tsx         "i." "ii." "iii." em mono dourado
    DocArrow.tsx            "→" em mono dourado
  page-blocks/
    Hero.tsx                Composição home/landing
    StatsRow.tsx            "EM NÚMEROS" (27 anos · 24 advogados…)
    PracticeAreaRow.tsx     Bloco da área (numeração + display + body + arrow)
    PartnerCard.tsx         Retrato B&W + bio
    OperationsBlock.tsx     "Operações Representativas" (cases por área)
    ParecerListItem.tsx     Entrada na listagem; variante `stub` (sem link)
    ParecerHeader.tsx       "PARECER Nº xxx/AAAA" + filete dourado
    ParecerBody.tsx         Coluna editorial estreita com numeração lateral
    ParecerQuote.tsx        Citação com filete bordô
    ParecerNav.tsx          → próximo / ← anterior no rodapé do parecer
    ContactForm.tsx         Form mock, estado "enviado", sem fetch
    TypographicTile.tsx     Substituto tipográfico de foto
content/
  partners.ts               4 sócios tipados (id, slug, name, role, education, bio, photoSrc)
  practice-areas.ts         5 áreas (id, slug, title, summary, services, partnerIds, operationIds)
  operations.ts             3 cases anonimizados
  pareceres.ts              8 entradas — 3 com `body: () => MDXContent`, 5 stubs
```

Princípio: cada componente é puro, recebe props tipadas, sem fetching. Toda data importada estaticamente dos arquivos em `content/`.

---

## 6. Motion language

Framer Motion 11, uso restrito. Todos os padrões respeitam `prefers-reduced-motion: reduce` via `useReducedMotion()` — desligamento total, conteúdo visível imediatamente.

| Padrão | Onde | Detalhe |
|---|---|---|
| `fade + rise` | Labels, metadata, blocos | y 8 → 0, opacity 0 → 1, 600ms, ease `(0.16, 1, 0.3, 1)` |
| `serif stagger` | Títulos display 2–4 linhas | Stagger por linha 80ms — palavra inteira, nunca letter-by-letter |
| `hairline draw` | Divisores horizontais | scaleX 0 → 1 origem esquerda, 800ms |
| `gold underline` | Links hover | width 0 → 100% no underline, 200ms |
| `paragraph reveal` | Pareceres | Cada `<p>` fade-in conforme entra no viewport, 400ms |
| `parallax sutil` | Hero da home | translateY -10% sobre 100vh scroll; desligado em mobile |

Anti-padrões reforçados: sem rotação de cards, sem text typewriter, sem scale(1.05) em hover, sem gradiente animado.

---

## 7. Mobile pattern

- Header colapsa wordmark para uma linha
- Botão menu = **única linha horizontal de 1px dourado** (`aria-label="Menu"`). Tap vira "×" pequeno em dourado, mesma cor.
- Menu abre como drawer slide-down full-width: `bg-ink/95 + backdrop-blur`, itens em `display-m` com numeração romana à esquerda (i, ii, iii, iv, v, vi) em mono dourado
- Layout colapsa para single col abaixo de 768px
- Numeração 1.1 / 1.2 das áreas é **preservada** em mobile — encoda hierarquia documental

---

## 8. CTAs & copy refinado (não-comerciais)

Ajustes de copy do BRIEFING/WIREFRAMES para reforçar tom documental:

| Origem | Antes | Depois |
|---|---|---|
| Home hero | "Solicitar consulta" | **"Solicitar agendamento"** (alinha com /contato) |
| Áreas listagem | "Conhecer a prática" | **"Ver atuação completa"** |
| Sócios card | "Conhecer Eduardo" | **"Página completa"** (impessoal, documental) |
| Pareceres listagem | "Ver todos os pareceres" | **"Arquivo completo"** |
| Contato submit | "Enviar" | **"Solicitar agendamento"** |

---

## 9. Performance, SEO & acessibilidade

### 9.1. Performance
- `next/font/google` com `display: 'swap'`, `preload: true` em Cormorant + Inter; JetBrains preload só em `/pareceres` e `/pareceres/[slug]`
- `next.config.js`: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true` (compat GH Pages)
- Imagens otimizadas no pré-build via `scripts/optimize-images.ts` usando `sharp` (npm script `prebuild`): gera WebP + AVIF em múltiplos tamanhos a partir dos originais em `public/photos/_src/`
- Lighthouse target: 95+ em todas as categorias

### 9.2. SEO
- Meta title e description únicos por página (gerados em `generateMetadata`)
- Open Graph com cover gerada em build
- Schema.org JSON-LD:
  - `LegalService` na home
  - `Person` em cada `/equipe/[slug]`
  - `Article` em cada `/pareceres/[slug]`
- `sitemap.xml` + `robots.txt` gerados em build

### 9.3. Acessibilidade
- Contraste mínimo 4.5:1 (palette validada)
- Foco visível em todos elementos interativos (outline 2px gold com offset 2px)
- Alt text em todas as imagens; `aria-label` em controles sem texto (menu mobile)
- `prefers-reduced-motion` respeitado
- Hierarquia de heading consistente (`h1` único por página, `h2` para seções)

---

## 10. Riscos & decisões pendentes

| Risco | Mitigação |
|---|---|
| Retratos AI dos sócios podem cair em "AI look" uniforme | Tratar como direção fotográfica única — mesmo lighting, fundo, framing — e revisar manualmente cada um. Aceitável: retrato press-style B&W de press release; inaceitável: variação de roupa/idade/sorriso entre os 4 |
| MDX em export estático pode quebrar | Validar setup com `@next/mdx` + `output: 'export'` antes de implementar os 3 pareceres |
| Print stylesheet do parecer precisa esconder elementos sem quebrar layout | Implementar e validar com print preview de cada parecer antes de declarar feito |
| `unoptimized: true` no next/image significa que precisamos pré-otimizar manualmente | Script `prebuild` que processa imagens em `public/photos/` para WebP em múltiplos tamanhos |

---

## 11. Anti-padrões reforçados (do BRIEFING)

Vetados no escopo deste site, sem exceção:
- ❌ Paleta cream + terracota
- ❌ Hero genérico "Excelência em soluções jurídicas"
- ❌ Ícones de balança, martelo, livros antigos, escala
- ❌ Stock photos de aperto de mão / advogado em pé com toga
- ❌ Card hover com `transform: scale(1.05)`
- ❌ Botão CTA grande "FALE CONOSCO" laranja
- ❌ Gradientes coloridos
- ❌ Numeração decorativa `01 / 02 / 03`
- ❌ Glassmorphism / blur effects exagerados
- ❌ Layout em três colunas iguais "nossos valores"
- ❌ Bullet points genéricos com emoji
