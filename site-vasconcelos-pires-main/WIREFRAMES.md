# WIREFRAMES — VASCONCELOS & PIRES

> Wireframes ASCII de cada página, com notas de layout e comportamento.
> Use este arquivo junto com BRIEFING.md durante o `/superpowers:brainstorming`.

---

## Estrutura geral do site

```
/                       → Home institucional
/escritorio             → Sobre o escritório
/areas-de-atuacao       → Listagem das 5 áreas
/areas-de-atuacao/[id]  → Página individual de cada área (5 páginas)
/equipe                 → Listagem dos sócios
/equipe/[id]            → Página individual de cada sócio (4 páginas)
/pareceres              → Listagem de pareceres (signature element)
/pareceres/[slug]       → Parecer individual (3-4 mock content)
/contato                → Página de contato
```

---

## NAVEGAÇÃO GLOBAL (header)

```
+--------------------------------------------------------------------+
|  VASCONCELOS & PIRES                  Escritório · Áreas · Equipe  |
|  ──── ADVOGADOS ASSOCIADOS                Pareceres · Contato       |
+--------------------------------------------------------------------+
```

- Logo à esquerda em duas linhas: nome em serif display, "ADVOGADOS ASSOCIADOS" em mono pequeno, com filete bordô oxidado entre eles
- Menu à direita, body M, espaçamento generoso, sem dropdown
- Item ativo: sublinhado dourado mate de 1px
- Header fica fixo no scroll com fundo `#0C1220` (tinta nanquim) e backdrop-blur sutil

---

## HOME (/)

```
+--------------------------------------------------------------------+
|  [HEADER GLOBAL]                                                   |
+--------------------------------------------------------------------+
|                                                                    |
|  Estab. 1998 · São Paulo                                           |
|                                                                    |
|  Direito empresarial,                                              |
|  conduzido com rigor                                               |
|  e discrição.                                                      |
|                                                                    |
|  Escritório boutique de São Paulo dedicado a companhias            |
|  brasileiras e estrangeiras de médio e grande porte. Atuação       |
|  consultiva e contenciosa nas áreas societária, tributária,        |
|  compliance e arbitragem.                                          |
|                                                                    |
|  → Solicitar consulta                    Avenida Faria Lima, 4221  |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── EM NÚMEROS                                                     |
|                                                                    |
|  27 anos          24 advogados        4 sócios         R$ 4B+      |
|  de atuação       em quadro fixo      fundadores       em arbitr.  |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── ÁREAS DE ATUAÇÃO                                               |
|                                                                    |
|  1.1   Direito Societário e M&A                                    |
|        Estruturação de operações de fusões, aquisições...    →    |
|        ─────────────────────────────────────────────────           |
|                                                                    |
|  1.2   Contratos Empresariais                                      |
|        Negociação e redação de contratos comerciais...        →   |
|        ─────────────────────────────────────────────────           |
|                                                                    |
|  1.3   Direito Tributário Empresarial                              |
|        Consultoria preventiva, planejamento tributário...     →   |
|        ─────────────────────────────────────────────────           |
|                                                                    |
|  1.4   Compliance e Governança Corporativa                         |
|        Programas de integridade, investigações internas...    →   |
|        ─────────────────────────────────────────────────           |
|                                                                    |
|  1.5   Arbitragem e Resolução de Disputas                          |
|        Representação em arbitragens domésticas e intern...    →   |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── O ESCRITÓRIO                                                   |
|                                                                    |
|  [FOTO B&W       ]   Fundado em 1998 pelos                         |
|  [ESCRITÓRIO     ]   advogados Eduardo Vasconcelos                 |
|  [INTERIOR       ]   e Helena Pires, o escritório...               |
|  [               ]                                                 |
|  [               ]   → Conheça nosso escritório                    |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── SÓCIOS                                                         |
|                                                                    |
|  Eduardo Vasconcelos        Helena Pires                           |
|  M&A · Direito Societário   Direito Tributário                     |
|  ─────────────────          ─────────────────                     |
|  Mestre em Direito          Doutora em Direito                     |
|  Comercial (USP),           Tributário (USP),                      |
|  LLM Columbia Law           ex-Conselheira CARF                    |
|                                                                    |
|  Rafael Almeida Costa       Patrícia Bernardes                     |
|  Compliance · Governança    Arbitragem · Disputas                  |
|  ─────────────────          ─────────────────                     |
|  Mestre em Direito Penal    Mestre em Arbitragem                   |
|  Econômico (PUC-SP),        Internacional (Queen                   |
|  ex-Procurador da Rep.      Mary, Londres)                         |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── PARECERES RECENTES                                             |
|                                                                    |
|  Parecer nº 047/2025                                               |
|  STF e a tributação de software:                                   |
|  o que muda após o RE 688.223                          15 mar 2025 |
|  ──────────────────────────────────────────────────────────       |
|                                                                    |
|  Parecer nº 046/2025                                               |
|  Lei do Carf: o efeito prático da                                  |
|  Lei 14.689 no contencioso tributário                  28 fev 2025 |
|  ──────────────────────────────────────────────────────────       |
|                                                                    |
|  Parecer nº 045/2024                                               |
|  Acordo de leniência: limites do                                   |
|  poder discricionário da CGU                           12 dez 2024 |
|                                                                    |
|  → Ver todos os pareceres                                          |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  [FOOTER]                                                          |
|                                                                    |
+--------------------------------------------------------------------+
```

### Notas da Home

- Hero ocupa pouco mais da viewport (não 100vh). Densidade > teatro.
- "Em números": números em display L, label em mono. Sem ícones.
- Áreas: numeração 1.1 / 1.2 / 1.3 em mono dourado mate. Texto em duas colunas (display nome da área + body resumo). Linha divisória sutil entre cada uma.
- Sócios: 2x2 grid. Foto opcional B&W em hover (revelada com fade). Sem foto de fundo permanente.
- Pareceres: estilo sumário de revista jurídica. Número de parecer em mono dourado pequeno. Título em display M. Data à direita em mono.

---

## ESCRITÓRIO (/escritorio)

```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
+--------------------------------------------------------------------+
|                                                                    |
|  ── O ESCRITÓRIO                                                   |
|                                                                    |
|  Vinte e sete anos de                                              |
|  direito empresarial.                                              |
|                                                                    |
|  ─────────                                                         |
|                                                                    |
|  Vasconcelos & Pires foi fundado em 1998 pelos advogados           |
|  Eduardo Vasconcelos e Helena Pires após mais de uma década        |
|  atuando como conselheiros internos de companhias industriais...   |
|                                                                    |
|  [Texto longo de 4-5 parágrafos sobre história, filosofia,         |
|   posicionamento de mercado, abordagem ao cliente]                 |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── PRINCÍPIOS DE ATUAÇÃO                                          |
|                                                                    |
|  i.    Confidencialidade absoluta como pré-condição.               |
|        ────────                                                    |
|                                                                    |
|  ii.   Substância jurídica acima de retórica processual.           |
|        ────────                                                    |
|                                                                    |
|  iii.  Senioridade no atendimento. Sócios participam de toda       |
|        operação relevante.                                         |
|        ────────                                                    |
|                                                                    |
|  iv.   Recusa a casos com conflito ético, independentemente        |
|        do valor envolvido.                                         |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── ESCRITÓRIO FÍSICO                                              |
|                                                                    |
|  [FOTOS B&W EM GRID 3x2 — INTERIOR DO ESCRITÓRIO, BIBLIOTECA,      |
|   SALAS DE REUNIÃO, MEZANINO]                                      |
|                                                                    |
|  Av. Brigadeiro Faria Lima, 4221 — 19º andar                       |
|  Itaim Bibi, São Paulo                                             |
|                                                                    |
+--------------------------------------------------------------------+
```

### Notas

- Numeração em romanos minúsculos (i, ii, iii, iv) para princípios — escolha tipográfica que evoca tratados clássicos.
- Linha de divisão dupla `─────────` em dourado, hairline 1px.

---

## ÁREAS DE ATUAÇÃO (/areas-de-atuacao)

```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
+--------------------------------------------------------------------+
|                                                                    |
|  ── ÁREAS DE ATUAÇÃO                                               |
|                                                                    |
|  Cinco frentes. Atuação                                            |
|  exclusivamente empresarial.                                       |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  1.1                                                               |
|  Direito Societário e M&A                                          |
|  ─────────────────────────────────────────────                    |
|                                                                    |
|  Estruturação de operações de fusões e aquisições, joint           |
|  ventures, reorganizações societárias, due diligence legal         |
|  e negociação de acordos de acionistas. Atuação recorrente         |
|  em transações de R$ 50M a R$ 2B.                                  |
|                                                                    |
|  → Conhecer a prática                                              |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  1.2                                                               |
|  Contratos Empresariais                                            |
|  ─────────────────────────────────────────────                    |
|  [...]                                                             |
|                                                                    |
+--------------------------------------------------------------------+
```

### Notas

- Cada área é um bloco grande, full-width, separado por linha hairline.
- Hover no bloco inteiro revela um pequeno indicador → à direita.
- Numeração 1.1 em mono dourado M, antes do display L do nome.

---

## ÁREA INDIVIDUAL (/areas-de-atuacao/societario-ma)

```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
+--------------------------------------------------------------------+
|                                                                    |
|  1.1 · Áreas de Atuação                                            |
|                                                                    |
|  Direito Societário                                                |
|  e M&A                                                             |
|                                                                    |
|  ────────                                                          |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  Estruturação de operações de fusões e aquisições...               |
|                                                                    |
|  [Texto longo de descrição da área, 3-4 parágrafos]                |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── SERVIÇOS                                                       |
|                                                                    |
|  · Fusões e aquisições (M&A)                                       |
|  · Reorganizações societárias                                      |
|  · Joint ventures e parcerias estratégicas                         |
|  · Due diligence legal                                             |
|  · Acordos de acionistas                                           |
|  · Estruturação de holdings                                        |
|  · Operações de private equity e venture capital                   |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ── SÓCIOS RESPONSÁVEIS                                            |
|                                                                    |
|  Eduardo Vasconcelos                                               |
|  M&A · Direito Societário                                          |
|  ─────────                                                         |
|  Mestre em Direito Comercial (USP), LLM Columbia Law               |
|  → Conhecer Eduardo                                                |
|                                                                    |
+--------------------------------------------------------------------+
```

---

## EQUIPE (/equipe)

```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
+--------------------------------------------------------------------+
|                                                                    |
|  ── EQUIPE                                                         |
|                                                                    |
|  Quatro sócios.                                                    |
|  Atuação direta em cada caso.                                      |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  [FOTO B&W]   Eduardo Vasconcelos                                  |
|  [SÓCIO 01]   Sócio-Fundador                                       |
|  [          ]  M&A · Direito Societário                            |
|  [          ]  ─────                                               |
|  [          ]  Mestre em Direito Comercial pela Universidade       |
|  [          ]  de São Paulo (USP). LLM em Corporate Law pela       |
|  [          ]  Columbia Law School. Foi general counsel de         |
|  [          ]  grupo industrial brasileiro de capital aberto       |
|  [          ]  entre 1992 e 1998, antes de fundar o escritório.    |
|  [          ]  Atuação destacada em operações de M&A de capital    |
|  [          ]  aberto desde 2003.                                  |
|  [          ]                                                      |
|  [          ]  → Página completa                                   |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  [Repetir padrão para Helena, Rafael, Patrícia]                    |
|                                                                    |
+--------------------------------------------------------------------+
```

### Notas

- Layout em duas colunas: foto B&W vertical (3:4) à esquerda, info à direita.
- Foto: monocromática, contraste moderado, fundo neutro. Sem sorrisos amplos.
- Sócios alternam: sócio 1 foto à esquerda, sócio 2 foto à direita, etc.

---

## PARECERES (/pareceres) — SIGNATURE PAGE

```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
+--------------------------------------------------------------------+
|                                                                    |
|  ── PARECERES                                                      |
|                                                                    |
|  Análises e comentários sobre                                      |
|  decisões e legislação relevante                                   |
|  para o direito empresarial.                                       |
|                                                                    |
|  Publicação periódica do escritório desde 2003.                    |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  2025                                                              |
|  ────                                                              |
|                                                                    |
|  Nº 047    STF e a tributação de software:                         |
|            o que muda após o RE 688.223                            |
|            por Helena Pires                          15 mar 2025   |
|  ────────────────────────────────────────────────────────────     |
|                                                                    |
|  Nº 046    Lei do Carf: o efeito prático da                        |
|            Lei 14.689 no contencioso tributário                    |
|            por Helena Pires                          28 fev 2025   |
|  ────────────────────────────────────────────────────────────     |
|                                                                    |
|  Nº 045    Acordo de leniência: limites do                         |
|            poder discricionário da CGU                             |
|            por Rafael Almeida Costa                  12 jan 2025   |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  2024                                                              |
|  ────                                                              |
|                                                                    |
|  [mais 3-4 pareceres listados]                                     |
|                                                                    |
+--------------------------------------------------------------------+
```

---

## PARECER INDIVIDUAL (/pareceres/stf-tributacao-software)

```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
+--------------------------------------------------------------------+
|                                                                    |
|         ── PARECER Nº 047/2025                                     |
|                                                                    |
|         STF e a tributação                                         |
|         de software: o que                                         |
|         muda após o                                                |
|         RE 688.223                                                 |
|                                                                    |
|         ─────────                                                  |
|                                                                    |
|         por Helena Pires · Direito Tributário                      |
|         São Paulo, 15 de março de 2025                             |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|   1     A decisão do Supremo Tribunal Federal no Recurso           |
|         Extraordinário 688.223, julgado em fevereiro de 2025,      |
|         redefine os contornos da tributação sobre softwares...     |
|                                                                    |
|   2     Em síntese, o STF firmou tese segundo a qual...            |
|                                                                    |
|         ┃ "A natureza do bem digital, quando licenciado            |
|         ┃ sem transferência de propriedade, afasta a               |
|         ┃ incidência do ICMS, mantendo-se o ISS como               |
|         ┃ tributo aplicável." — RE 688.223, voto do Min.           |
|         ┃ Rel. Luís Roberto Barroso                                |
|                                                                    |
|   3     A consequência prática para companhias de tecnologia...    |
|                                                                    |
|   [continua... ~400-600 palavras totais]                           |
|                                                                    |
|         ─────────                                                  |
|                                                                    |
|         Vasconcelos & Pires Advogados Associados                   |
|         Parecer nº 047/2025 · 15 mar 2025                          |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  → Próximo: Parecer nº 048/2025 · Helena Pires                     |
|  ← Anterior: Parecer nº 046/2025 · Helena Pires                    |
|                                                                    |
+--------------------------------------------------------------------+
```

### Notas — esta é a página signature

- Layout em coluna única estreita (max-width ~720px), centralizada.
- Numeração de parágrafo lateral (1, 2, 3) em mono dourado mate, em coluna fixa à esquerda.
- Citações com filete vertical bordô oxidado de 2px à esquerda, texto em itálico body L.
- NO topo: marca "Parecer Nº xxx/AAAA" em mono bordô, com filete dourado fino.
- Tipografia display do título quebrada em 3-4 linhas com break manual proposital.
- Botões de "imprimir" e "salvar PDF" no rodapé. Sem share social.

---

## CONTATO (/contato)

```
+--------------------------------------------------------------------+
|  [HEADER]                                                          |
+--------------------------------------------------------------------+
|                                                                    |
|  ── CONTATO                                                        |
|                                                                    |
|  Atendimento exclusivo                                             |
|  por agendamento.                                                  |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  ENDEREÇO                          FORMULÁRIO                      |
|  ────────────                      ──────────────                  |
|                                                                    |
|  Av. Brigadeiro                    Nome                            |
|  Faria Lima, 4221                  [_______________________]       |
|  19º andar                                                         |
|  Itaim Bibi                        Empresa                         |
|  São Paulo / SP                    [_______________________]       |
|  CEP 04538-133                                                     |
|                                    Cargo                           |
|                                    [_______________________]       |
|  TELEFONE                                                          |
|  ────────                          Email corporativo               |
|  +55 11 3147-8200                  [_______________________]       |
|                                                                    |
|                                    Telefone                        |
|  EMAIL                             [_______________________]       |
|  ─────                                                             |
|  contato@                          Natureza da consulta            |
|  vasconcellospires.com.br          [Societário ▼]                  |
|                                                                    |
|                                    Descreva brevemente             |
|  HORÁRIO                           [_______________________]       |
|  ───────                           [_______________________]       |
|  Segunda a sexta                   [_______________________]       |
|  9h às 18h                                                         |
|                                    → Solicitar agendamento         |
|                                                                    |
+--------------------------------------------------------------------+
```

### Notas

- Layout em duas colunas: esquerda info, direita formulário
- Formulário é mock — onSubmit mostra estado de "enviado" mas não envia de fato
- Inputs com border-bottom apenas (1px nanquim/30 → focus 1px dourado)
- Sem labels flutuantes. Labels acima dos campos, mono S, uppercase.

---

## FOOTER (global)

```
+--------------------------------------------------------------------+
|                                                                    |
|  VASCONCELOS & PIRES                                               |
|  ──── ADVOGADOS ASSOCIADOS                                         |
|                                                                    |
|  Av. Brigadeiro Faria Lima, 4221    Escritório    Pareceres        |
|  19º andar · Itaim Bibi              Áreas         Contato         |
|  São Paulo / SP                      Equipe                        |
|                                                                    |
|  +55 11 3147-8200                                                  |
|  contato@vasconcellospires.com.br                                  |
|                                                                    |
|  ──────────────────────────────────────────────────────────────   |
|                                                                    |
|  © 2025 Vasconcelos & Pires Advogados Associados.                  |
|  OAB/SP 12.345                       Política de Privacidade · LGPD|
|                                                                    |
+--------------------------------------------------------------------+
```

---

## Comportamentos globais

- **Scroll:** suave, sem `scroll-snap` agressivo
- **Hover em links:** sublinhado dourado mate aparece com transição 200ms
- **Imagens:** lazy loading, fade-in em entrada do viewport
- **Tipografia:** carregada via `next/font/google` com `display: swap`
- **Mobile:** mesmo layout colapsado em uma coluna. Header vira menu hambúrguer minimalista (linha de 1px, não três barras).
- **Reduced motion:** todas animações desligadas se `prefers-reduced-motion: reduce`
