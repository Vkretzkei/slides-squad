---
task: choreographMotion()
responsavel: "@motion-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: deck_plan
    tipo: markdown
    origem: "brief/deck-plan.md"
    obrigatorio: true

Saida:
  - campo: partitura
    tipo: markdown
    destino: "seção 'Coreografia' do deck-plan.md"
    persistido: true

Checklist:
  - "[ ] Cada slide com ordem de entrada, animação, atraso, duração e gatilho"
  - "[ ] Slides auto-montados terminam em ≤ 5s; o resto usa data-step"
  - "[ ] Momento-chave tem a animação mais forte do deck, e só ele"
  - "[ ] Nada pisca mais de 3x por segundo"
---

# Task: Coreografia de Movimento

**Task ID:** SLIDES-004
**Comando:** `*coreografar`
**Agente:** Motion Designer
**Objetivo:** A partitura de animação de cada slide, usando a biblioteca do motor.

---

## Passo 1 — Gatilho por slide

Com base no briefing (`controle_do_apresentador`):
- **auto**: tudo entra sozinho com atrasos (`data-in` + `--d`)
- **clique**: partes entram a cada clique (`data-step="1..n"` + `data-step-label`)
- **misto**: título auto, partes por clique (padrão recomendado para explicações)

## Passo 2 — Partitura

Para cada slide, tabela:

| Ordem | Elemento | --anim | --d | --dur | Gatilho |
|-------|----------|--------|-----|-------|---------|
| 1 | eyebrow | rise | .2s | 1.1s | auto |
| 2 | título | slide-l | .35s | 1.1s | auto |
| 3 | card 1..4 | card-in | .9s + .2s×n | 1s | auto |

Nomes válidos em `data/motion-library.yaml`. Regras em `agents/motion-designer.md`.

## Passo 3 — Transições e fundo

- `data-transition` por slide (fade padrão)
- `data-horizon` por slide quando o fundo tem horizonte (hero na abertura, low em slides de tese, off em conteúdo denso)
- Mudanças de horizonte entre slides consecutivos criam movimento de "câmera": use com intenção

## Passo 4 — Abertura e loops

- Abertura: logo com `icon-in` + `word-in` + `shine`, partículas, tagline com atraso ≥ 2s
- Loops de espera: `data-auto` em slides que giram sozinhos + `<body data-loop>`; movimento lento contínuo

## Passo 5 — Revisão

Some o maior `--d + --dur` de cada slide auto. Se passar de 5s, converta o final em build por clique ou acelere.
