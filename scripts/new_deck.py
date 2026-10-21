#!/usr/bin/env python3
"""Cria a estrutura de um projeto de slides com o motor do squad.

Uso:
    python scripts/new_deck.py "C:/eventos/meu-evento-slides" \
        --title "Meu Evento 2026" --decks "PPT1 - Abertura" "PPT2 - Produto" \
        [--w 1920 --h 1080] [--theme caminho/theme.css] [--force]

Cria:
    <projeto>/<deck>.html      (um por deck, a partir de templates/starter/deck.html)
    <projeto>/assets/          (deck.css, deck.js, viz.js, theme.css)
    <projeto>/media/           (vídeos/GIFs/imagens das mídias)
    <projeto>/brief/           (briefing.yaml, brand-tokens.yaml, deck-plan.md)
    <projeto>/LEIA-ME.txt
Não sobrescreve arquivos existentes, exceto o motor (assets/deck.*, viz.js), sem --force.
Use --update-engine para só atualizar o motor de um projeto existente.
"""
import argparse
import re
import shutil
import sys
import unicodedata
from pathlib import Path

try:  # acentos no console do Windows
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

SQUAD = Path(__file__).resolve().parent.parent
T = SQUAD / "templates"


def safe_name(name):
    n = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    n = re.sub(r"[^\w\s.-]", "", n).strip()
    return re.sub(r"\s+", " ", n)


def write(path, content, force):
    if path.exists() and not force:
        print(f"  mantido  {path.name} (já existe)")
        return
    path.write_text(content, encoding="utf-8")
    print(f"  criado   {path.relative_to(path.parents[1]) if len(path.parents) > 1 else path}")


def copy_engine(assets):
    for f in ["deck.css", "deck.js", "viz.js"]:
        shutil.copy2(T / "engine" / f, assets / f)
    print("  motor    assets/deck.css, deck.js, viz.js")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--title", default="Evento")
    ap.add_argument("--decks", nargs="+", default=["Deck"])
    ap.add_argument("--w", type=int, default=1920)
    ap.add_argument("--h", type=int, default=1080)
    ap.add_argument("--theme")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--update-engine", action="store_true")
    a = ap.parse_args()

    root = Path(a.project)
    assets, media, brief = root / "assets", root / "media", root / "brief"
    for d in (root, assets, media, brief):
        d.mkdir(parents=True, exist_ok=True)
    print(f"Projeto: {root}")
    copy_engine(assets)
    if a.update_engine:
        return

    theme_src = Path(a.theme) if a.theme else T / "themes" / "neutral.css"
    if not (assets / "theme.css").exists() or a.force:
        shutil.copy2(theme_src, assets / "theme.css")
        print(f"  tema     assets/theme.css (de {theme_src.name})")

    starter = (T / "starter" / "deck.html").read_text(encoding="utf-8")
    files = []
    for deck in a.decks:
        fname = safe_name(deck) + ".html"
        files.append((deck, fname))
        html = (starter.replace("{{TITLE}}", a.title).replace("{{DECK}}", deck)
                .replace("{{W}}", str(a.w)).replace("{{H}}", str(a.h)))
        write(root / fname, html, a.force)

    for f in ["briefing.yaml", "brand-tokens.yaml", "deck-plan.md"]:
        dst = brief / f
        if not dst.exists() or a.force:
            shutil.copy2(T / f, dst)
            print(f"  modelo   brief/{f}")

    leia = (T / "LEIA-ME.txt").read_text(encoding="utf-8")
    leia = (leia.replace("{{TITULO}}", a.title.upper())
            .replace("{{LISTA_DE_DECKS}}", "\n".join(f"  {fn}" for _, fn in files))
            .replace("{{PALCO}}", f"{a.w}x{a.h}")
            .replace("{{PREMISSA_TELAO}}", "")
            .replace("{{LISTA_DE_MIDIAS}}", "    (preencher: media/NN-nome → deck/slide)"))
    write(root / "LEIA-ME.txt", leia, a.force)
    (media / ".gitkeep").touch()
    print("Pronto. Próximo: decode-brand → theme.css e logos em assets/.")


if __name__ == "__main__":
    main()
