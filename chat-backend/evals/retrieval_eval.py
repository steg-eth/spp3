#!/usr/bin/env python3
"""Retrieval gap-sweep — FAST, no LLM, no API key.

Loads the REAL dossier.py (stubbing its only external import, `agents`) and runs
its actual search_dossier / get_section / list_sections against a battery of
probes covering every section + key fact. Then checks, for any search miss,
whether the content is still reachable via get_section (the agent's reliable
path) — i.e. proves nothing is *truly* unreachable.

    python evals/retrieval_eval.py
"""
import sys, types, re
from pathlib import Path

_BACKEND = Path(__file__).resolve().parent.parent

# Stub `from agents import function_tool` with an identity decorator so the real
# module imports and its tool fns stay plain-callable.
_fake = types.ModuleType("agents")
_fake.function_tool = lambda f: f
sys.modules["agents"] = _fake
sys.path.insert(0, str(_BACKEND / "app" / "tools"))
import dossier  # noqa: E402

# (query, [expected substrings, case-insensitive], all|any)
PROBES = [
    ("who is on the team and their background", ["estmcmxci", "mouz"], "all"),
    ("what is the toolkit", ["verifier", "authresolver"], "all"),
    ("what does the toolkit actually do at runtime", ["verify", "authoriz"], "all"),
    ("what problem does this solve", ["authoriz", "verify"], "all"),
    ("what is the principal-agent problem", ["principal", "agent"], "all"),
    ("what was the grok bankr exploit", ["grok", "morse"], "all"),
    ("how does this drive ENS adoption", ["cb.id", "subname"], "any"),
    ("what is the revenue model", ["registration", "renewal"], "any"),
    ("how large is the addressable market", ["480k", "x402"], "any"),
    ("what is the verifiable success metric", ["agent subnames issued", "active authority"], "any"),
    ("what are the milestones and timeline", ["sepolia", "m9"], "any"),
    ("what signing schemes are supported", ["webauthn", "ecdsa", "1271"], "any"),
    ("what is the total funding amount", ["440,000"], "any"),
    ("what is in tier 1", ["265", "onchain engineering"], "any"),
    ("what is in tier 2", ["175", "wave-1"], "any"),
    ("what is the counterfactual without funding", ["integration gap", "opportunity cost"], "any"),
    ("what is the closed-vendor alternative", ["entra", "microsoft"], "any"),
    ("how does verification work technically", ["verifier", "freshness"], "all"),
    ("what license will the code use", ["mit license", "cc by-sa"], "any"),
    ("what is the approved wallet structure", ["2-of-3", "safe", "multisig"], "any"),
    ("where is the prototype specification", ["prototype spec"], "any"),
]


def hits(text, subs, mode):
    t = text.lower()
    present = [s for s in subs if s.lower() in t]
    return (len(present) == len(subs)) if mode == "all" else (len(present) > 0)


def main():
    print(f"loaded: {len(dossier._CHUNKS)} chunks, {len(dossier._ORDER)} sections\n")
    fails = []
    for q, subs, mode in PROBES:
        res = dossier.search_dossier(q)
        ok = hits(res, subs, mode)
        if not ok:
            fails.append((q, subs, mode))
        print(f"  {'PASS ' if ok else 'FAIL❌'} {q}")
    print(f"\nsearch: {len(PROBES) - len(fails)}/{len(PROBES)} passed")

    true_gaps = 0
    if fails:
        print("\nrecoverability of search-misses via get_section:")
    for q, subs, mode in fails:
        found = [n for n, t in dossier._SECTIONS.items() if hits(t, subs, mode)]
        if found:
            print(f"  ✔ {q!r} → reachable via get_section('{found[0][:32]}')")
        else:
            true_gaps += 1
            print(f"  ✘ TRULY UNREACHABLE: {q!r}")
    print(f"\n{len(fails) - true_gaps}/{len(fails)} misses agent-recoverable; {true_gaps} truly unreachable")

    print("\nsections (every one addressable via get_section):")
    print(dossier.list_sections())
    sys.exit(1 if true_gaps else 0)


if __name__ == "__main__":
    main()
