#!/usr/bin/env python3
"""Baixa uma fonte do Google Fonts (woff2) para uso offline e escreve font.css.

Uso:
    python scripts/fetch_font.py "Outfit" <projeto>/assets
    python scripts/fetch_font.py "Playfair Display" <projeto>/assets --weights 400,700

Tenta primeiro a versão variável (um arquivo para todos os pesos). Se a família
não for variável, baixa os pesos pedidos (padrão 300,400,500,600,700).
Baixa os subconjuntos latin e latin-ext (acentos do português estão no latin).
"""
import argparse
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

try:  # acentos no console do Windows
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def fetch_css(family, axis):
    url = f"https://fonts.googleapis.com/css2?family={urllib.parse.quote(family)}:{axis}&display=block"
    try:
        return get(url).decode("utf-8")
    except urllib.error.HTTPError:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("family")
    ap.add_argument("outdir")
    ap.add_argument("--weights", default="300,400,500,600,700")
    ap.add_argument("--subsets", default="latin,latin-ext")
    a = ap.parse_args()

    css = fetch_css(a.family, "wght@100..900") or fetch_css(a.family, "wght@" + a.weights.replace(",", ";"))
    if not css:
        sys.exit(f"Fonte '{a.family}' não encontrada no Google Fonts.")

    out = Path(a.outdir)
    out.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", a.family.lower()).strip("-")
    wanted = set(a.subsets.split(","))
    faces = []
    for subset, block in re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*{[^}]+})", css):
        if subset not in wanted:
            continue
        src = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
        weight = re.search(r"font-weight:\s*([^;]+);", block).group(1).strip()
        style = re.search(r"font-style:\s*([^;]+);", block).group(1).strip()
        urange = re.search(r"unicode-range:\s*([^;]+);", block)
        name = f"{slug}-{weight.replace(' ', '-')}-{subset}.woff2"
        (out / name).write_bytes(get(src))
        face = (f'@font-face {{ font-family: "{a.family}"; font-style: {style}; font-weight: {weight}; '
                f'font-display: block; src: url("{name}") format("woff2");')
        if urange:
            face += f" unicode-range: {urange.group(1).strip()};"
        faces.append(face + " }")
        print(f"baixado {name}")
    if not faces:
        sys.exit("Nenhum arquivo baixado (subconjuntos não encontrados).")
    (out / "font.css").write_text("\n".join(faces) + "\n", encoding="utf-8")
    print(f"font.css escrito em {out} — make_theme.py vai importá-lo automaticamente.")


if __name__ == "__main__":
    main()
