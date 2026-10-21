---
task: ledFit()
responsavel: "@led-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: telao
    tipo: objeto
    origem: "briefing.yaml → telao"
    obrigatorio: false

Saida:
  - campo: decks_ajustados
    tipo: html
    destino: "<projeto>/*.html"
    persistido: true

Checklist:
  - "[ ] data-w/data-h do #stage batem com a proporção do telão"
  - "[ ] Tamanhos mínimos de texto respeitados para a distância"
  - "[ ] Nenhum layout quebrado na proporção final"
  - "[ ] Premissas técnicas registradas no deck-plan e no LEIA-ME"
---

# Task: Ajuste para o Telão

**Task ID:** SLIDES-006
**Comando:** `*telao`
**Agente:** LED Engineer
**Referência:** `data/led-specs.yaml`

---

## Passo 1 — Equipamento

Do briefing: resolução do processador/painel, ou tamanho físico + pixel pitch, distância da última fileira, se haverá transmissão/gravação. Sem dados: 16:9 1920x1080, e declarar.

## Passo 2 — Palco

Calcule `data-w`/`data-h`:
- 16:9 → 1920x1080 (padrão)
- Outra proporção → manter `data-h="1080"` e `data-w = round(1080 × largura/altura)`; para painel vertical, `data-w="1080"` e `data-h = round(1080 × altura/largura)`
- Ultra-wide (≥ 3:1) → considerar layout em zonas (ver led-specs `ultrawide`)

## Passo 3 — Layout

Para cada padrão usado, verificar na nova proporção. Ajustes comuns:
- Vertical: `.spotlight`, `.feature`, `.agenda`, `.speaker` → `grid-template-columns: 1fr` via CSS no tema (`#stage[data-w="1080"] .feature { ... }`)
- Ultra-wide: aumentar `--pad-x`, cards em mais colunas, título em zona própria

## Passo 4 — Legibilidade

Tamanho mínimo (px no palco) ≈ `(distância_m / 200) / altura_fisica_m × data-h`. Compare com o menor texto essencial do deck e aumente se necessário.

## Passo 5 — Riscos de LED

- Linhas com função ≥ 2px
- Grid de fundo com opacidade ≤ 6%
- Sem áreas brancas grandes
- Gradientes escuros longos: adicionar `.bg-noise` (dither) se houver banding

## Passo 6 — Registrar

Seção "Telão" no deck-plan + bloco "Formato" no LEIA-ME.
