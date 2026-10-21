#!/usr/bin/env python3
"""Tira screenshot de todos os slides de um ou mais decks (QA) usando Chrome/Edge headless.

Uso:
    python scripts/snapshot.py "<projeto>/PPT1 - Abertura.html" "<projeto>/PPT2 - Produto.html"
    python scripts/snapshot.py "<projeto>"            # todos os .html da pasta
    python scripts/snapshot.py deck.html --wait 7000 --out <pasta>

Abre cada slide pelo arquivo (file://), como o operador vai abrir no evento, já no
estado final (modo ?snap do motor, com todos os builds revelados) e salva
<out>/<deck>-NN.png e uma folha de contato <out>/<deck>-contato.png com todos os slides.
Padrão de --out: <projeto>/brief/qa/.
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None

try:  # acentos no console do Windows
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
]


def find_browser():
    for name in ["chrome", "google-chrome", "chromium", "chromium-browser", "msedge"]:
        p = shutil.which(name)
        if p:
            return p
    for p in CANDIDATES:
        if os.path.exists(p):
            return p
    sys.exit("Chrome/Edge não encontrado. Instale um dos dois ou informe --browser.")


def stage_size(html):
    m = re.search(r'id="stage"[^>]*data-w="(\d+)"[^>]*data-h="(\d+)"', html)
    return (int(m.group(1)), int(m.group(2))) if m else (1920, 1080)


def contact_sheet(files, out, cols=3):
    if not Image or not files:
        return
    thumbs = [Image.open(f).convert("RGB") for f in files]
    w = 640
    h = round(thumbs[0].height * w / thumbs[0].width)
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w + (cols + 1) * 16, rows * h + (rows + 1) * 16), (30, 30, 36))
    for i, t in enumerate(thumbs):
        t = t.resize((w, h))
        sheet.paste(t, (16 + (i % cols) * (w + 16), 16 + (i // cols) * (h + 16)))
    sheet.save(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--out")
    ap.add_argument("--wait", type=int, default=2500, help="ms de tempo virtual para carregar fontes/mídias")
    ap.add_argument("--browser")
    a = ap.parse_args()

    browser = a.browser or find_browser()
    decks = []
    for p in map(Path, a.paths):
        decks += sorted(p.glob("*.html")) if p.is_dir() else [p]

    for deck in decks:
        html = deck.read_text(encoding="utf-8")
        n = len(re.findall(r'<section class="slide"', html))
        w, h = stage_size(html)
        out = Path(a.out) if a.out else deck.parent / "brief" / "qa"
        out.mkdir(parents=True, exist_ok=True)
        stem = re.sub(r"[^\w-]+", "-", deck.stem).strip("-").lower()
        shots = []
        for i in range(1, n + 1):
            png = out / f"{stem}-{i:02d}.png"
            url = deck.resolve().as_uri() + f"?show&snap#{i}"
            subprocess.run([browser, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            f"--window-size={w},{h}", f"--virtual-time-budget={a.wait}",
                            f"--screenshot={png}", url],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
            if png.exists():
                shots.append(png)
                print(f"  {png.name}")
            else:
                print(f"  FALHOU slide {i}")
        sheet = out / f"{stem}-contato.png"
        contact_sheet(shots, sheet)
        print(f"{deck.name}: {len(shots)}/{n} slides → {out}" + (f" (folha: {sheet.name})" if Image else ""))


if __name__ == "__main__":
    main()
