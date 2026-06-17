# Security Review — Vasconcelos & Pires Site

> **Data:** 2026-06-13
> **Escopo:** revisão completa do código-fonte do site institucional estático antes do deploy em GitHub Pages.
> **Modelo de ameaça:** site institucional 100% estático (`output: 'export'`), sem backend, sem banco de dados, sem fluxo de autenticação, sem ingestão de input de usuário em runtime, sem APIs próprias. O formulário de contato é mock — não envia dados.

---

## 1. Sumário das verificações

| # | Verificação | Resultado |
|---|---|---|
| 1 | Credenciais ou chaves de API no código-fonte | ✅ Nenhuma encontrada |
| 2 | Usos de `dangerouslySetInnerHTML` / `innerHTML` / `eval` / `Function()` / `document.write` | ✅ 3 usos (JSON-LD), todos com dados controlados; hardening de escape aplicado |
| 3 | Injeção via conteúdo MDX | ✅ MDX vem apenas de arquivos `content/pareceres/*.mdx` versionados, sem input externo |
| 4 | Validação/sanitização do formulário de contato | ✅ Mock — não submete dados, não renderiza valores de input; sem vetor |
| 5 | Configuração de segurança Next.js (headers, CSP) | ✅ CSP + Referrer-Policy aplicados via meta tag (export estático; GH Pages não aceita headers HTTP) |
| 6 | Dependências com vulnerabilidades conhecidas (`npm audit`) | ⚠️ 14 vulnerabilidades (2 críticas, 6 altas, 6 moderadas), todas em build/dev tooling — não afetam o artefato deployado |
| 7 | Logs de console expondo informações sensíveis | ✅ Apenas logs cosméticos em `scripts/` (tempo-de-build) |
| 8 | CORS | ✅ N/A — site estático sem endpoints próprios |
| 9 | Variáveis de ambiente | ✅ Apenas `NEXT_PUBLIC_SITE_URL` (intencionalmente público; nada secreto) |
| 10 | Configuração de arquivos estáticos | ✅ `.gitignore` cobre `.env*.local`, `node_modules`, `.next`, `out`, `.claude/`, `*.log`, artefatos de build de imagens |

---

## 2. Problemas encontrados

### CRÍTICO — 0 issues exploitáveis

As 2 CVEs marcadas como "critical" pelo `npm audit` em `next@14.2.15` **não aplicam** a este código:

- **GHSA-7m27-7ghc-44w9** (DoS via Server Actions): exige Server Actions habilitadas. Este projeto usa `output: 'export'` (HTML/CSS/JS pré-renderizado, sem runtime Node). Sem vetor.
- **GHSA-36qx-fr4f-26g5** (Middleware/Proxy bypass em Pages Router com i18n): exige Pages Router + i18n. Este projeto usa App Router e não tem i18n. Sem vetor.

Conclusão: **nenhum problema CRÍTICO runtime no artefato deployado**.

### ALTO

#### H1 — JSON-LD sem escape de `<`, `>`, `&`, U+2028, U+2029 inline em `<script>` (CORRIGIDO)

- **Local:** `lib/jsonld.ts` → função `ldScript()`, consumida por:
  - `app/page.tsx` (LegalService)
  - `app/equipe/[slug]/page.tsx` (Person)
  - `app/pareceres/[slug]/page.tsx` (Article)
- **Risco:** `JSON.stringify` não escapa `<`, `>`, `&` nem os terminadores de linha JS U+2028/U+2029. Se qualquer dado embarcado no JSON-LD viesse a conter `</script>` (ou esses code points), o parser HTML fecharia o `<script>` mais cedo e o restante seria interpretado como markup — clássico XSS via JSON-em-HTML. Hoje todos os dados são strings hardcoded em `content/`, então não há vetor exploitável; mas a função é reutilizável e qualquer drift futuro (importação de pareceres externos, integração com CMS, etc.) reintroduziria o risco.
- **Correção aplicada:** `ldScript()` agora aplica os 5 substitutos canônicos:
  ```ts
  const SCRIPT_ESCAPE: Record<string, string> = {
    '<': '\\u003C',
    '>': '\\u003E',
    '&': '\\u0026',
    [String.fromCharCode(0x2028)]: '\\u2028',
    [String.fromCharCode(0x2029)]: '\\u2029',
  };
  ```
  Verificado no build: o HTML gerado contém `Vasconcelos & Pires` em vez de `Vasconcelos & Pires` dentro do JSON-LD. Os substitutos continuam JSON válido — o parser JSON dos crawlers (Google, schema.org validators) os interpreta corretamente.

#### H2-H6 — Vulnerabilidades em ferramentas de build/dev (NÃO CORRIGIDO — sem risco runtime)

Cinco categorias retornadas pelo `npm audit`, todas atingindo apenas o processo de build/teste local. Como o artefato publicado no GH Pages é HTML/CSS/JS estático, essas vulnerabilidades **não rodam em produção**:

| CVE / Advisory | Pacote | Onde afeta | Por que não impacta produção |
|---|---|---|---|
| GHSA-gv7w-rqvm-qjhr | `esbuild` (via vite/vitest/tsx) | Apenas durante install do esbuild | Não é executado em runtime; build emite estático |
| GHSA-67mh-4wv8-2f99 | `esbuild` | Dev server local | Dev server nunca é exposto publicamente |
| GHSA-7mvr-c777-76hp | `playwright` | Download de browsers em `npm install` | Acontece localmente; não compõe o bundle final |
| GHSA-5j98-mcp5-4vw2 | `glob` (CLI) | Command injection via `-c/--cmd` flag | Não usamos o CLI do glob diretamente |
| GHSA-qx2v-qp2m-jg93 | `postcss <8.5.10` | XSS via `</style>` em CSS stringify | Só atinge processamento de CSS não-confiável; todo o CSS aqui vem de fontes versionadas |

**Por que não auto-corrigir:** o `npm audit fix --force` faria upgrade major para `next@16` e `vitest@4`, exigindo refatoração não trivial (App Router API mudanças, novos peer deps, possíveis quebras em next/font, MDX, framer-motion). Para um portfólio estático sem superfície de ataque runtime, custo > benefício neste momento.

**Recomendação operacional:** agendar bump de toolchain (Next 14 → 15 ou 16, Vitest 2 → 3 ou 4) em janela dedicada, com smoke test completo após.

### MÉDIO (aplicado neste review)

#### M1 — Sem CSP nem outros security headers (CORRIGIDO — environment-aware)

GitHub Pages não permite headers HTTP custom. Solução adotada: `<meta http-equiv="Content-Security-Policy">` injetado direto no `<head>` via `app/layout.tsx`, com a política construída por `lib/csp.ts` (`buildCSP(env)`).

A política é **environment-aware**: estrita em produção, ligeiramente relaxada em desenvolvimento.

**Produção (`NODE_ENV !== 'development'`) — política estrita:**

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none'
```

**Desenvolvimento (`NODE_ENV === 'development'`) — adiciona `'unsafe-eval'` apenas em `script-src`:**

```
script-src 'self' 'unsafe-inline' 'unsafe-eval';
```

Justificativa técnica para `'unsafe-eval'` em dev:
- O dev server do Next.js (`next dev`) usa `eval()` internamente para HMR (Hot Module Replacement) e para o React Refresh runtime. Sem `'unsafe-eval'`, o bundle do cliente lança `EvalError: Evaluating a string as JavaScript violates the following Content Security Policy directive` e a hidratação nunca termina — todos os componentes `'use client'` (incluindo Framer Motion) ficam presos no estado SSR inicial, frequentemente invisíveis. Em produção (export estático), nada usa `eval()`: a política estrita é mantida e validada.
- A função `buildCSP` defaulta para o ramo **estrito** (sem `unsafe-eval`) para qualquer valor de env diferente de `'development'`, incluindo `undefined`, `'test'`, `'production'`. Isso garante que o build estático (`next build`, NODE_ENV=production) e o artefato deployado em GH Pages nunca recebam `unsafe-eval`.

Outras exceções, idênticas em ambos os ambientes:
- **`'unsafe-inline'` em `script-src`** — necessário pelo JSON-LD inline e pelos markers de bootstrap do Next.js. Poderia ser eliminado via nonce/hash em deploy futuro com renderização SSR; em export estático sem header HTTP, é a melhor opção viável.
- **`'unsafe-inline'` em `style-src`** — necessário pelo Tailwind (classes injetadas em runtime via styled-jsx) e pelo `next/font` (blocos `<style>` de preload).
- **`data:` em `img-src` e `font-src`** — permite fragmentos base64 do `next/font` e fallbacks data-URL eventuais do `next/image`.
- **`frame-ancestors 'none'`** — bloqueia clickjacking via embed em iframe externo (defesa contra phishing usando o site).
- **`object-src 'none'`** — proíbe `<object>`/`<embed>`/`<applet>` (sem necessidade legítima).

**Proteção contra regressão:** `tests/components/csp.test.ts` valida que `buildCSP('production')`, `buildCSP('test')` e `buildCSP(undefined)` **não** contêm `'unsafe-eval'`. Qualquer mudança futura que tente afrouxar a política em produção quebra o build.

Verificação: `out/index.html` contém `<meta http-equiv="Content-Security-Policy" content="...">` com as 10 diretivas e sem `'unsafe-eval'`; build passa.

#### M2 — Referrer-Policy (CORRIGIDO)

Adicionado via `metadata.referrer = 'strict-origin-when-cross-origin'` em `app/layout.tsx`. Verificação: `out/index.html` contém `<meta name="referrer" content="strict-origin-when-cross-origin"/>`. Comportamento: requests cross-origin enviam apenas o origin (não o path), requests same-origin enviam o referer completo.

### BAIXO (informativo — não aplicado)

#### L1 — Fallback hardcoded de URL em 3 arquivos

`lib/jsonld.ts`, `app/sitemap.ts`, `app/robots.ts` têm:

```ts
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vasconcellospires.com.br';
```

Se `NEXT_PUBLIC_SITE_URL` não for setada no deploy, JSON-LD/sitemap/robots vão anunciar `vasconcellospires.com.br` mesmo que o site esteja em `<user>.github.io/repo`. Isso não é vulnerabilidade — é drift operacional. Mitigação: setar `SITE_URL` como variável do GitHub repo conforme já documentado.

#### L2 — Formulário de contato sem `autoComplete`/`autocorrect` controlados

`components/page-blocks/ContactForm.tsx` deixa `autoComplete` no default do browser. Para um formulário mock sem envio, irrelevante; para uma futura integração com backend, considerar `autoComplete="off"` em "Natureza da consulta" e "Descreva brevemente".

#### L3 — `id-token: write` no workflow do GitHub Actions

`.github/workflows/deploy.yml` solicita `id-token: write` — é a permissão **mínima necessária** pelo `actions/deploy-pages@v4` para autenticação OIDC com Pages. Não é over-privileged. Documentado para auditoria.

#### L4 — Sem subresource integrity em assets externos

Não usamos CDN externo — todas as fontes vêm self-hosted via `next/font` (download em build time, servido do mesmo origin). Não há scripts ou stylesheets de terceiros no HTML produzido. Nada a fazer.

---

## 3. Correções aplicadas neste review

1. ✅ **H1 — Hardening do `ldScript()`** em `lib/jsonld.ts`. Verificação: `out/index.html` agora contém `&` no lugar de `&` dentro do JSON-LD; teste manual com payload contendo `</script>` confirma escape correto.

2. ✅ **M1 — Content-Security-Policy via meta tag** em `app/layout.tsx`. 10 diretivas, com `'unsafe-inline'` documentado e justificado.

3. ✅ **M2 — Referrer-Policy** = `strict-origin-when-cross-origin` em `app/layout.tsx`.

Commits dedicados:
```
fix(security): escape JSON-in-HTML in ldScript to defend against future <script> injection
fix(security): add CSP meta tag and strict referrer policy
```

---

## 4. Recomendações pendentes (sua decisão)

| Prioridade | Item | Custo | Benefício |
|---|---|---|---|
| BAIXO | L1 — confirmar `NEXT_PUBLIC_SITE_URL` no deploy | 1 min | Evita drift de URL canônica |
| Operacional | Upgrade Next 14 → 15/16 + Vitest 2 → 3/4 | 1-3 h | Elimina os 14 audit findings em build tooling |
| Hardening futuro | Substituir `'unsafe-inline'` em `script-src` por nonce/hash | 30 min | Remove única exceção significativa da CSP (exigiria SSR ou geração de hashes dos scripts inline) |

---

## 5. Verificações que NÃO foram feitas

Por estarem fora do escopo de um portfólio estático em GH Pages, ou por dependerem de ações operacionais fora do código:

- **DAST (testes dinâmicos):** sem endpoint para exercitar.
- **SAST profissional** (Snyk, Semgrep com regras customizadas): a varredura manual baseou-se em padrões conhecidos.
- **Penetration test:** nada a invadir além de um servidor estático.
- **GitHub branch protection rules / required reviews:** decisão de processo do dono do repo.
- **Dependabot auto-updates:** recomendado habilitar; configuração de repo, não de código.
- **Configuração HTTPS/HSTS:** controlado pelo GitHub Pages (já força HTTPS por default em custom domains com HTTPS enforcement habilitado).
