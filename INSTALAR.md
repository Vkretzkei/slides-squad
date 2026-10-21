# Instalação do Slides Squad (instruções para o Claude)

> Este arquivo é para o **Claude** seguir quando alguém pedir para instalar o squad.
> Pessoa usuária: você não precisa ler isto. Basta colar no Claude Code o prompt do README.

## Objetivo

Instalar o Slides Squad **no nível do usuário** (não dentro de um projeto), para que ele funcione em qualquer pasta, chat ou projeto do Claude Code, e que digitar `/` mostre:

- `/slides-squad` — o squad completo (entrada pelo Stage Director)
- `/slides-<agente>` — um atalho para cada agente

## Passos

Execute na ordem. Use o shell disponível (PowerShell no Windows, bash/zsh no Mac/Linux). Explique em uma linha o que está fazendo a cada passo, em português e sem jargão.

### 1. Descobrir a pasta do usuário

- Windows: `$env:USERPROFILE` → pasta de skills `$env:USERPROFILE\.claude\skills`
- Mac/Linux: `$HOME` → pasta de skills `~/.claude/skills`

Crie `.claude/skills` e `.claude/commands` se não existirem. **Nunca** instale dentro da pasta do projeto atual (`./.claude/...`): isso limitaria o squad a uma pasta só.

### 2. Baixar o squad em `~/.claude/skills/slides-squad`

- **Já existe e é um repositório git** → atualize: `git -C <pasta> pull`.
- **Já existe e não é git** → renomeie para `slides-squad.bak-AAAAMMDD` (não apague) e instale de novo.
- **Não existe**:
  - Com git: `git clone https://github.com/Vkretzkei/slides-squad.git <home>/.claude/skills/slides-squad`
  - Sem git: baixe `https://github.com/Vkretzkei/slides-squad/archive/refs/heads/main.zip`, extraia num diretório temporário e mova a pasta `slides-squad-main` para `<home>/.claude/skills/slides-squad`.
    - Windows: `Invoke-WebRequest <url> -OutFile $env:TEMP\slides-squad.zip; Expand-Archive $env:TEMP\slides-squad.zip $env:TEMP\slides-squad-zip -Force`
    - Mac/Linux: `curl -L <url> -o /tmp/slides-squad.zip && unzip -q /tmp/slides-squad.zip -d /tmp/slides-squad-zip`

### 3. Conferir a estrutura

`<home>/.claude/skills/slides-squad/SKILL.md` precisa existir **direto** nessa pasta (não em `slides-squad/slides-squad-main/SKILL.md`). Se estiver aninhado, corrija movendo o conteúdo um nível acima.

### 4. Instalar os atalhos dos agentes

Copie todos os arquivos de `<home>/.claude/skills/slides-squad/commands/*.md` para `<home>/.claude/commands/`.
Sobrescreva só arquivos com prefixo `slides-`; não toque em outros comandos que a pessoa já tenha.

### 5. Ferramentas opcionais (recomendado)

Os scripts do squad (logos, fonte, paleta, revisão por screenshot) usam Python 3.9+ e Pillow.

- Verifique: `python --version` (Mac: `python3 --version`) e `python -c "import PIL"`.
- Python presente e Pillow faltando → `python -m pip install --user pillow`.
- Python ausente → **não instale sozinho**. Diga à pessoa que é opcional e como instalar (python.org/downloads, marcando "Add python.exe to PATH" no Windows) ou ofereça instalar com o gerenciador do sistema se ela autorizar.
- Verifique se há Chrome ou Edge instalado (usado na revisão automática). Só informe; não instale.

### 6. Validar

- Liste `<home>/.claude/skills/slides-squad` e `<home>/.claude/commands/slides-*.md`.
- Confirme que `SKILL.md` começa com `name: slides-squad`.

### 7. Dizer à pessoa o que fazer agora

Mensagem curta, sem jargão:

1. Instalado em `<caminho completo>` e vale para qualquer projeto.
2. **Abra uma conversa nova** (ou reinicie o Claude) para os comandos aparecerem.
3. Digite `/slides` e escolha:
   - `/slides-squad` — começar um projeto completo (recomendado)
   - `/slides-stage-director`, `/slides-nancy-duarte`, `/slides-garr-reynolds`, `/slides-brand-decoder`, `/slides-art-director`, `/slides-motion-designer`, `/slides-led-engineer`, `/slides-deck-builder`, `/slides-stage-qa`
4. Para atualizar no futuro: pedir "atualize o slides-squad" (o Claude roda o passo 2 de novo).
5. Se algo opcional ficou faltando (Python/Pillow), dizer o que é e que não impede o uso.

## Observações

- Skills ficam disponíveis no **Claude Code** (app do Claude na aba Code, terminal, extensões de IDE). O chat comum do claude.ai na web não lê esta pasta.
- Não altere nenhuma outra skill ou configuração da pessoa.
