#!/usr/bin/env python3
"""Extrai a paleta dominante de artes/imagens e sugere tokens.

Uso:
    python scripts/extract_palette.py arte1.png arte2.jpg --n 8

Mostra as cores dominantes (hex, %, luminância, saturação) e uma sugestão de
bg / brand-1..3 / accent / glow. É ponto de partida: o brand-decoder confere
contra as artes e o CSS da landing page.
"""
import argparse
import colorsys
import sys

from PIL import Image

try:  # acentos no console do Windows
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def hexc(rgb):
    return "#%02x%02x%02x" % rgb


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("images", nargs="+")
    ap.add_argument("--n", type=int, default=8)
    a = ap.parse_args()

    counts = {}
    for path in a.images:
        im = Image.open(path).convert("RGBA")
        im.thumbnail((400, 400))
        data = im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()
        px = [p[:3] for p in data if p[3] > 200]
        if not px:
            continue
        flat = Image.new("RGB", (len(px), 1))
        flat.putdata(px)
        q = flat.quantize(colors=a.n, method=Image.Quantize.MEDIANCUT)
        pal = q.getpalette()
        for count, idx in q.getcolors():
            rgb = tuple(pal[idx * 3: idx * 3 + 3])
            counts[rgb] = counts.get(rgb, 0) + count

    total = sum(counts.values()) or 1
    rows = []
    for rgb, c in sorted(counts.items(), key=lambda x: -x[1])[: a.n * 2]:
        h, l, s = colorsys.rgb_to_hls(*(v / 255 for v in rgb))
        rows.append((rgb, c / total, l, s))

    print(f"{'cor':9} {'%':>6} {'lum':>5} {'sat':>5}")
    for rgb, pct, l, s in rows:
        print(f"{hexc(rgb):9} {pct * 100:6.1f} {l:5.2f} {s:5.2f}")

    def distinct(cands, min_dist=60):
        picked = []
        for r in cands:
            if all(sum((r[0][i] - p[0][i]) ** 2 for i in range(3)) ** .5 >= min_dist for p in picked):
                picked.append(r)
        return picked

    darks = sorted([r for r in rows if r[2] < .18], key=lambda r: -r[1])
    vivid = distinct(sorted([r for r in rows if r[3] > .45 and .2 < r[2] < .85], key=lambda r: -r[1]))
    print("\nSugestão (conferir contra as artes e a landing page!):")
    print(f"  bg: {hexc(darks[0][0]) if darks else '#05060c (nenhum escuro nas artes: padrão para LED)'}")
    for i, r in enumerate(sorted(vivid[:3], key=lambda r: r[2]), 1):
        print(f"  brand_{i}: {hexc(r[0])}   glow: \"{r[0][0]} {r[0][1]} {r[0][2]}\"")
    if len(vivid) > 3:
        print(f"  accent: {hexc(vivid[3][0])}")
    if len(vivid) < 3:
        print("  (poucas cores distintas: complete a rampa clareando/escurecendo a principal)")


if __name__ == "__main__":
    main()
