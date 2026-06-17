# Entrega — Vasconcelos & Pires Site

**Cliente fictício:** Vasconcelos & Pires Advogados Associados
**Agência:** Nuvvo Studio
**Data:** 2026-06-13
**Status:** Concluído · Privado · Não publicado

## Sumário executivo

Site institucional fictício para escritório boutique de direito empresarial, construído como peça de portfólio da Nuvvo Studio. O objetivo é demonstrar capacidade de entregar interfaces editoriais densas, anti-template e tecnicamente sólidas para clientes B2B premium — operando fora da estética genérica de "agência cream + terracota" que satura a categoria. Todo o conteúdo (escritório, sócios, áreas, cases, pareceres, endereço) é autoral e ficcional; nenhum cliente real está envolvido.

A entrega cobre nove páginas, design system tokenizado, signature element editorial em `/pareceres/[slug]` (numeração lateral, citação com filete bordô, header formal), auditoria de segurança aplicada (CSP environment-aware, JSON-LD escape, Referrer-Policy), auditoria de acessibilidade aplicada (color-contrast, heading-order, hydration mismatch eliminado), 42 testes automatizados verdes, build de produção limpo e workspace pronto para colaboração 2-dev. O repositório fica privado: o deploy público foi intencionalmente adiado, podendo ser ativado quando a Nuvvo decidir (GH Pages com workflow já testado em commit anterior, hoje removido).

## Checklist de entrega

- ✅ 9 páginas implementadas (Home, Escritório, Áreas + 5 slugs, Equipe + 4 slugs, Pareceres + 3 slugs, Contato)
- ✅ Design system completo (tokens em `tailwind.config.ts`: 6 cores, 3 famílias tipográficas, escala display/body/mono, spacing custom)
- ✅ Signature element `/pareceres/[slug]` (numeração lateral, citação com filete bordô, header formal "Parecer Nº xxx/AAAA")
- ✅ Auditoria de segurança (`SECURITY-REVIEW.md`): H1 (JSON-LD escape) + M1 (CSP env-aware) + M2 (Referrer-Policy) aplicados
- ✅ Auditoria de acessibilidade (`LIGHTHOUSE-SUMMARY.md`): Critical (hydration) + Serious (color-contrast, heading-order) + Cosmetic (favicon, frame-ancestors warning) aplicados
- ✅ 42 testes automatizados (Vitest + Testing Library + jsdom) verdes
- ✅ Build de produção verde (20+ páginas estáticas, 87.3 KB First Load JS shared)
- ✅ Documentação técnica completa (BRIEFING, WIREFRAMES, CLAUDE, SECURITY-REVIEW, LIGHTHOUSE-SUMMARY, PROJECT-DELIVERY, README)
- ✅ Pronto para colaboração 2-dev (`.gitattributes`, `.vscode/extensions.json`, `.vscode/settings.json`, `.env.example`)
- ⬜ Deploy público (intencionalmente adiado — repo segue privado; workflow GH Pages estava em commit `ef5c164` e foi removido nesta entrega)
- ⬜ Fotos B&W reais dos sócios (PlaceholderPhoto SVG inline cobre o portfólio; trocar por `<Image>` quando chegarem)
- ⬜ Conteúdo MDX de pareceres "archive" (3 full prontos, restante é teaser sinalizado como arquivo)

## Estatísticas

| Métrica | Valor |
|---|---:|
| Arquivos versionados | 91 |
| Commits em `main` | 28 |
| Linhas de código (TS/TSX/CSS, sem node_modules) | 2.544 |
| Linhas de MDX (pareceres) | 39 |
| Páginas estáticas geradas no build | 20+ (incluindo dynamic slugs) |
| First Load JS shared (gzipped) | 87.3 KB |
| Bundle por rota (média) | ~94 KB First Load |
| Tempo total de implementação | ~1 sessão (build inicial + security review + a11y pass + handoff) |

## Como rodar localmente

Documentado no `README.md`. Resumo:

```bash
git clone https://github.com/AndreoliFe/site-vasconcelos-pires.git
cd site-vasconcelos-pires
npm install
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`.

## Melhorias futuras opcionais

| Item | Esforço | Por que faz sentido |
|---|---|---|
| Substituir `PlaceholderPhoto` por fotos B&W reais | 15 min (após shoot) | Já é só trocar o componente em `PartnerCard` e `app/equipe/[slug]/page.tsx` por `<Image>` do `next/image` com `src={partner.photoSrc}` |
| Internacionalização (i18n) PT/EN | 1-2 dias | Mercado-alvo (clientes corporativos brasileiros e estrangeiros) justifica EN. Next 14 App Router suporta sem fricção |
| CMS leve para edição de pareceres | 2-3 dias | Sanity ou Contentlayer permitiriam Felipe publicar parecer sem PR. Hoje exige commit MDX |
| Formulário de contato com backend | 30 min | Resend ou Formspree. ContactForm já está modelado, só plugar fetch |
| Analytics privacy-first | 30 min | Plausible self-host ou Plausible Cloud. Sem cookies, conforme posicionamento "discrição" |
| Deploy público | 1-2 h | Hoje sem workflow. Quando decidir publicar: re-criar `.github/workflows/deploy.yml` (referência no histórico `ef5c164`), definir `NEXT_PUBLIC_SITE_URL`, habilitar Pages em settings |
| Re-audit Lighthouse contra build de produção | 15 min | Os scores de Performance medidos em `LIGHTHOUSE-SUMMARY.md` são do dev server (HMR, unminified). Em prod deve subir significativamente |

## Usar este projeto como template para outro site fictício/real

Casca pronta. Para gerar variação:

1. Clone o repo.
2. Substitua o conteúdo em `content/`:
   - `partners.ts` (sócios)
   - `practice-areas.ts` (áreas + descrições + serviços)
   - `operations.ts` (cases/transações representativas)
   - `pareceres.ts` (index) e os MDX em `content/pareceres/`
3. Ajuste `app/layout.tsx` (metadata, schema.org `LegalService`) e `lib/jsonld.ts` (helpers).
4. Se a paleta precisar mudar, edite `tailwind.config.ts` mantendo a estrutura (6 cores nomeadas).
5. Reescreva `BRIEFING.md` para refletir o novo posicionamento.
6. `npm install && npm run dev` e itere.

A arquitetura (App Router + export estático + sem CMS + sem backend) é deliberadamente enxuta para que esse fork seja rápido. CSP, JSON-LD escape, env-aware policy e a11y baseline ficam de graça.

## Estado dos arquivos de documentação

| Arquivo | Tamanho | Função |
|---|---:|---|
| `BRIEFING.md` | 9.8 KB | Posicionamento, paleta, tipografia, signature element, anti-padrões |
| `WIREFRAMES.md` | 33.9 KB | ASCII de 9 páginas, hierarquia de componentes |
| `CLAUDE.md` | ~6 KB | Instruções para sessões do Claude Code (Felipe + Vinicius) |
| `SECURITY-REVIEW.md` | 12.4 KB | Auditoria de segurança, decisões CSP, JSON-LD escape |
| `LIGHTHOUSE-SUMMARY.md` | ~6 KB | Scores, top issues, fixes aplicados, como re-auditar |
| `PROJECT-DELIVERY.md` | este | Sumário executivo, checklist, estatísticas, próximos passos |
| `README.md` | ~6 KB | Setup local, comandos, estrutura, regras de contribuição |
| `.env.example` | 0.5 KB | Variáveis de ambiente documentadas |

---

Desenvolvido por **Nuvvo Studio**
Felipe Andreoli Garcia · Vinicius Gomes
