#!/usr/bin/env python3
"""Sync the chat backend's grounding corpus from the canonical application.md.

Single source of truth is the canonical `application.md` in the spp3 repo. The
dossier the agent grounds on is a verbatim copy of it — already clean markdown,
so no transform is needed (unlike the old /site page.tsx source, which required
a lossy JSX→markdown strip). Re-run after any application.md change, then
redeploy the backend:

    python sync_content.py

This is a LOCAL pre-commit step — Railway never runs it. It regenerates
app/data/dossier.md, which is committed and baked into the Docker image.

Source resolution order:
  1. $APPLICATION_MD env var (explicit path to application.md)
  2. ../application.md  (sibling layout in the spp3 repo)
Output: app/data/dossier.md
"""

from __future__ import annotations

import os
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "app" / "data" / "dossier.md"


def _find_source() -> Path:
    env = os.environ.get("APPLICATION_MD")
    if env:
        return Path(env).expanduser().resolve()
    return (HERE.parent / "application.md").resolve()


def main() -> None:
    src_path = _find_source()
    if not src_path.exists():
        raise SystemExit(f"source not found: {src_path} (set APPLICATION_MD to override)")
    md = src_path.read_text(encoding="utf-8")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(md, encoding="utf-8")
    words = len(md.split())
    print(f"wrote {OUT} ({len(md):,} chars, ~{words:,} words) from {src_path}")


if __name__ == "__main__":
    main()
