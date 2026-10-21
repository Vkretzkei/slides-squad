---
task: iterate()
responsavel: "@stage-director"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: pedido_de_ajuste
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: decks_atualizados
    tipo: html
    destino: "<projeto>/*.html"
    persistido: true

Checklist:
  - "[ ] Pedido classificado (texto, layout, animação, marca, técnico)"
  - "[ ] Mudança aplicada no lugar certo (slide, tema ou motor)"
  - "[ ] deck-plan atualizado"
  - "[ ] Slides alterados re-testados com screenshot"
---

# Task: Ajustes em Deck Existente

**Task ID:** SLIDES-009
**Comando:** `*ajuste`
**Agente:** Stage Director → especialista conforme o tipo

---

## Classificar e rotear

| Tipo de pedido | Onde mexer | Agente |
|---|---|---|
| Trocar texto, título, ordem | HTML do slide + deck-plan | deck-builder |
| "Está poluído", "muito texto" | Roteiro → slide | garr-reynolds → deck-builder |
| Cor, fonte, logo | brand-tokens → theme.css | brand-decoder |
| Layout, tamanho, alinhamento | Slide (ou padrão, se repetido) | art-director → deck-builder |
| Animação mais rápida/lenta, por clique | Partitura → atributos | motion-designer → deck-builder |
| Telão diferente, operação | data-w/h, LEIA-ME | led-engineer |
| Mídia nova chegou | Salvar em media/ com o nome combinado | deck-builder (só conferir) |

## Regras

- Mudança que vale para vários slides vai no padrão/tema, não slide a slide.
- Melhoria genérica no motor (bug, recurso novo) vai em `templates/engine/` do squad e é copiada para o projeto; registrar no CHANGELOG do squad.
- Sempre re-testar com screenshot os slides afetados.
- Responder ao usuário com: o que mudou, onde, e o que não foi possível (com motivo).
