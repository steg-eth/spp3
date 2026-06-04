#!/usr/bin/env python3
"""Answer-level eval — runs the REAL agent (LLM + tools) and grades its
GENERATED ANSWER, not just retrieval. Catches paraphrase-away-the-specific and
incomplete-section failures the retrieval sweep can't see.

Requires the chat-backend deps (`agents`, `openai`) and OPENAI_API_KEY:

    .venv/bin/python evals/answer_eval.py
"""
import sys, os, warnings
from pathlib import Path

warnings.filterwarnings("ignore")
os.environ.setdefault("OPENAI_AGENTS_DISABLE_TRACING", "1")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agents import Runner  # noqa: E402
from app.agent import dossier_agent  # noqa: E402

# (question, [expected specifics in the ANSWER, case-insensitive], all|any)
PROBES = [
    ("What is the counterfactual — what happens without this funding?", ["entra"], "any"),
    ("What is the total funding amount and the tier split?", ["440,000", "265", "175"], "all"),
    ("Who is on the team and what are their backgrounds?", ["estmcmxci", "mouz"], "all"),
    ("What are the milestones and delivery timeline?", ["sepolia"], "any"),
    ("When is the mainnet-ready release?", ["2027"], "any"),
    ("What signing schemes are supported?", ["webauthn", "ecdsa", "1271"], "any"),
    ("What is in Tier 2 of the budget?", ["wave-1", "175"], "any"),
    ("What license will the code use and what is the approved wallet structure?", ["mit", "2-of-3"], "all"),
    ("What does the toolkit include?", ["verifier", "authresolver", "sdk"], "any"),
    ("How large is the addressable market?", ["480", "x402"], "any"),
    ("What is the verifiable success metric?", ["agent subnames", "active authority"], "any"),
    ("What has the team already delivered?", ["509", "synthesis", "ethglobal"], "any"),
    ("What are the four claims of the architecture?", ["freshness", "permission", "external", "revocation"], "any"),
    ("Why should ENS fund this rather than let the market solve it?", ["entra", "closed", "neutral", "substrate"], "any"),
    ("What was the Grok-Bankr exploit?", ["grok", "morse"], "all"),
]


def graded(ans, subs, mode):
    a = ans.lower()
    p = [s for s in subs if s.lower() in a]
    return (len(p) == len(subs)) if mode == "all" else (len(p) > 0)


def main():
    print(f"answer-level — {len(PROBES)} probes, model={dossier_agent.model}\n")
    fails = []
    for q, subs, mode in PROBES:
        try:
            ans = Runner.run_sync(dossier_agent, q).final_output or ""
        except Exception as e:
            ans = f"[ERROR: {e}]"
        ok = graded(ans, subs, mode)
        if not ok:
            fails.append((q, subs, ans))
        print(f"  {'PASS ' if ok else 'FAIL❌'} {q}")
    print(f"\nANSWER-LEVEL: {len(PROBES) - len(fails)}/{len(PROBES)} passed")
    for q, subs, ans in fails:
        print(f"\n❌ {q}\n   expected: {subs}\n   answer: {ans[:240].strip()}…")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
