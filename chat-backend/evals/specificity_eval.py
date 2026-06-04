#!/usr/bin/env python3
"""Hard-specificity eval — each probe demands the NAMED particulars a top answer
must contain (programs, partners, PR#s, exact figures, dates), the things a
weaker model paraphrases into generic categories.

This is the eval that picked the model: gpt-4.1-mini scored ~4/12 on the stubborn
probes (e.g. de-risk → "Pinata" was 0/4 over repeated trials); gpt-4.1 scored
12/12. Run multiple times — LLM output is non-deterministic, so a single run is
noisy (±1-2); judge on consistency across trials, not one number.

    .venv/bin/python evals/specificity_eval.py            # one pass
    EVAL_TRIALS=4 .venv/bin/python evals/specificity_eval.py   # N trials/probe
"""
import sys, os, time, warnings
from pathlib import Path

warnings.filterwarnings("ignore")
os.environ.setdefault("OPENAI_AGENTS_DISABLE_TRACING", "1")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agents import Runner  # noqa: E402
from app.agent import dossier_agent  # noqa: E402

HARD = [
    ("As a skeptical reviewer, what concretely de-risks Tier 2 adoption? Name the specific evidence.", ["pinata", "bankr"], "all"),
    ("Has any of the integration work actually been validated yet, and where?", ["phase a", "bankr"], "all"),
    ("What specific upstream contribution has the team merged into canonical ENS?", ["509", "7951"], "any"),
    ("What hackathons has the team won, and with which projects?", ["synthesis", "ethglobal", "oikonomos"], "any"),
    ("What companies and protocols has mouz built production systems at?", ["arcade", "uniswap"], "all"),
    ("Exactly how big is the addressable market and what's the source?", ["480", "x402"], "all"),
    ("What is the five-year revenue projection range?", ["400", "580"], "any"),
    ("What real-world precedent shows operator-issued subnames drive ENS growth?", ["cb.id"], "any"),
    ("What named enterprise competitor is moving into agent identity?", ["entra"], "any"),
    ("What exact signing schemes / standards does the toolkit support?", ["webauthn", "ecdsa", "1271"], "all"),
    ("Give the specifics of the Grok-Bankr exploit: method, source.", ["morse", "slowmist"], "all"),
    ("What is the exact mainnet-ready milestone and its date?", ["m9", "2027"], "any"),
    ("Exactly which licenses apply to the code versus the documentation?", ["mit", "cc by-sa"], "all"),
    ("Where is the full technical specification located?", ["prototype spec"], "any"),
    ("What EIP made the P-256 verification cheap, and by how much?", ["7951", "98"], "any"),
]


def graded(ans, subs, mode):
    a = ans.lower()
    p = [s for s in subs if s.lower() in a]
    return (len(p) == len(subs)) if mode == "all" else (len(p) > 0)


def main():
    trials = int(os.environ.get("EVAL_TRIALS", "1"))
    print(f"hard-specificity — {len(HARD)} probes × {trials} trial(s), model={dossier_agent.model}\n")
    total = passed = 0
    for q, subs, mode in HARD:
        hits = 0
        for _ in range(trials):
            try:
                ans = Runner.run_sync(dossier_agent, q).final_output or ""
            except Exception as e:
                ans = f"[ERR {e}]"
            hits += graded(ans, subs, mode)
            if trials > 1:
                time.sleep(2)
        total += trials
        passed += hits
        print(f"  {hits}/{trials}  {q[:62]}")
    print(f"\nSPECIFICITY: {passed}/{total} across {trials} trial(s)")
    sys.exit(0 if passed == total else 1)


if __name__ == "__main__":
    main()
