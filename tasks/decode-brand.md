---
task: decodeBrand()
responsavel: "@brand-decoder"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: briefing
    tipo: yaml
    origem: "brief/briefing.yaml"
    obrigatorio: true

Saida:
  - campo: brand_tokens
    tipo: yaml
    destino: "<projeto>/brief/brand-tokens.yaml"
    persistido: true
  - campo: theme
    tipo: css
    destino: "<projeto>/assets/theme.css"
    persistido: true

Checklist:
  - "[ ] Cores medidas (hex) a partir das artes e/ou CSS da landing page"
  - "[ ] Fonte identificada e baixada em woff2 (ou substituta declarada)"
  - "[ ] Logos em branco/transparente; símbolo e assinatura separados quando possível"
  - "[ ] theme.css gerado e conferido ao lado das artes"
---

# Task: Decodificar a Identidade

**Task ID:** SLIDES-002
**Comando:** `*marca`
**Agente:** Brand Decoder
**Objetivo:** Traduzir o material da marca em tokens e assets prontos para o motor.

---

## Passo 1 — Landing page (se houver)

No navegador, rode no console da página:

```js
const fams = new Set(); document.querySelectorAll('*').forEach(e => fams.add(getComputedStyle(e).fontFamily)); [...fams]
```

e observe o fundo do herói, gradientes, botões e destaques. Anote o "efeito herói" (ex.: arco de luz azul sobre fundo preto) — ele vira motivo.

## Passo 2 — Paleta das artes

```bash
python scripts/extract_palette.py arte1.png arte2.png --n 8
```

Escolha:
- `bg` / `bg-deep`: fundo do deck (escuro para LED, salvo pedido contrário)
- `brand-1..3`: rampa da cor principal (do mais escuro/saturado ao mais claro)
- `accent`: cor secundária usada com parcimônia nas artes
- `glow`, `glow-2`, `glow-3`: as mesmas cores em `R G B` para brilhos

## Passo 3 — Fonte

```bash
python scripts/fetch_font.py "Outfit" <projeto>/assets
```

Se a fonte não está no Google Fonts: procure no material do cliente (pasta de fontes, manual). Se não houver, escolha a mais próxima e registre em `premissas`.

## Passo 4 — Logos

```bash
python scripts/prepare_logo.py logo.png <projeto>/assets --name evento --split
python scripts/prepare_logo.py rodape.png <projeto>/assets --name parceiro --from-bg --crop x0,y0,x1,y1
```

- `--split` separa símbolo e assinatura pelo maior vão vertical (para a abertura animada)
- `--from-bg` extrai logo branco de cima de um fundo colorido (por luminância)
- Confira cada PNG gerado abrindo a imagem

## Passo 5 — Tokens → tema

Preencha `brand-tokens.yaml` (modelo em `templates/brand-tokens.yaml`) e gere:

```bash
python scripts/make_theme.py <projeto>/brief/brand-tokens.yaml <projeto>/assets/theme.css
```

## Passo 6 — Motivos

Liste 2-4 motivos visuais das artes (em `motivos:` no tokens) e qual fundo do motor representa cada um (`bg-horizon`, `bg-grid`, `bg-beam`, `bg-aurora`, `bg-noise`, tag retangular, gradiente). Se nenhum representa, descreva para o Art Director criar.

## Saída para o usuário

Uma tabela curta: token → valor → origem (arte X / landing / premissa).
