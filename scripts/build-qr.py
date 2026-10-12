#!/usr/bin/env python3
"""
QR codes for the download page, one per language.

Each code points at that locale's download smart-link with ?ref=qr, so a
desktop visitor can scan the screen with an iPhone camera and land straight on
the App Store, and analytics can tell scans apart from taps.

Error correction is H (~30% recoverable) because the page lays the app icon
over the centre; the modules under it are left out here, which is the same as
covering them. Output is a single-path SVG drawn in currentColor, so the page
decides its colour.

Usage:  python3 scripts/build-qr.py          (needs: pip install qrcode)
Output: public/qr/<lang>.svg
"""

from __future__ import annotations

import re
from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_H

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "qr"

# Share of the code's width kept clear for the icon the page places on top.
LOGO_SHARE = 0.20


def site_url() -> str:
    src = (ROOT / "src/environments/environment.ts").read_text()
    return re.search(r"siteUrl:\s*'([^']+)'", src).group(1)


def languages() -> list[str]:
    src = (ROOT / "src/app/services/i18n.ts").read_text()
    block = src[src.index("LANGUAGES") : src.index("@Injectable")]
    return re.findall(r"code:\s*'([^']+)'", block)


def svg_for(url: str) -> str:
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=0)
    qr.add_data(url)
    qr.make(fit=True)
    m = qr.get_matrix()
    n = len(m)
    lo = (n - n * LOGO_SHARE) / 2
    hi = n - lo
    def drawn(x: int, y: int) -> bool:
        return m[y][x] and not (lo <= x + 0.5 <= hi and lo <= y + 0.5 <= hi)

    # One rectangle per horizontal run of dark modules keeps the file small.
    cells = []
    for y in range(n):
        x = 0
        while x < n:
            if not drawn(x, y):
                x += 1
                continue
            start = x
            while x < n and drawn(x, y):
                x += 1
            w = x - start
            cells.append(f"M{start} {y}h{w}v1h-{w}z")
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" '
        f'shape-rendering="crispEdges"><path fill="currentColor" d="{"".join(cells)}"/></svg>\n'
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    site = site_url()
    for lang in languages():
        (OUT / f"{lang}.svg").write_text(svg_for(f"{site}/{lang}/download?ref=qr"))
    print(f"QR → public/qr/ ({len(languages())} languages)")


if __name__ == "__main__":
    main()
