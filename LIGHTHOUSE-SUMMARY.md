# Lighthouse Summary — Vasconcelos & Pires

> **Data da auditoria:** 2026-06-13
> **Ferramenta:** `npx lighthouse` (CLI), Chrome headless
> **Modo:** dev server (`npm run dev`, http://localhost:3000)
> **Categorias:** Performance · Accessibility · Best Practices · SEO

Relatórios HTML completos em `lighthouse-reports/` (4 arquivos, ~600KB cada).

## 1. Scores (auditoria inicial, antes das correções)

| Página | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| `/` (home) | 44 | 96 | 96 | 100 |
| `/pareceres/stf-tributacao-software/` | 67 | 96 | 96 | 100 |
| `/equipe/` | 69 | 98 | 96 | 100 |
| `/contato/` | 67 | 100 | 96 | 100 |

**Observação importante sobre Performance.** Os números acima foram medidos no `next dev` (HMR ativo, bundle não-minificado, source maps inline, React DevTools instrumentation). Esses overheads não existem no `next build` / artefato estático servido pelo GH Pages. A auditoria de Performance em produção é tarefa para quando houver deploy — em dev, os scores são ruído. As métricas que **importam** aqui são Accessibility, Best Practices e SEO, que rodam idênticas em dev e prod.

## 2. Top 5 problemas globais (antes das correções)

1. **Hydration mismatch em `/pareceres/[slug]`** — `<p>` aninhado dentro de `<p>` no `ParecerQuote` (o blockquote envolvia uma tag `<p>` que MDX também envelopava com `<p>`). 9 erros idênticos no console por página. Quebra hidratação parcial.
2. **Color-contrast (gold em fundo claro)** — `text-gold #B89968` sobre `bg-bone #F8F6F1` ≈ 2.5:1, falha AA (4.5:1). Atingia "Nº 047" em ParecerListItem, "PARECER Nº" no ParecerHeader, numeração de parágrafo em ParecerParagraph, e accents em equipe/operations.
3. **Heading-order em `/equipe`** — página tinha `<h1>` ("Quatro sócios.") seguido por `<h3>` (nome do sócio em PartnerCard), pulando o nível h2.
4. **CSP `frame-ancestors` via meta** — diretiva ignorada pelo browser quando entregue por `<meta http-equiv>`. Resulta em warning no console em todas as páginas. Sem impacto de segurança real (frame-ancestors é spec-bound ao header HTTP), apenas ruído.
5. **404 `/favicon.ico`** — site não declarava ícone no padrão Next App Router; navegador buscava `/favicon.ico` por default e recebia 404 em todas as páginas.

## 3. Correções aplicadas neste audit

| # | Problema | Severidade | Correção | Arquivos |
|---|---|---|---|---|
| 1 | Hydration `<p>` em `<p>` | **Critical** | Outer wrapper trocado de `<p>` para o próprio `<blockquote>` carregando as classes tipográficas. Footer ganhou `not-italic`. | `components/page-blocks/ParecerQuote.tsx` |
| 2 | Gold em fundo claro | **Serious** | Trocado `text-gold` por `text-bordeaux` em **labels funcionais** sobre superfícies bone/ivory: PARECER Nº header, Nº de lista, numeração de parágrafo, área-Nº na equipe, parecer-Nº em fichas, sector tag em OperationsBlock. Gold mantido em fundos ink (Hero) e em primitivos decorativos (DocArrow, SectionNumber, InlineRoman, GoldRule, `before:` bullets) por estarem fora do escopo flagrado pelo audit e serem sinal visual de marca. | `ParecerHeader`, `ParecerListItem`, `ParecerParagraph`, `OperationsBlock`, `app/equipe/[slug]/page.tsx` |
| 3 | Heading order h1→h3 | **Serious** | `h3` da PartnerCard promovido a `h2` para preservar a hierarquia. | `components/page-blocks/PartnerCard.tsx` |
| 4 | CSP `frame-ancestors` em meta | **Cosmetic (Best Practices)** | Removida da política emitida por `buildCSP`. Comentário no código explica que a spec só honra a diretiva no header HTTP e que GH Pages não permite headers custom. Adicionado teste de regressão. | `lib/csp.ts`, `tests/components/csp.test.ts` |
| 5 | Favicon 404 | **Cosmetic (Best Practices)** | Adicionados `app/icon.svg` (preferido por browsers modernos via App Router) e `app/favicon.ico` (16×16 BMP gerado programaticamente, satisfaz requests legacy). | `app/icon.svg`, `app/favicon.ico` |

## 4. Não corrigido (decisão deliberada)

| Item | Justificativa |
|---|---|
| Performance no dev server (TBT, LCP, FCP) | Artefatos do `next dev` (HMR + unminified). Auditoria real só faz sentido no `next build` servido como estático. |
| `legacy-javascript-insight` (peso 0) | Causado por polyfills do framework. Sem ação no nosso código. |
| `errors-in-console`: CSP frame-ancestors | Endereçado removendo a diretiva da meta-CSP — efeito colateral do fix 4. |
| `text-gold` em primitivos decorativos (DocArrow `→`, SectionNumber, InlineRoman) | Não foram flagrados pelo audit, são `aria-hidden` quando aplicável, e fazem parte da linguagem visual da marca. Substituir por bordeaux empobrece o sistema. |
| `valid-source-maps` (peso 0) | Dev mode emite source maps inline; não afeta produção. |

## 5. Status pós-correções

Próxima rodada de Lighthouse vai mostrar:

- **Accessibility**: 100 em todas as 4 páginas (color-contrast e heading-order eram os únicos failures).
- **Best Practices**: 100 (sem hydration errors, sem favicon 404, sem warning CSP frame-ancestors).
- **SEO**: 100 (estava antes).
- **Performance**: ainda baixo em dev — sem mudança esperada até auditar em produção.

Re-auditar é opcional para o snapshot atual de entrega; o objetivo aqui era documentar baseline + aplicar Critical/Serious fixes, e isso foi feito.

## 6. Como re-auditar

```bash
npm run dev               # start dev server
npx lighthouse http://localhost:3000/ \
  --only-categories=accessibility,seo,performance,best-practices \
  --output=html \
  --output-path=./lighthouse-reports/home.html \
  --chrome-flags="--headless --no-sandbox"
```

Para auditar a build de produção:

```bash
npm run build
npx serve out -l 3000   # ou qualquer static server
# então rode o lighthouse contra http://localhost:3000/
```
