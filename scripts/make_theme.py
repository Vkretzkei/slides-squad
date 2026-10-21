#!/usr/bin/env python3
"""Gera assets/theme.css a partir de brand-tokens.yaml.

Uso:
    python scripts/make_theme.py brief/brand-tokens.yaml assets/theme.css

Lê um YAML simples de 2 níveis (o formato de templates/brand-tokens.yaml) sem
depender de PyYAML. Se existir assets/font.css (gerado por fetch_font.py), ele
é importado; senão, usa fonte.arquivo do tokens.
"""
import re
import sys
from pathlib import Path

try:  # acentos no console do Windows
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def parse_simple_yaml(text):
    data, section = {}, None
    for raw in text.splitlines():
        line = raw.split(" #", 1)[0].rstrip() if not raw.lstrip().startswith("#") else ""
        if not line.strip():
            continue
        indent = len(line) - len(line.lstrip())
        m = re.match(r'\s*([\w-]+):\s*(.*)$', line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        val = val.strip('"').strip("'")
        if indent == 0:
            if val:
                data[key] = val
                section = None
            else:
                section = data.setdefault(key, {})
        elif section is not None:
            section[key] = val
    return data


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    t = parse_simple_yaml(src.read_text(encoding="utf-8"))
    fonte, cores = t.get("fonte", {}), t.get("cores", {})
    brilhos, grad, forma = t.get("brilhos", {}), t.get("texto_gradiente", {}), t.get("forma", {})

    lines = [f"/* Tema gerado de {src.name} — {t.get('marca', {}).get('nome', '')} */"]
    font_css = out.parent / "font.css"
    family = fonte.get("familia", "")
    display = fonte.get("display", "")
    if font_css.exists():
        lines.append('@import url("font.css");')
    else:
        if family and fonte.get("arquivo"):
            lines.append(f'@font-face {{ font-family: "{family}"; src: url("{fonte["arquivo"]}") format("woff2"); font-weight: 100 900; font-display: block; }}')
        if display and fonte.get("display_arquivo"):
            lines.append(f'@font-face {{ font-family: "{display}"; src: url("{fonte["display_arquivo"]}") format("woff2"); font-weight: 100 900; font-display: block; }}')

    def v(d, k, default):
        return d.get(k) or default

    lines.append("")
    lines.append(":root {")
    if family:
        lines.append(f'  --font: "{family}", system-ui, sans-serif;')
    if display:
        lines.append(f'  --font-display: "{display}", var(--font);')
    mapping = [
        ("--bg", cores, "bg", "#05060c"), ("--bg-deep", cores, "bg_deep", "#02030a"),
        ("--ink", cores, "ink", "#ffffff"), ("--muted", cores, "muted", "rgba(255,255,255,.62)"),
        ("--faint", cores, "faint", "rgba(255,255,255,.14)"),
        ("--brand-1", cores, "brand_1", "#3355ff"), ("--brand-2", cores, "brand_2", "#2a8cff"),
        ("--brand-3", cores, "brand_3", "#22c1ff"), ("--accent", cores, "accent", "#a98bff"),
        ("--on-brand", cores, "on_brand", "#ffffff"),
        ("--glow", brilhos, "glow", "34 193 255"), ("--glow-2", brilhos, "glow_2", "51 85 255"),
        ("--glow-3", brilhos, "glow_3", "169 139 255"),
        ("--radius", forma, "raio", "26px"), ("--pad-x", forma, "pad_x", "96px"),
    ]
    for var, d, k, default in mapping:
        lines.append(f"  {var}: {v(d, k, default)};")
    if grad:
        lines.append(f"  --grad-text: linear-gradient(100deg, {v(grad, 'inicio', '#7aa8ff')} 0%, {v(grad, 'meio', '#5cc8ff')} 60%, {v(grad, 'fim', '#9fe3ff')} 100%);")
    lines.append("}")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Tema escrito em {out}")


if __name__ == "__main__":
    main()
