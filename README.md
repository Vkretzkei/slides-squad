# Slides Squad — Palco & Telão 🎬

Squad de agentes que transforma **briefing + artes do evento + logos + landing page** em **apresentações animadas para telão LED, TV ou projetor** — no estilo da marca, rodando offline, prontas para operar ao vivo.

É uma Agent Skill independente: funciona no Claude Code e em qualquer cliente que leia skills.

---

## Como usar

Ative o squad e mande o pedido do jeito que você mandaria para uma agência:

```
/slides-squad Quero slides animados para o telão do evento. Seguem as artes e a landing page.

Landing page: https://exemplo.com/evento
Artes e logos: C:\caminho\para\Comunicação

PPT 1 — 5 slides para o LED durante a palestra:
1. logo animado (abertura e fundo do evento)
2. a equação completa se montando: RELATOS + REFERÊNCIAS + EVIDÊNCIAS → DECISÃO
3. relato — só essa parte entrando, com exemplos: RDO, checklist, WhatsApp, reunião
...
```

O **Stage Director** conduz o resto:

| Fase | Quem | O que sai |
|---|---|---|
| 1. Intake | Stage Director | `brief/briefing.yaml` — pergunta só o que falta (telão, controle, mídias) |
| 2. Identidade | Brand Decoder | `theme.css`, fonte offline, logos em branco/símbolo/assinatura |
| 3. Roteiro | Nancy Duarte → Garr Reynolds → Art Director | `brief/deck-plan.md` para você aprovar |
| 4. Coreografia | Motion Designer | Partitura de animação de cada slide |
| 5. Construção | Deck Builder | Decks `.html` no motor do squad |
| 6. Telão | LED Engineer | Proporção, legibilidade, riscos de LED |
| 7. QA | Stage QA | Screenshot de cada slide + ensaio técnico |
| 8. Entrega | Stage Director | Pasta pronta + `LEIA-ME.txt` para o operador |

### Comandos

`*novo` · `*briefing` · `*marca` · `*roteiro` · `*construir` · `*telao` · `*revisar` · `*entregar` · `*ajuste` · `*slide-rapido` · `*help` · `*exit`

---

## O motor de slides

`templates/engine/` — HTML/CSS/JS puro, sem dependências, roda com duplo clique.

| Recurso | Como |
|---|---|
| Escala para qualquer tela | Palco fixo (`data-w`/`data-h`, padrão 1920x1080) |
| Navegação | → ← Espaço PageDown/PageUp (passadores), clique, 1-9, Home/End |
| Builds por clique | `data-step="1"` em qualquer elemento |
| Modo apresentador | Tecla **P**: notas, cronômetro, próximo slide; sincroniza com o telão |
| Emergência | **B** tela preta · **R** repete animação |
| Alinhamento no LED | **G** guia de área segura |
| Mídia | `media/<nome>.mp4\|gif\|png…` carrega sozinho; sem arquivo, mostra animação ilustrativa |
| Fundos | horizonte de luz, grid, feixe, aurora, granulado |
| 15 padrões | abertura com logo, frase, equação, equação com foco, holofote, painel, cards de mídia, feature, número, agenda, palestrante, citação, linha do tempo, contagem, encerramento |

Abra `templates/patterns/gallery.html` para ver todos os padrões funcionando.

---

## Instalação

### Jeito fácil: cole este prompt no Claude Code

```
Instale o Slides Squad no meu computador para eu usar em qualquer chat ou projeto do Claude Code, não só numa pasta específica. Siga as instruções do arquivo INSTALAR.md deste repositório: https://github.com/Vkretzkei/slides-squad — Quando eu digitar / quero ver o squad e os agentes para escolher.
```

O Claude baixa o squad para `~/.claude/skills/slides-squad`, instala os atalhos dos agentes em `~/.claude/commands/` e confere tudo. Depois é só abrir uma conversa nova e digitar `/slides`:

| Comando | O que faz |
|---|---|
| `/slides-squad` | Projeto completo, do briefing à entrega (recomendado) |
| `/slides-stage-director` | Chefe do squad |
| `/slides-nancy-duarte` | Narrativa e roteiro |
| `/slides-garr-reynolds` | Simplificar e cortar |
| `/slides-brand-decoder` | Identidade visual a partir das artes |
| `/slides-art-director` | Composição dos slides |
| `/slides-motion-designer` | Animações e builds |
| `/slides-led-engineer` | Telão e operação ao vivo |
| `/slides-deck-builder` | Construir/alterar os decks |
| `/slides-stage-qa` | Revisão visual e ensaio |

Para atualizar depois: peça "atualize o slides-squad".

### Jeito manual

```bash
git clone https://github.com/Vkretzkei/slides-squad ~/.claude/skills/slides-squad
cp ~/.claude/skills/slides-squad/commands/*.md ~/.claude/commands/
pip install pillow   # opcional: scripts de logo, fonte e revisão
```

Funciona no Claude Code (app do Claude na aba Code, terminal ou extensão de IDE).

## Scripts

```bash
python scripts/new_deck.py "<pasta>" --title "Evento" --decks "PPT1 - Abertura" "PPT2 - Produto"
python scripts/prepare_logo.py logo.png <pasta>/assets --name logo-evento --split
python scripts/prepare_logo.py rodape.png <pasta>/assets --name logo-parceiro --from-bg --crop 390,200,640,250
python scripts/extract_palette.py arte1.png arte2.png
python scripts/fetch_font.py "Outfit" <pasta>/assets
python scripts/make_theme.py <pasta>/brief/brand-tokens.yaml <pasta>/assets/theme.css
python scripts/snapshot.py "<pasta>"                   # QA: PNG de cada slide + folha de contato
python scripts/new_deck.py "<pasta>" --update-engine   # atualiza o motor de um projeto antigo
```

## Estrutura

```
slides-squad/
  SKILL.md  squad.yaml  config/
  agents/       9 agentes (stage-director é o chefe)
  tasks/        10 roteiros executáveis
  workflows/    wf-event-deck, wf-quick-slide
  checklists/   output-quality, show-readiness
  data/         slide-patterns, motion-library, led-specs, routing-catalog
  templates/    engine/, patterns/gallery.html, starter/, themes/, modelos de briefing/tokens/plano/LEIA-ME
  scripts/      new_deck, prepare_logo, extract_palette, fetch_font, make_theme
  examples/     inside-2026 (caso real: 2 decks)
```

## Exemplo

`examples/inside-2026/` — dois decks para o telão do INside 2026 (Construct IN): equação da gestão se montando, holofote em cada termo, vitrine de 5 features com espaço para vídeo e retorno à equação com foco em evidência.

## Licença

MIT
