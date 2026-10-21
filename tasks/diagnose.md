---
task: diagnose()
responsavel: "@stage-director"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: demanda
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: rota
    tipo: string
    destino: Console
    persistido: false

Checklist:
  - "[ ] Tipo de demanda identificado"
  - "[ ] Workflow ou task escolhido e anunciado"
---

# Task: Diagnóstico

**Task ID:** SLIDES-000
**Comando:** `*help` / entrada livre
**Agente:** Stage Director

---

## Classificar

| Demanda | Rota |
|---|---|
| Deck(s) completo(s) para evento, com briefing e artes | `workflows/wf-event-deck.yaml` |
| Um slide, vinheta, abertura com logo, fundo/loop de espera, contagem regressiva | `workflows/wf-quick-slide.yaml` |
| Ajuste num deck já feito | `tasks/iterate.md` |
| Só quer o roteiro/estrutura da apresentação | `tasks/intake-briefing.md` → `tasks/plan-deck.md` |
| Só quer extrair identidade/tema | `tasks/decode-brand.md` |
| Revisar um deck pronto (deste squad ou não) | `tasks/review.md` |
| Arquivo PowerPoint/Keynote/Google Slides como entregável | Avisar: este squad entrega HTML animado. Exportação para .pptx perde animações; se o usuário insistir, encaminhar para a skill de pptx do ambiente usando o deck-plan como fonte |
| Copy de vendas, campanha, tráfego | Fora do escopo deste squad — dizer isso ao usuário |

## Anunciar

Uma linha: "Demanda: X → vou seguir Y. Premissa: Z." e começar.
