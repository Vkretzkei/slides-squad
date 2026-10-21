# Checklist de Prontidão para o Show

**Checklist ID:** SLIDES-CL-002
**Referenciado por:** tasks/review.md, tasks/deliver.md
**Objetivo:** Garantir que o operador consegue rodar o deck no dia, sem internet e sem susto.

[[LLM: INSTRUÇÕES
Teste de verdade cada item no navegador. Itens (CRÍTICO) bloqueiam a entrega.]]

---

## 1. Offline e portabilidade

- [ ] Abre com duplo clique no .html (file://), sem servidor (CRÍTICO)
- [ ] Nenhuma requisição externa: fonte, logos, motor e tema dentro de assets/ (CRÍTICO)
- [ ] Nomes de arquivo sem acento e sem caractere especial
- [ ] Pasta copiada para outro lugar continua funcionando (caminhos relativos)

## 2. Operação

- [ ] → / Espaço / Enter / PageDown / clique avançam (CRÍTICO)
- [ ] ← / PageUp / botão direito voltam (CRÍTICO)
- [ ] F entra/sai de tela cheia
- [ ] B tela preta e volta (CRÍTICO)
- [ ] R repete a animação do slide atual
- [ ] Números 1-9, Home, End navegam
- [ ] Cursor some sozinho após 2s
- [ ] G mostra guia de área segura
- [ ] H mostra ajuda

## 3. Modo apresentador

- [ ] P (ou ?presenter) abre janela com notas, cronômetro, próximo slide
- [ ] Avançar no apresentador avança o telão e vice-versa
- [ ] Notas de todos os slides preenchidas (se o deck-plan pediu)

## 4. Telão

- [ ] Proporção do palco (data-w/data-h) confirmada ou assumida e declarada (CRÍTICO)
- [ ] Testado em janela na proporção final sem cortes
- [ ] Sem grandes áreas brancas; linhas funcionais ≥ 2px

## 5. Documentação

- [ ] LEIA-ME com: abrir, teclas, apresentador, formato, nomes de mídia, spec de vídeo, como editar texto (CRÍTICO)
- [ ] Pendências (mídias, dados do telão) listadas para o usuário

---

## Critério

**PRONTO:** todos os CRÍTICOS [x].
**NÃO PRONTO:** qualquer CRÍTICO em aberto.
