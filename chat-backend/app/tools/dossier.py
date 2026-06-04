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
    # Question words — keep them out so "what is the counterfactual" ranks on
    # "counterfactual", not on the near-meaningless "what".
    "what", "how", "why", "when", "where", "who", "which", "does", "do", "whats",
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

    def _is_bare_heading(s: str) -> bool:
        # A blank-surrounded, Title-Case, ≤4-word label with no sentence
        # punctuation — e.g. "Team Profile", which the doc writes as plain text
        # rather than a markdown heading, leaving its content (the team bios)
        # untagged and unreachable by get_section / a "team" query.
        if not s or len(s) > 40 or s[0] in "-*>|#" or not s[0].isupper():
            return False
        if any(c in s for c in ".,:;!?|"):
            return False
        words = s.split()
        return 1 <= len(words) <= 4 and all(re.fullmatch(r"[A-Za-z0-9&/().-]+", w) for w in words)

    # order = every heading in document order with its level, INCLUDING headings
    # whose own body is empty (e.g. "## 4. Delivery History", which is immediately
    # followed by its "### …" children). Used by get_section to aggregate a
    # heading's whole subtree so "what's been delivered" returns all of §4, not
    # just the first child it happens to land on.
    order: list[tuple[str, int]] = []
    prev_blank = True
    for line in raw.splitlines():
        stripped = line.strip()
        # Recognize h1–h3 as section boundaries. h3 matters: "### 3.4
        # Counterfactual" / "### 2.1 Adoption…" are real subsections — without
        # this they're unaddressable by get_section and their content is buried
        # in the parent section, so the agent reports them as "not retrievable".
        m = re.match(r"^(#{1,3})\s+(.*)", line)
        title = m.group(2).strip() if m else ""
        # Treat "## ---" style rules as content, NOT headings. The doc uses 8 of
        # them as separators; keying sections by "---" in a dict made each one
        # overwrite the last, deleting the Team Profile + summary KPI table (which
        # holds the stated "$440,000 total") from the index entirely.
        is_md_head = bool(m) and re.search(r"[a-z0-9]", title.lower())
        is_bare_head = (not m) and prev_blank and _is_bare_heading(stripped)
        if is_md_head or is_bare_head:
            _commit()
            # De-escape markdown backslashes in the heading ("7\. Compliance" →
            # "7. Compliance") so the section name the agent naturally types
            # matches in get_section, and list_sections reads clean.
            current = re.sub(r"\\(\W)", r"\1", title if is_md_head else stripped)
            # h-level for subtree aggregation; bare headings ("Team Profile") ≈ top.
            order.append((current, len(m.group(1)) if is_md_head else 2))
            buf = []
        else:
            buf.append(line)
        prev_blank = stripped == ""
    _commit()

    chunks: list[dict] = []
    for title, body in sections.items():
        # Fold the section title into every chunk's tokens so a topic query
        # ("counterfactual", "budget") reaches the section's content even when
        # the paragraphs never repeat the section name.
        sec_tokens = Counter(_tokenize(title))
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
                    chunks.append({"section": title, "text": row, "tokens": Counter(_tokenize(row)) + sec_tokens})
                continue
            # Keep short lines only if they carry a number — subtotals like
            # "Tier 1 Total: $265K" / "Combined Full Expansion: $440K" are <40
            # chars and were previously dropped, so the agent never saw the
            # stated total and resorted to (mis-)summing line items.
            if len(para) < 40 and not re.search(r"\d", para):
                continue
            chunks.append({"section": title, "text": para, "tokens": Counter(_tokenize(para)) + sec_tokens})
    return sections, chunks, order


_SECTIONS, _CHUNKS, _ORDER = _load()

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
def search_dossier(query: str, top_k: int = 6) -> str:
    """Search the SPP3 dossier for passages relevant to the query. Returns the
    most relevant passages with their section. Use this to ground answers in the
    application's actual text before responding."""
    if not _CHUNKS:
        return "No dossier content loaded."
    top_k = max(1, min(top_k, 8))
    q = Counter(_tokenize(query))
    if not q:
        return "Query had no searchable terms."
    ranked = sorted(_CHUNKS, key=lambda c: _score(q, c["tokens"]), reverse=True)
    results = []
    for c in ranked[:top_k]:
        if _score(q, c["tokens"]) <= 0:
            break
        results.append(f"**[{c['section']}]**\n{c['text'][:1500]}")
    if not results:
        return "No relevant passages found for that query."
    return "\n\n---\n\n".join(results)


def _resolve_section(section: str) -> int | None:
    """Index into _ORDER for the requested section: exact (de-escaped) match
    first, then fuzzy substring."""
    low = section.lower().strip()
    for i, (name, _lvl) in enumerate(_ORDER):
        if name.lower() == low:
            return i
    for i, (name, _lvl) in enumerate(_ORDER):
        if low in name.lower() or name.lower() in low:
            return i
    return None


@function_tool
def get_section(section: str) -> str:
    """Get a full dossier section by name, INCLUDING its sub-sections. Asking for
    a parent ("4. Delivery History", "2. Problem", "3. Approach") returns its
    intro plus every child subsection beneath it — so you get the complete
    picture, not just one part. Numbered subsections ("2.1 Adoption and Utility",
    "3.3 Budget", "3.4 Counterfactual") and "Team Profile" are addressable too.
    Matching is fuzzy; call list_sections for exact names. Truncated to 6000 chars."""
    i = _resolve_section(section)
    if i is None:
        return f"Section '{section}' not found. Available: {', '.join(n for n, _ in _ORDER)}"
    title, level = _ORDER[i]
    parts = [f"# {title}"]
    if _SECTIONS.get(title):
        parts.append(_SECTIONS[title])
    # Append every following heading whose level is deeper than this one (its
    # subtree), stopping at the next sibling/parent.
    for name, lvl in _ORDER[i + 1:]:
        if lvl <= level:
            break
        parts.append(f"\n## {name}")
        if _SECTIONS.get(name):
            parts.append(_SECTIONS[name])
    return "\n".join(p for p in parts if p).strip()[:6000]


@function_tool
def list_sections() -> str:
    """List the dossier's sections and subsections, in document order."""
    if not _ORDER:
        return "No dossier content loaded."
    return "Dossier sections:\n" + "\n".join(
        f"- {'  ' * (lvl - 1)}{name}" for name, lvl in _ORDER
    )
