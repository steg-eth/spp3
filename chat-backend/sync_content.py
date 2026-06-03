#!/usr/bin/env python3
"""Extract the dossier text from the /site Next page into a plain-markdown
knowledge file the chat backend grounds on.

Single source of truth stays `/site/app/page.tsx` (which itself tracks the
canonical `application.md`). Re-run this after any /site content change, then
redeploy:

    python sync_content.py

Source resolution order:
  1. $SITE_PAGE env var (explicit path to page.tsx)
  2. ../site/app/page.tsx  (sibling layout in the spp3 repo)
Output: app/data/dossier.md
"""

from __future__ import annotations

import html
import os
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "app" / "data" / "dossier.md"


def _find_source() -> Path:
    env = os.environ.get("SITE_PAGE")
    if env:
        return Path(env).expanduser().resolve()
    return (HERE.parent / "site" / "app" / "page.tsx").resolve()


def jsx_to_markdown(src: str) -> str:
    """Best-effort strip of JSX → readable markdown. Lossy by design: the goal
    is a clean grounding corpus, not a faithful render."""
    s = src

    # Drop the function/return/import scaffolding — keep only the JSX body.
    # Everything we care about lives between the first <article and last </article>.
    m = re.search(r"<article[\s>].*</article>", s, flags=re.DOTALL)
    if m:
        s = m.group(0)

    # Headings → markdown headings (capture id for anchors where present).
    for level, hashes in (("1", "#"), ("2", "##"), ("3", "###"), ("4", "####")):
        s = re.sub(rf"<h{level}\b[^>]*>", f"\n\n{hashes} ", s)
        s = re.sub(rf"</h{level}>", "\n", s)

    # List items / table rows / paragraphs / section ends → line breaks.
    s = re.sub(r"<li\b[^>]*>", "\n- ", s)
    s = re.sub(r"</li>", "", s)
    s = re.sub(r"<(p|tr|div)\b[^>]*>", "\n", s)
    s = re.sub(r"</(p|tr|div|section|table|tbody|thead|ol|ul|nav|header)>", "\n\n", s)
    s = re.sub(r"<td\b[^>]*>", " ", s)
    s = re.sub(r"</td>", " |", s)
    s = re.sub(r"<th\b[^>]*>", " ", s)
    s = re.sub(r"</th>", " |", s)

    # JSX string-literal expressions: {" "} , {"text"} , {' · '} → their content.
    s = re.sub(r'\{\s*["\'](.*?)["\']\s*\}', r"\1", s, flags=re.DOTALL)

    # Anchor hrefs: keep link text + url as "text (url)".
    s = re.sub(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
               lambda m: f"{re.sub('<[^>]+>', '', m.group(2)).strip()} ({m.group(1)})",
               s, flags=re.DOTALL)

    # Strip every remaining tag.
    s = re.sub(r"<[^>]+>", "", s)

    # Remove leftover JSX braces expressions ({foo}, {/* */}) conservatively.
    s = re.sub(r"\{/\*.*?\*/\}", "", s, flags=re.DOTALL)
    s = re.sub(r"\{[^{}]*\}", "", s)

    # Decode HTML entities (&amp; &middot; &mdash; …).
    s = html.unescape(s)

    # Whitespace cleanup.
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" *\n", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    # Tidy table pipes.
    s = re.sub(r"\|\s*\n", " |\n", s)
    return s.strip() + "\n"


def main() -> None:
    src_path = _find_source()
    if not src_path.exists():
        raise SystemExit(f"source not found: {src_path} (set SITE_PAGE to override)")
    md = jsx_to_markdown(src_path.read_text(encoding="utf-8"))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(md, encoding="utf-8")
    words = len(md.split())
    print(f"wrote {OUT} ({len(md):,} chars, ~{words:,} words) from {src_path}")


if __name__ == "__main__":
    main()
