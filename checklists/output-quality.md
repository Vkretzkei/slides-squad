# Checklist de Qualidade Visual e de Conteúdo

**Checklist ID:** SLIDES-CL-001
**Referenciado por:** tasks/review.md
**Objetivo:** Validar que cada deck está fiel ao pedido, à marca e legível no telão.

[[LLM: INSTRUÇÕES

1. Preencha com base nos SCREENSHOTS de cada slide, não no código.
2. Marque [x] Passa, [ ] Falha, [N/A].
3. Itens (CRÍTICO) bloqueiam a entrega.]]

---

## 1. Fidelidade ao pedido

- [ ] Todos os decks e slides pedidos existem, na ordem pedida (CRÍTICO)
- [ ] Textos do cliente idênticos ao briefing/deck-plan (CRÍTICO)
- [ ] Animações pedidas explicitamente estão implementadas (ex.: "equação se montando") (CRÍTICO)
- [ ] Textos sugeridos pelo squad estão listados para o usuário conferir
- [ ] Ambiguidades do briefing foram resolvidas e comunicadas

## 2. Identidade visual

- [ ] Paleta, fonte e logos batem com as artes do evento (CRÍTICO)
- [ ] Logo sem distorção, sem fundo indevido, versão correta (CRÍTICO)
- [ ] Motivo visual das artes repetido no deck
- [ ] O deck parece da mesma família das artes/landing page lado a lado

## 3. Legibilidade (telão)

- [ ] Nenhum texto vazado, cortado ou quebrado no meio da palavra (CRÍTICO)
- [ ] Nenhum elemento sobreposto a outro sem intenção (CRÍTICO)
- [ ] Texto essencial ≥ 22px no palco de 1080 de altura (ou mínimo calculado pelo led-engineer) (CRÍTICO)
- [ ] Contraste do texto principal alto (≥ 7:1 recomendado), secundário ≥ 4.5:1
- [ ] Cada slide passa no teste de 3 segundos (uma ideia, um elemento dominante)
- [ ] Margens seguras respeitadas (nada essencial nos 5% das bordas)

## 4. Composição e consistência

- [ ] Slides do mesmo padrão com título na mesma posição e mesma escala
- [ ] Espaçamentos consistentes (gaps de cards iguais, margens iguais)
- [ ] Uma cor de destaque por slide; gradiente só no herói
- [ ] Ícones do mesmo estilo (traço, mesmo peso)

## 5. Movimento

- [ ] Ordem de entrada segue a ordem de leitura
- [ ] Slides auto-montados completam em ≤ 5s
- [ ] Estado final (parado) de cada slide está limpo
- [ ] Nada pisca mais de 3x por segundo (CRÍTICO)
- [ ] Builds por clique (se houver) avançam na ordem certa

## 6. Mídia

- [ ] Cada espaço de mídia mostra mídia real ou fallback animado — nunca vazio (CRÍTICO)
- [ ] Nomes de arquivo esperados listados no LEIA-ME
- [ ] Vídeos tocam mudos, em loop, reiniciando ao entrar no slide

---

## Critério

**APROVADO:** todos os CRÍTICOS [x] e até 2 falhas não críticas.
**REVISAR:** CRÍTICOS ok, 3+ falhas não críticas.
**REPROVADO:** qualquer CRÍTICO em aberto.
