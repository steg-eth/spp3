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

    def _commit() -> None:
        body = "\n".join(buf).strip()
        if not body:
            return
        # Append, never overwrite — a repeated heading must not clobber earlier
        # content under the same key.
        sections[current] = (sections[current] + "\n\n" + body).strip() if current in sections else body

    for line in raw.splitlines():
        m = re.match(r"^#{1,2}\s+(.*)", line)
        title = m.group(1).strip() if m else ""
        # Treat "## ---" style rules as content, NOT headings. The doc uses 8 of
        # them as separators; keying sections by "---" in a dict made each one
        # overwrite the last, deleting the Team Profile + summary KPI table (which
        # holds the stated "$440,000 total") from the index entirely.
        if m and re.search(r"[a-z0-9]", title.lower()):
            _commit()
            current = title
            buf = []
        else:
            buf.append(line)
    _commit()

    chunks: list[dict] = []
    for title, body in sections.items():
        for para in re.split(r"\n\s*\n", body):
            para = para.strip()
            if not para:
                continue
            # Markdown tables have no blank lines between rows, so a whole table
            # lands in one paragraph — burying figures (totals, line items) in a
            # single low-density blob. Split tables into per-row chunks so each
            # figure (e.g. "$440,000 total requested (Tier 1…)") is retrievable.
            if "|" in para and "\n" in para:
                for row in para.splitlines():
                    row = row.strip()
                    if not row or set(row) <= set("|:- "):  # skip separator rows
                        continue
                    if len(row) < 12 and not re.search(r"\d", row):
                        continue
                    chunks.append({"section": title, "text": row, "tokens": Counter(_tokenize(row))})
                continue
            # Keep short lines only if they carry a number — subtotals like
            # "Tier 1 Total: $265K" / "Combined Full Expansion: $440K" are <40
            # chars and were previously dropped, so the agent never saw the
            # stated total and resorted to (mis-)summing line items.
            if len(para) < 40 and not re.search(r"\d", para):
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
