---
task: planDeck()
responsavel: "@art-director"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: briefing
    tipo: yaml
    origem: "brief/briefing.yaml"
    obrigatorio: true
  - campo: brand_tokens
    tipo: yaml
    origem: "brief/brand-tokens.yaml"
    obrigatorio: true

Saida:
  - campo: deck_plan
    tipo: markdown
    destino: "<projeto>/brief/deck-plan.md"
    persistido: true

Checklist:
  - "[ ] Cada slide tem função narrativa, texto exato, padrão, mídia e animação"
  - "[ ] Textos sugeridos pelo squad marcados com (sugestão)"
  - "[ ] Teste de 3 segundos aplicado (garr-reynolds)"
  - "[ ] Usuário aprovou o roteiro ou disse para seguir"
---

# Task: Roteiro do Deck (deck-plan)

**Task ID:** SLIDES-003
**Comando:** `*roteiro`
**Agentes:** Nancy Duarte (arco) → Garr Reynolds (cortes) → Art Director (padrões)
**Objetivo:** Um documento que qualquer pessoa leia e saiba exatamente o que cada slide terá. É o contrato antes do build.

---

## Passo 1 — Arco (Nancy Duarte)

- Big idea em uma frase.
- Função de cada slide: abertura, tese, desdobramento, prova, retorno, fecho.
- Se o usuário já deu a ordem dos slides, **mantenha a ordem**. Sugestões vão numa seção separada "Sugestões do squad".
- Fio entre decks (se houver mais de um): o elemento que se repete.
- Momento memorável (S.T.A.R.) e em qual slide.

## Passo 2 — Cortes (Garr Reynolds)

Para cada slide, conte palavras visíveis e elementos. Proponha cortes; excesso vai para **notas do apresentador**.

## Passo 3 — Padrões e composição (Art Director)

Para cada slide escolha um padrão de `data/slide-patterns.yaml`. Preencha a tabela do modelo `templates/deck-plan.md`:

| # | Função | Padrão | Título (exato) | Conteúdo | Mídia | Fundo/Horizonte | Notas |
|---|--------|--------|----------------|----------|-------|-----------------|-------|

## Passo 4 — Mídias

Para cada mídia: nome de arquivo (`media/NN-nome-em-kebab`), formato recomendado, proporção do espaço, fallback (`data-viz`) enquanto não chega.

## Passo 5 — Aprovação (elicitação)

Mostre ao usuário o deck-plan **resumido** (uma linha por slide) e as premissas/sugestões. Pergunte uma vez: "Posso construir assim?". Ajuste se pedirem.

> Se o usuário já disse "pode fazer direto" no intake, mostre o resumo e siga sem esperar.
