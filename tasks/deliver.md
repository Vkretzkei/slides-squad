---
task: deliver()
responsavel: "@stage-director"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: projeto
    tipo: pasta
    origem: "<projeto>/"
    obrigatorio: true

Saida:
  - campo: entrega
    tipo: pasta + mensagem
    destino: "<projeto>/ + resposta ao usuário"
    persistido: true

Checklist:
  - "[ ] QA aprovado"
  - "[ ] LEIA-ME com controles, nomes de mídia e formato"
  - "[ ] Pasta autocontida (motor, tema, fonte, logos dentro de assets/)"
  - "[ ] Mensagem final lista premissas, sugestões de texto e pendências"
---

# Task: Entrega

**Task ID:** SLIDES-008
**Comando:** `*entregar`
**Agente:** Stage Director

---

## Passo 1 — Pasta final

```
<projeto>/
  <Deck 1>.html
  <Deck 2>.html
  LEIA-ME.txt
  assets/   (motor + tema + fonte + logos)
  media/    (vazia ou com as mídias do cliente)
  brief/    (briefing, tokens, deck-plan, qa-report — material de trabalho)
```

Nomes de arquivo legíveis para quem vai operar (ex.: `PPT1 - Equacao da Gestao.html`). Evite acentos no nome de arquivo (compatibilidade com pendrive/Windows/Mac).

## Passo 2 — LEIA-ME

Preencher `templates/LEIA-ME.txt` (o new_deck.py já copia): como abrir, teclas, modo apresentador, formato do palco, **tabela de nomes de mídia por deck/slide**, especificação de vídeo, como editar textos.

## Passo 3 — Pacote opcional

Se o usuário pedir: zip da pasta (sem `brief/` se for para o operador do evento).

## Passo 4 — Mensagem ao usuário

Estrutura:
1. O que foi entregue (decks, nº de slides, onde está) com links clicáveis para os arquivos
2. Destaques de cada deck em uma linha por slide
3. Como usar (3 linhas: abrir, F, setas; detalhes no LEIA-ME)
4. **Para conferir**: premissas tomadas, textos sugeridos pelo squad, ambiguidades interpretadas
5. Pendências: mídias que faltam, informações do telão

Sem jargão técnico. O usuário pode não ser dev.
