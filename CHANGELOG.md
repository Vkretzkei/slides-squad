# Changelog

## 1.0.0 — 2026-10-21

Primeira versão, a partir do projeto-piloto INside 2026.

- 9 agentes: Stage Director (chefe), Nancy Duarte, Garr Reynolds, Brand Decoder, Art Director, Motion Designer, LED Engineer, Deck Builder, Stage QA
- 10 tasks, 2 workflows (deck de evento completo, slide rápido), 2 checklists (qualidade, prontidão para o show)
- Motor de slides com tokens de marca, palco de tamanho configurável, builds por clique (`data-step`), modo apresentador sincronizado entre janelas, tela preta, guia de área segura, avanço automático e loop, texto palavra a palavra, contagem regressiva, wake lock em tela cheia
- 15 padrões de slide com galeria navegável
- 9 visualizações em canvas como fallback de mídia (nuvem de pontos, 360°, drone, sobreposição, volume, vídeo, dashboard, rede, onda)
- Scripts: new_deck, prepare_logo (branco, símbolo/assinatura, extração de fundo colorido), extract_palette, fetch_font (offline), make_theme, snapshot (QA headless com modo `?snap`)

### Aprendizados do piloto incorporados

- Títulos longos em coluna estreita vazavam → coluna de feature 540px, título 76px, item no QA
- Texto centralizado cruzava o arco de luz → regra de `data-horizon` documentada (low para conteúdo centralizado)
- Briefing com títulos duplicados e instrução contraditória → intake procura ativamente e transforma em pergunta/premissa
- Navegador embutido em segundo plano pausa animações → QA re-interage antes de registrar slide vazio
