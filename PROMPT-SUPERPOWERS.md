# PROMPT PARA `/superpowers:brainstorming`

> Cole o conteúdo abaixo (entre as linhas tracejadas) como resposta inicial ao comando `/superpowers:brainstorming`.
> Os arquivos BRIEFING.md e WIREFRAMES.md já estão na pasta — o Claude Code vai ler quando você referenciar com `@`.

---

Vou construir o site institucional do **Vasconcelos & Pires Advogados Associados** — um escritório boutique fictício de direito empresarial em São Paulo. Este é o quinto projeto do portfólio da minha agência (Nuvvo Studio) e ele precisa estar visualmente em outro patamar dos anteriores.

**Stack obrigatório:**
- Next.js 14 (App Router) com TypeScript
- Tailwind CSS (configurar tudo via tokens em tailwind.config)
- Framer Motion (uso restrito)
- Deploy estático em GitHub Pages (`output: 'export'` no next.config)

**Documentação completa:** leia primeiro estes dois arquivos na pasta atual:
- `@BRIEFING.md` — posicionamento, mock content completo, sistema visual, paleta, tipografia, signature element, anti-padrões
- `@WIREFRAMES.md` — wireframes ASCII de todas as 9 páginas, com notas de comportamento

**Posicionamento estético em uma linha:** autoridade silenciosa de escritório de direito empresarial brasileiro, em formato editorial denso, com tratamento tipográfico que evoca pareceres jurídicos clássicos — sem nenhum clichê de advocacia.

**O que NÃO quero (anti-padrões críticos):**
- Paleta cream + terracota (é o default AI atual — está vetada)
- Hero genérico "Excelência em soluções jurídicas"
- Ícones de balança, martelo, livros antigos
- Stock photos de aperto de mão
- Cards com hover scale(1.05)
- Botão CTA grande laranja
- Gradientes coloridos
- Numeração decorativa 01/02/03

**Signature element não-negociável:** seção "Pareceres" — artigos jurídicos com tratamento tipográfico distintivo (numeração lateral de parágrafos, citações com filete bordô, header formal "Parecer Nº xxx/AAAA"). Detalhamento completo está no BRIEFING.md seção 7.4.

**Princípio de design:** densidade informacional > espaço em branco vazio. O leitor é CEO/CFO/General Counsel — espera substância, não teatro.

**O que preciso que você faça neste brainstorm:**

1. Leia BRIEFING.md e WIREFRAMES.md por completo
2. Faça as perguntas de esclarecimento que ainda fizerem sentido depois da leitura (não me pergunte sobre coisas já cobertas nos documentos)
3. Produza um plano de design conforme metodologia do plugin: token system de cor, type system, layout concept, signature element
4. Faça a auto-crítica do plano: ele soa específico para escritório de direito empresarial brasileiro ou poderia ser de qualquer escritório? Revise o que estiver genérico.
5. NÃO comece a codar nada nesta etapa — apenas o plano

Após eu aprovar o plano, vou rodar `/frontend-design:frontend-design` para a execução.

---
