---
task: buildDeck()
responsavel: "@deck-builder"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: deck_plan
    tipo: markdown
    origem: "brief/deck-plan.md"
    obrigatorio: true
  - campo: theme
    tipo: css
    origem: "assets/theme.css"
    obrigatorio: true

Saida:
  - campo: decks
    tipo: html
    destino: "<projeto>/*.html"
    persistido: true

Checklist:
  - "[ ] Estrutura criada por scripts/new_deck.py"
  - "[ ] Textos idênticos ao deck-plan"
  - "[ ] Cada slide aberto no navegador ao menos uma vez"
  - "[ ] Funciona abrindo o arquivo direto, sem servidor"
---

# Task: Construir os Decks

**Task ID:** SLIDES-005
**Comando:** `*construir`
**Agente:** Deck Builder
**Objetivo:** Decks HTML animados, offline, a partir do deck-plan aprovado.

---

## Passo 1 — Estrutura

```bash
python scripts/new_deck.py "<projeto>" --decks "PPT1 - Nome" "PPT2 - Nome" --title "Nome do Evento"
```

Cria `<projeto>/` com um HTML inicial por deck, `assets/` com o motor, `media/`, `LEIA-ME.txt`. Não sobrescreve arquivos existentes sem `--force`.

## Passo 2 — Marca

Coloque em `assets/`: `theme.css`, fonte woff2, logos preparados. Ajuste no HTML: `.chrome .brand` (logo do evento), `.chrome .partner` (realização/parceiro), texto do `.foot`.

## Passo 3 — Slides

Para cada linha do deck-plan:
1. Copie o bloco do padrão em `templates/patterns/gallery.html` (cada padrão está entre comentários `PADRÃO: nome`).
2. Troque os textos pelos do deck-plan (exatos).
3. Aplique a partitura: `data-in`, `--d`, `--anim`, `--dur`, `data-step`.
4. Configure `data-title`, `data-horizon`, `data-chrome`, `data-transition`.
5. Escreva as notas em `<aside class="notes" hidden>`.
6. Mídias: `.slot[data-src="media/NN-nome"]` com fallback `data-viz` adequado e `drop-hint`.

## Passo 4 — Ícones

SVG inline de traço, viewBox 24x24, `stroke-width` herdado do motor. Desenhe ícones simples e consistentes; não use logos de marcas de terceiros (WhatsApp, Instagram etc.) como ícone — use um ícone genérico (balão de conversa) com o nome escrito.

## Passo 5 — Preview

Rode `python scripts/snapshot.py "<projeto>"` e olhe a folha de contato para pegar o grosso antes do QA. Para conferir o movimento:

```bash
python -m http.server 8000 --directory "<projeto>"
```

Abra cada deck, percorra com → e corrija o óbvio. Depois abra um deck direto pelo arquivo para confirmar que roda sem servidor.

## Passo 6 — Passar para o LED Engineer e o Stage QA

Se a proporção não é 16:9, rode `tasks/led-fit.md` antes do QA.
