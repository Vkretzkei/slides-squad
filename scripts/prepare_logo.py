#!/usr/bin/env python3
"""Prepara logos para os slides: branco com fundo transparente, recorte e separação
em símbolo + assinatura.

Uso:
    # Logo PNG transparente → versão branca + símbolo/assinatura separados
    python scripts/prepare_logo.py logo.png assets --name evento --split

    # Logo branco em cima de fundo colorido (ex.: rodapé de e-mail) → extrai por luminância
    python scripts/prepare_logo.py rodape.png assets --name parceiro --from-bg --crop 390,200,640,250

Saída: <name>.png, e com --split também <name>-icon.png e <name>-word.png.
--keep-color mantém as cores originais (padrão: tudo branco).
--scale N amplia o resultado (útil para logos pequenos; não cria detalhe novo).
"""
import argparse
import sys
from pathlib import Path

from PIL import Image

try:  # acentos no console do Windows
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def alpha_from_bg(im):
    """Logo claro sobre fundo colorido: alfa = quanto o pixel se afasta do fundo em direção ao branco."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    corners = [rgb.getpixel(p) for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]]
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    out = Image.new("RGBA", rgb.size)
    src, dst = rgb.load(), out.load()
    for x in range(w):
        for y in range(h):
            p = src[x, y]
            # distância do fundo projetada no eixo fundo→branco
            num = sum((p[i] - bg[i]) * (255 - bg[i]) for i in range(3))
            den = sum((255 - bg[i]) ** 2 for i in range(3)) or 1
            a = max(0.0, min(1.0, num / den))
            dst[x, y] = (255, 255, 255, int(a * 255))
    return out


def whiten(im):
    im = im.convert("RGBA")
    px = im.load()
    for x in range(im.width):
        for y in range(im.height):
            a = px[x, y][3]
            px[x, y] = (255, 255, 255, a)
    return im


def col_runs(im, thr=20):
    a = im.split()[3]
    w, h = im.size
    filled = [any(a.getpixel((x, y)) > thr for y in range(h)) for x in range(w)]
    runs, start = [], None
    for x, f in enumerate(filled):
        if f and start is None:
            start = x
        if not f and start is not None:
            runs.append((start, x))
            start = None
    if start is not None:
        runs.append((start, w))
    return runs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("outdir")
    ap.add_argument("--name", default="logo")
    ap.add_argument("--from-bg", action="store_true")
    ap.add_argument("--crop", help="x0,y0,x1,y1 no arquivo original")
    ap.add_argument("--split", action="store_true")
    ap.add_argument("--keep-color", action="store_true")
    ap.add_argument("--scale", type=float, default=1.0)
    a = ap.parse_args()

    im = Image.open(a.src)
    if a.crop:
        im = im.crop(tuple(int(v) for v in a.crop.split(",")))
    im = alpha_from_bg(im) if a.from_bg else (im.convert("RGBA") if a.keep_color else whiten(im))
    bbox = im.getbbox()
    if not bbox:
        raise SystemExit("Imagem vazia depois do processamento (logo transparente sobre transparente?)")
    im = im.crop(bbox)
    if a.scale != 1:
        im = im.resize((round(im.width * a.scale), round(im.height * a.scale)), Image.LANCZOS)

    out = Path(a.outdir)
    out.mkdir(parents=True, exist_ok=True)
    im.save(out / f"{a.name}.png")
    print(f"{a.name}.png {im.size}")

    if a.split:
        runs = col_runs(im)
        if len(runs) < 2:
            print("Sem vão vertical para separar símbolo e assinatura — use o logo completo (<img class='full'>).")
            return
        gaps = [(runs[i + 1][0] - runs[i][1], i) for i in range(len(runs) - 1)]
        _, gi = max(gaps)
        cut_l, cut_r = runs[gi][1], runs[gi + 1][0]
        icon = im.crop((0, 0, cut_l, im.height))
        word = im.crop((cut_r, 0, im.width, im.height))
        icon = icon.crop(icon.getbbox())
        word_box = word.getbbox()
        # mantém a altura total para alinhar símbolo e assinatura na abertura
        word = word.crop((word_box[0], 0, word_box[2], word.height))
        icon.save(out / f"{a.name}-icon.png")
        word.save(out / f"{a.name}-word.png")
        print(f"{a.name}-icon.png {icon.size}  |  {a.name}-word.png {word.size}  (corte no vão de {cut_r - cut_l}px)")


if __name__ == "__main__":
    main()
