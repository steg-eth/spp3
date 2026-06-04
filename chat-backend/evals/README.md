# Dossier agent evals

Reproducible checks for the dossier Q&A agent. Built while hardening retrieval
and picking the model; keep them green when changing `app/tools/dossier.py`,
`app/agent.py`, or `app/data/dossier.md`.

| Eval | What it checks | Needs |
|------|----------------|-------|
| `retrieval_eval.py` | Every section/fact is retrievable; nothing is *truly* unreachable. Pure-Python (stubs `agents`) — fast, free. | nothing |
| `answer_eval.py` | The agent's **generated answers** contain the right facts (incl. complete `get_section` subtrees). | deps + `OPENAI_API_KEY` |
| `specificity_eval.py` | Answers carry **named** specifics (Pinata, Bankr, PR #509, exact figures) the way a strong model does. | deps + `OPENAI_API_KEY` |

## Run

```bash
# fast, no API cost — run first when touching the chunker/parser
python evals/retrieval_eval.py

# real LLM calls (gpt-4.1) — needs the venv + key
.venv/bin/python evals/answer_eval.py
EVAL_TRIALS=4 .venv/bin/python evals/specificity_eval.py   # avg over trials
```

## Why two layers

Retrieval green ≠ good answers — the agent can have a fact in context and still
paraphrase it away. The answer/specificity evals run the real model, so they
catch generation-quality gaps the retrieval sweep is blind to.

LLM output is non-deterministic: a single answer-level run is noisy (±1–2).
Judge on consistency across trials (`EVAL_TRIALS`), not one number — that's how
we established gpt-4.1 (12/12) over gpt-4.1-mini (~4/12) on the hard set.
