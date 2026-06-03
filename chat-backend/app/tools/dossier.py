"""Dossier search tools — dependency-free token-overlap ranking over the
extracted /site dossier (app/data/dossier.md).

No sklearn/numpy: the corpus is one ~5k-word document, so a small pure-Python
ranker is plenty and keeps the Railway image tiny. The LLM does synthesis; these
tools just ground it in the dossier's actual text.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from pathlib import Path

from agents import function_tool

_DATA = Path(__file__).resolve().parent.parent / "data" / "dossier.md"

# ── Load + chunk the dossier at import time ──────────────────────────────────

_STOP = {
    "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "is",
    "are", "be", "as", "by", "that", "this", "it", "at", "from", "we", "our",
    "will", "can", "not", "but", "if", "so", "than", "then", "into", "via",
}


def _tokenize(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in _STOP and len(t) > 1]


def _load() -> tuple[dict[str, str], list[dict]]:
    """Returns ({section_title: section_text}, [chunk dicts])."""
    if not _DATA.exists():
        return {}, []
    raw = _DATA.read_text(encoding="utf-8")

    sections: dict[str, str] = {}
    current = "Overview"
    buf: list[str] = []
    for line in raw.splitlines():
        m = re.match(r"^#{1,2}\s+(.*)", line)
        if m:
            if buf:
                sections[current] = "\n".join(buf).strip()
            current = m.group(1).strip()
            buf = []
        else:
            buf.append(line)
    if buf:
        sections[current] = "\n".join(buf).strip()

    chunks: list[dict] = []
    for title, body in sections.items():
        for para in re.split(r"\n\s*\n", body):
            para = para.strip()
            if len(para) < 40:
                continue
            chunks.append({"section": title, "text": para, "tokens": Counter(_tokenize(para))})
    return sections, chunks


_SECTIONS, _CHUNKS = _load()

# Precompute document frequencies for a light idf weighting.
_DF: Counter = Counter()
for _c in _CHUNKS:
    for _tok in _c["tokens"]:
        _DF[_tok] += 1
_N = max(1, len(_CHUNKS))


def _score(query_tokens: Counter, chunk_tokens: Counter) -> float:
    score = 0.0
    for tok, qn in query_tokens.items():
        if tok in chunk_tokens:
            idf = math.log((_N + 1) / (1 + _DF.get(tok, 0))) + 1.0
            score += qn * chunk_tokens[tok] * idf
    return score


@function_tool
def search_dossier(query: str, top_k: int = 4) -> str:
    """Search the SPP3 dossier for passages relevant to the query. Returns the
    most relevant passages with their section. Use this to ground answers in the
    application's actual text before responding."""
    if not _CHUNKS:
        return "No dossier content loaded."
    top_k = max(1, min(top_k, 6))
    q = Counter(_tokenize(query))
    if not q:
        return "Query had no searchable terms."
    ranked = sorted(_CHUNKS, key=lambda c: _score(q, c["tokens"]), reverse=True)
    results = []
    for c in ranked[:top_k]:
        if _score(q, c["tokens"]) <= 0:
            break
        results.append(f"**[{c['section']}]**\n{c['text'][:900]}")
    if not results:
        return "No relevant passages found for that query."
    return "\n\n---\n\n".join(results)


@function_tool
def get_section(section: str) -> str:
    """Get a full dossier section by name (truncated to 3500 chars). Available
    sections: Team Profile, Abstract, Problem, Approach, Delivery History,
    Technical Foundation, Conclusion, Compliance & Attestations."""
    if section in _SECTIONS:
        return f"# {section}\n\n{_SECTIONS[section][:3500]}"
    low = section.lower()
    for name, text in _SECTIONS.items():
        if low in name.lower() or name.lower() in low:
            return f"# {name}\n\n{text[:3500]}"
    return f"Section '{section}' not found. Available: {', '.join(_SECTIONS.keys())}"


@function_tool
def list_sections() -> str:
    """List the dossier's top-level sections."""
    if not _SECTIONS:
        return "No dossier content loaded."
    return "Dossier sections:\n" + "\n".join(f"- {name}" for name in _SECTIONS)
