# BRIEFING — VASCONCELOS & PIRES Advogados Associados

> Documento base para construção do site institucional.
> Use este arquivo como referência durante `/superpowers:brainstorming` e `/frontend-design:frontend-design`.

---

## 1. Identidade do escritório (ficcional, para portfólio)

**Nome:** Vasconcelos & Pires Advogados Associados
**Sede:** Av. Brigadeiro Faria Lima, 4221 — 19º andar — Itaim Bibi, São Paulo
**Fundação:** 1998 (27 anos de atuação)
**Tamanho:** Boutique premium — 24 advogados, 4 sócios
**Idioma do site:** Português brasileiro (PT-BR). Sem versão em inglês nesta entrega.

## 2. Posicionamento

Escritório boutique de direito empresarial paulista, atendendo companhias listadas em bolsa, multinacionais de médio porte, family offices e fundos de investimento. Não atende pessoa física. Tese de marca: **autoridade silenciosa**. O site não vende — ele demonstra autoridade pela forma como organiza informação, escolhe palavras e trata o leitor.

O cliente-alvo (CEO, CFO, General Counsel) não responde a "trust" e "excellence" em manchete. Responde a substância. O site precisa parecer um documento sério escrito por alguém que sabe do assunto, não uma landing page de agência.

## 3. Áreas de atuação (conteúdo pronto)

### 3.1. Direito Societário e M&A
Estruturação de operações de fusões e aquisições, joint ventures, reorganizações societárias, due diligence legal e negociação de acordos de acionistas. Atuação recorrente em transações de R$ 50M a R$ 2B.

### 3.2. Contratos Empresariais
Negociação e redação de contratos comerciais complexos — fornecimento de longo prazo, distribuição, licenciamento de tecnologia, parcerias estratégicas e contratos de cooperação industrial.

### 3.3. Direito Tributário Empresarial
Consultoria preventiva, planejamento tributário, contencioso administrativo e judicial em matéria federal, estadual e municipal. Atuação em CARF e tribunais superiores.

### 3.4. Compliance e Governança Corporativa
Implementação de programas de integridade (Lei 12.846), políticas anticorrupção, investigações internas, due diligence de terceiros e adequação à LGPD em ambientes empresariais.

### 3.5. Arbitragem e Resolução de Disputas
Representação em arbitragens domésticas e internacionais (CAM-CCBC, CCI, LCIA), mediação empresarial e contencioso estratégico em tribunais brasileiros.

## 4. Equipe (4 sócios)

### Eduardo Vasconcelos
Sócio-fundador. M&A e Direito Societário.
Mestre em Direito Comercial (USP), LLM em Corporate Law (Columbia Law School).
27 anos de carreira. Foi general counsel de holding industrial antes de fundar o escritório.

### Helena Pires
Sócia-fundadora. Direito Tributário.
Doutora em Direito Tributário (USP), Conselheira do CARF (2014–2018).
Reconhecida por Chambers Brazil em Tax desde 2016.

### Rafael Almeida Costa
Sócio. Compliance e Governança.
Mestre em Direito Penal Econômico (PUC-SP), ex-procurador da República (2008–2015).
Lidera investigações internas de companhias listadas.

### Patrícia Bernardes
Sócia. Arbitragem e Disputas.
Mestre em Arbitragem Internacional (Queen Mary, Londres), Árbitra listada no CAM-CCBC.
Atuou em arbitragens com valor agregado superior a R$ 4B.

## 5. Cases (3 cases anonimizados)

### Case 01 — Reorganização societária multinacional
Estruturação da reorganização de holding brasileira de grupo multinacional europeu de bens de consumo, envolvendo seis subsidiárias e otimização tributária pré-IPO. Valor da operação: confidencial. Setor: bens de consumo.

### Case 02 — Defesa em arbitragem CAM-CCBC
Representação de companhia de infraestrutura em arbitragem contra parceiro estrangeiro, com pedido de R$ 380M. Decisão favorável ao cliente em 2023. Setor: infraestrutura.

### Case 03 — Programa de integridade pós-acordo de leniência
Desenho e implementação de programa de compliance de companhia listada, após acordo de leniência com CGU. Acompanhamento de 36 meses. Setor: construção.

## 6. Contato

- **Endereço:** Av. Brigadeiro Faria Lima, 4221 — 19º andar — Itaim Bibi, São Paulo/SP — CEP 04538-133
- **Telefone:** +55 11 3147-8200
- **Email institucional:** contato@vasconcellospires.com.br
- **Horário:** Segunda a sexta, 9h às 18h
- **Atendimento:** Apenas por agendamento prévio

---

## 7. SISTEMA VISUAL

### 7.1. Paleta (NÃO use cream + terracota — é o default AI atual)

| Nome interno | Hex | Uso |
|---|---|---|
| **Tinta nanquim** | `#0C1220` | Background principal de seções escuras, texto sobre marfim |
| **Marfim envelhecido** | `#EDE7DA` | Background de seções claras, fundo "papel" |
| **Bordô oxidado** | `#5C1922` | Acentos, links em estado hover, citações destacadas |
| **Dourado mate** | `#B89968` | Signature element — apenas em momentos específicos |
| **Cinza pedra** | `#4A4E58` | Texto secundário, divisores, captions |
| **Branco osso** | `#F8F6F1` | Background de modais, cards sobre marfim |

**Regra:** dourado nunca cobre superfícies grandes. Aparece em traços finos, numerações, símbolos. É o "remove an accessory" — quase saímos sem.

### 7.2. Tipografia

- **Display (manchetes, títulos de seção):** `GT Sectra` ou alternativa free: `Cormorant Garamond` — serif com personalidade, contraste alto entre traços
- **Body (parágrafos, listas):** `Söhne` ou alternativa free: `Inter` — sans-serif neutra de alta qualidade
- **Mono (números de processo, datas, captions de cases):** `JetBrains Mono` — códigos, processos CNJ, referências

**Escala de tipo:**
- Display XL: 72/80 (hero)
- Display L: 56/64 (títulos de seção)
- Display M: 40/48 (subtítulos)
- Body L: 19/30 (parágrafos principais)
- Body M: 16/26 (texto padrão)
- Body S: 14/22 (captions, metadados)
- Mono: 13/22 (technical detail)

**Tracking:** títulos display com tracking negativo (-0.02em). Body com tracking padrão.

### 7.3. Princípios

1. **Densidade > espaço em branco vazio.** CEO espera substância. Página com 20 linhas de manchete e nada mais soa amador.
2. **Tipografia faz o trabalho pesado.** Sem ilustrações decorativas. Sem ícones de "balança" ou "martelo". A serif é o ornamento.
3. **Animações sutis e contidas.** Fade-in escalonado, leve parallax em capa, hover suave em links. Nada de cards que rotacionam ou textos que se digitam.
4. **Estrutura encoda hierarquia.** Numeração de seções (1.1, 1.2, 2.1) onde fizer sentido como sumário de documento jurídico. NÃO use 01 / 02 / 03 decorativos.
5. **Fotografia:** se for usar, B&W de alto contraste — interior do escritório, prédios históricos de SP, mãos sobre documentos. Nunca stock photo de "advogado sorrindo apertando mão de cliente".

### 7.4. Signature element — "Pareceres"

A peça que torna o site memorável: uma seção/página chamada **Pareceres** — artigos curtos (300-600 palavras) sobre temas atuais (decisões do STF, mudanças tributárias, jurisprudência relevante). Mas o tratamento visual desses artigos é distintivo:

- Numeração de parágrafo lateral (1, 2, 3...) como em peças jurídicas
- Citações destacadas em bordô oxidado, em itálico, com filete dourado à esquerda
- Footer do parecer com referência formal: "Vasconcelos & Pires, Parecer nº 047/2025"
- Tipografia display em destaque
- Sem botões de "share" sociais. Apenas "imprimir" e "salvar PDF"

Isso comunica autoridade pela forma. Nenhum site de advocacia brasileiro faz isso bem.

### 7.5. Vocabulário aesthetic

Palavras-chave que descrevem o mood, para uso em prompts e decisões de design:

`editorial` · `denso` · `papel` · `tinta` · `arquivo` · `parecer` · `dossiê` · `sumário` · `tipográfico` · `serifado` · `silencioso` · `disciplinado` · `restrained` · `monumental` · `ancestral` · `bureau` · `chambers`

### 7.6. Anti-padrões (NÃO faça)

- ❌ Gradientes coloridos
- ❌ Glassmorphism / blur effects exagerados
- ❌ Ícones de balança, martelo, livros antigos
- ❌ Foto de aperto de mão / advogado em pé com toga
- ❌ Stock photos genéricas
- ❌ Card hover com transform scale(1.05)
- ❌ Headline tipo "Excelência em soluções jurídicas"
- ❌ Bullet points genéricos com emoji
- ❌ Botão CTA grande "FALE CONOSCO" laranja
- ❌ Cores neon / acid / vibrante
- ❌ Layout em três colunas iguais "nossos valores"

### 7.7. Inspirações de referência

- **Wachtell, Lipton, Rosen & Katz** (wlrk.com) — densidade institucional, sem firulas
- **Sullivan & Cromwell** (sullcrom.com) — autoridade tipográfica
- **Mattos Filho** (mattosfilho.com.br) — referência brasileira moderna
- **The Browser Company** (thebrowser.company) — tipografia opinada, layouts editoriais
- **Are.na** (are.na) — densidade, tratamento de texto e arquivo
- **Cabinet** (cabinet.is) — restraint e tratamento bureau

---

## 8. STACK TÉCNICO

- **Framework:** Next.js 14 (App Router) com TypeScript
- **Estilo:** Tailwind CSS 3.4+ (configurar fontes via `next/font/google`)
- **Animação:** Framer Motion 11+ (uso restrito)
- **Ícones:** Lucide React (uso mínimo)
- **Deploy:** GitHub Pages — exportação estática (`output: 'export'`)
- **Sem backend.** Formulário de contato é mock (mostra estado de envio, mas não envia de verdade).

---

## 9. SEO e acessibilidade

- Meta title e description únicos por página
- Open Graph com cover image gerada (escolher uma cor sólida nanquim ou marfim + logo)
- Schema.org `LegalService` no JSON-LD da home
- Alt text em todas as imagens
- Contraste mínimo 4.5:1 (paleta já está calibrada)
- Foco visível em todos os elementos interativos
- `prefers-reduced-motion` respeitado (sem animações)
- Lighthouse target: 95+ em todas as categorias
