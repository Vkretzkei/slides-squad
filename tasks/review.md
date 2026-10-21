---
task: review()
responsavel: "@stage-qa"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: decks
    tipo: html
    origem: "<projeto>/*.html"
    obrigatorio: true
  - campo: deck_plan
    tipo: markdown
    origem: "brief/deck-plan.md"
    obrigatorio: true

Saida:
  - campo: relatorio_qa
    tipo: markdown
    destino: "<projeto>/brief/qa-report.md"
    persistido: true

Checklist:
  - "[ ] Screenshot de todos os slides de todos os decks, depois das animações"
  - "[ ] checklists/output-quality.md preenchido"
  - "[ ] checklists/show-readiness.md preenchido"
  - "[ ] Críticos corrigidos e re-testados"
---

# Task: Revisão (QA) e Ensaio Técnico

**Task ID:** SLIDES-007
**Comando:** `*revisar`
**Agente:** Stage QA

---

## Passo 1 — Screenshots automáticos (principal)

```bash
python scripts/snapshot.py "<projeto>"
```

Abre cada slide pelo arquivo (file://, como no evento) num Chrome/Edge headless, no estado final
(modo `?snap`: animações concluídas e todos os builds revelados), e salva `brief/qa/<deck>-NN.png`
e uma folha de contato `brief/qa/<deck>-contato.png`. **Leia cada PNG em resolução real**, não só a folha.

## Passo 1b — Navegador interativo (animações e operação)

```bash
python -m http.server 8000 --directory "<projeto>"
```

Abra `http://localhost:8000/<deck>.html#1` para conferir o movimento e a operação.

> Navegador embutido oculto/em segundo plano pausa animações: se um slide aparecer vazio, interaja (tecla) e tire o screenshot de novo antes de registrar defeito.

## Passo 2 — Slide a slide

Para cada PNG do Passo 1 (e, para movimento, no navegador). Registrar defeitos segundo `agents/stage-qa.md` (severidade CRÍTICO/AJUSTE).

Busque especificamente:
1. Texto vazando ou quebrando no meio da palavra
2. Título invadindo a coluna vizinha (comum em títulos longos com fonte grande)
3. Elementos sobrepostos ou colados
4. Texto diferente do deck-plan
5. Slot de mídia vazio (sem mídia e sem fallback)
6. Contraste fraco
7. Títulos do mesmo padrão em posições diferentes

## Passo 3 — Ensaio técnico

- Todas as teclas de `agents/stage-qa.md`
- `?presenter` em outra janela + deck normal: avançar num, o outro acompanha
- `data-step`: builds avançam na ordem
- Abrir pelo arquivo (file://) e conferir fonte/logos/animações
- Console: sem erro de JS (404 de mídia ausente é esperado)

## Passo 4 — Corrigir e re-testar

Críticos voltam para o deck-builder; re-testar só os slides alterados. Repetir até zerar críticos.

## Passo 5 — Veredito

Preencher os dois checklists e escrever `qa-report.md` com: decks, nº de slides, defeitos encontrados/corrigidos, pendências (ex.: mídias que o cliente ainda vai mandar), veredito.
