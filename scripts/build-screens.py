#!/usr/bin/env python3
"""
Turn raw iPhone simulator screenshots into web-ready device shots.

Source frames are flat 1206x2622 PNGs straight out of the simulator: square
corners, no bezel. This rounds them to the real display radius, wraps them in a
thin titanium bezel, and exports one transparent WebP per screen at a width the
site actually renders (the page never shows a phone wider than ~520 CSS px, so
1040 covers 2x).

The bezel is baked into the image on purpose. Drawing it in CSS instead means a
border box around a transparent PNG, which is what produced the doubled frame in
the old og-image. One frame, one source of truth.

Usage:  python3 scripts/build-screens.py [name …]
        With no arguments every screen is rebuilt; naming one or more keys from
        SCREENS rebuilds only those.
Output: public/screens/<name>_<lang>.webp
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "screens"
HOME = Path.home()

# (language, scheme) -> source folder. A scheme that has no folder simply isn't
# emitted, and the site falls back to the one that is — see SCREEN_VARIANTS.
#
# To add a capture: run the app on the simulator in that language with
# Settings ▸ Appearance set to match, grab the screens listed in SCREENS under
# the same file names, and point a new entry here at the folder.
SRC = {
    ("en", "dark"): HOME / "Desktop" / "CleanSpace-Screenshots",
    ("en", "light"): HOME / "Desktop" / "CleanSpace-Screenshots-English-Light",
    ("ar", "dark"): HOME / "Desktop" / "CleanSpace-Screenshots-Arabic",
    ("ar", "light"): HOME / "Desktop" / "CleanSpace-Screenshots-Arabic-Light",
}

# Generated so the app never asks for a variant that was never built.
VARIANTS_TS = ROOT / "src" / "app" / "core" / "screen-variants.ts"

# Screen display corner radius for the 402pt-wide iPhone Pro, at @3x.
SCREEN_RADIUS = 186
# Bezel thickness at @3x — the titanium rail as it reads at this scale.
BEZEL = 30
# Final rendered width in device pixels (2x of the largest CSS size we use).
TARGET_W = 1040
QUALITY = 82

# name -> source file stem, shared by both locales.
SCREENS = {
    "home": "02b-home-after-scan",
    "categories": "03-home-categories",
    "duplicates": "06-duplicate-photos",
    "similar": "40-similar-photos-fixed",
    "blurry": "09-blurry-photos",
    "screenshots": "10-screenshots",
    "swipe": "13-swipe-mode",
    "contacts": "14-contacts",
    "contact-merge": "15-contact-duplicates",
    "files": "17-files-docs-populated",
    "vault": "18-secret-vault",
    "video": "20-video-compression",
    "live": "22-convert-live-photos",
    "albums": "23-albums-tab",
    "collections": "24-collection-detail",
    "widgets": "27-widgets-tab",
    "memories": "38-on-this-day",
    "history": "30-cleaning-history",
    "settings": "28-settings-tab",
}


def rounded_mask(size: tuple[int, int], radius: int, supersample: int = 4) -> Image.Image:
    """An antialiased rounded-rectangle alpha mask."""
    w, h = size
    big = Image.new("L", (w * supersample, h * supersample), 0)
    ImageDraw.Draw(big).rounded_rectangle(
        (0, 0, w * supersample - 1, h * supersample - 1),
        radius=radius * supersample,
        fill=255,
    )
    return big.resize((w, h), Image.LANCZOS)


def frame(shot: Image.Image) -> Image.Image:
    """Round the screen and wrap it in a bezel, on a transparent canvas."""
    shot = shot.convert("RGBA")
    w, h = shot.size
    shot.putalpha(rounded_mask((w, h), SCREEN_RADIUS))

    ow, oh = w + BEZEL * 2, h + BEZEL * 2
    outer_radius = SCREEN_RADIUS + BEZEL

    canvas = Image.new("RGBA", (ow, oh), (0, 0, 0, 0))

    # Titanium rail: a vertical gradient so the frame catches light like metal
    # rather than reading as a flat black outline.
    rail = Image.new("RGBA", (ow, oh))
    px = rail.load()
    top, bottom = (78, 82, 90), (38, 41, 47)
    for y in range(oh):
        t = y / max(1, oh - 1)
        px[0, y] = (
            int(top[0] + (bottom[0] - top[0]) * t),
            int(top[1] + (bottom[1] - top[1]) * t),
            int(top[2] + (bottom[2] - top[2]) * t),
            255,
        )
        for x in range(1, ow):
            px[x, y] = px[0, y]
    rail.putalpha(rounded_mask((ow, oh), outer_radius))
    canvas.alpha_composite(rail)

    # A faint inner highlight where the rail meets the glass.
    ring = Image.new("RGBA", (ow, oh), (0, 0, 0, 0))
    ImageDraw.Draw(ring).rounded_rectangle(
        (BEZEL - 3, BEZEL - 3, ow - BEZEL + 2, oh - BEZEL + 2),
        radius=SCREEN_RADIUS + 3,
        outline=(255, 255, 255, 46),
        width=3,
    )
    canvas.alpha_composite(ring.filter(ImageFilter.GaussianBlur(1.2)))

    canvas.alpha_composite(shot, (BEZEL, BEZEL))
    return canvas


def main(only: list[str] | None = None) -> int:
    if only:
        unknown = [n for n in only if n not in SCREENS]
        if unknown:
            print(f"!! unknown screen(s): {', '.join(unknown)}", file=sys.stderr)
            return 1
    OUT.mkdir(parents=True, exist_ok=True)
    missing: list[str] = []
    written = 0
    produced: dict[tuple[str, str], int] = {}

    for (lang, scheme), folder in SRC.items():
        if not folder.is_dir():
            print(f"!! source folder not found: {folder}", file=sys.stderr)
            return 1
        for name, stem in SCREENS.items():
            if only and name not in only:
                continue
            src = folder / f"{stem}.png"
            if not src.exists():
                missing.append(f"{lang}-{scheme}/{stem}")
                continue
            img = frame(Image.open(src))
            scale = TARGET_W / img.width
            img = img.resize((TARGET_W, round(img.height * scale)), Image.LANCZOS)
            dest = OUT / f"{name}_{lang}_{scheme}.webp"
            img.save(dest, "WEBP", quality=QUALITY, method=6)
            produced[(lang, scheme)] = produced.get((lang, scheme), 0) + 1
            written += 1
            print(f"  {dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} KB")

    # A partial capture must not be advertised: the site would then ask for that
    # scheme for every screen and 404 on the ones that were never built. Only a
    # full-set run rewrites the map.
    if only:
        print("  (subset run — screen-variants.ts left alone)")
    else:
        write_variants({k for k, n in produced.items() if n == len(SCREENS)})
    print(f"\n{written} screens written to {OUT.relative_to(ROOT)}")
    if missing:
        print("missing sources: " + ", ".join(missing), file=sys.stderr)
        return 1
    return 0


def write_variants(complete: set[tuple[str, str]]) -> None:
    """Emit the language -> schemes map the site reads to pick a file.

    Only pairs that produced every screen are listed, so an interrupted or
    half-captured source folder degrades to the scheme that is whole.
    """
    by_lang: dict[str, list[str]] = {}
    for lang, scheme in sorted(complete):
        by_lang.setdefault(lang, []).append(scheme)
    # Dark first: it is the fallback when a light capture does not exist.
    body = ",\n".join(
        f"  '{lang}': [{', '.join(repr(s) for s in sorted(v))}]"
        for lang, v in sorted(by_lang.items())
    ).replace("'", "'")
    VARIANTS_TS.write_text(
        "// AUTO-GENERATED by scripts/build-screens.py — do not edit by hand.\n"
        "/** Which colour schemes were actually built, per screenshot language. */\n"
        "export const SCREEN_VARIANTS: Record<string, readonly ('light' | 'dark')[]> = {\n"
        f"{body},\n}};\n"
    )
    print(f"  {VARIANTS_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:] or None))
