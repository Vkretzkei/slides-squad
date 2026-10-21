---
task: intakeBriefing()
responsavel: "@stage-director"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: pedido
    tipo: string
    origem: User Input
    obrigatorio: true
  - campo: materiais
    tipo: arquivos/links
    origem: User Input
    obrigatorio: false

Saida:
  - campo: briefing
    tipo: yaml
    destino: "<projeto>/brief/briefing.yaml"
    persistido: true

Checklist:
  - "[ ] Todo material recebido foi aberto e inventariado"
  - "[ ] Campos obrigatórios preenchidos ou com premissa declarada"
  - "[ ] Contradições e erros de digitação do pedido viraram pergunta ou premissa"
  - "[ ] Usuário confirmou o briefing (ou disse 'segue')"
---

# Task: Intake do Briefing

**Task ID:** SLIDES-001
**Comando:** `*novo` / `*briefing`
**Agente:** Stage Director
**Objetivo:** Transformar o pedido (texto + artes + links) num `briefing.yaml` completo, perguntando só o que falta.

---

## Passo 1 — Ler tudo antes de perguntar

1. Abra cada imagem enviada e descreva para si: tipo (post, save the date, banner, e-mail), cores, fonte aparente, composição, textos.
2. Liste os arquivos de pastas indicadas (logos, artes, e-mail).
3. Abra cada link no navegador. Da landing page, colete: nome do evento, data, hora, formato (online/presencial), tagline, seções, e o efeito visual de destaque.
4. Separe o pedido em **decks** e **slides**. Para cada slide anote: título pedido, conteúdo pedido, animação pedida, mídia pedida.

## Passo 2 — Detectar lacunas e problemas

Marque cada item de `templates/briefing.yaml`:
- ✅ veio no pedido
- 🟡 dá para inferir (anote a premissa)
- ❌ falta e muda o resultado → vira pergunta

Procure ativamente:
- Títulos duplicados entre slides (ex.: dois slides "Ângulo de visão drone 360" com descrições diferentes)
- Instrução que contradiz a si mesma (ex.: "entra só a parte de REFERÊNCIA" num slide que é de EVIDÊNCIA)
- Mídia citada que não foi enviada (vídeos, imagens reais)
- Texto com cara de rascunho que o cliente talvez queira revisar

## Passo 3 — Perguntar em bloco (elicitação)

Faça **uma** rodada de perguntas, no máximo 6, só com os ❌. Ofereça a premissa padrão em cada uma para o usuário poder responder "pode seguir". Perguntas típicas:

1. **Telão:** resolução ou proporção do LED/TV/projetor? *(padrão: 16:9, 1920x1080)*
2. **Controle:** o apresentador vai usar passador e quer revelar partes por clique, ou as animações rodam sozinhas? *(padrão: rodam sozinhas; builds longos por clique)*
3. **Mídias:** os vídeos/GIFs/imagens das features já existem? *(padrão: espaço reservado com animação ilustrativa + nomes de arquivo)*
4. **Textos de apoio:** posso sugerir subtítulos/descrições curtas onde o pedido só tem título? *(padrão: sim, marcados como sugestão)*
5. **Ambiguidades** encontradas no Passo 2, uma por linha, com a interpretação proposta.
6. **Formato extra:** precisa de versão PDF/PPTX ou só o HTML animado? *(padrão: só HTML)*

> Se o usuário mandou tudo e não há ❌, não pergunte: declare as premissas e siga.

## Passo 4 — Escrever o briefing

Copie `templates/briefing.yaml` para `<projeto>/brief/briefing.yaml` e preencha. Cada premissa vai em `premissas:` com o motivo.

## Passo 5 — Confirmar

Mostre um resumo curto (evento, decks, nº de slides, telão, premissas) e siga para `tasks/decode-brand.md`. Não peça confirmação de novo se o usuário já respondeu as perguntas.

---

## Pasta do projeto

Se o usuário não indicar onde salvar, crie `<pasta de trabalho>/<nome-do-evento>-slides/`.
