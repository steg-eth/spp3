# SPP3 Dossier Chat Backend

The server-side half of "ask the dossier" — a ChatKit + OpenAI Agents SDK
backend that answers questions about Steg's SPP3 application, grounded in the
`/site` dossier content. Deployed separately from `/site` (the static IPFS/ENS
bundle); the widget in `/site` calls this service via a build-time URL.

**Why a separate service:** ChatKit's `domainKey` origin check is client-side and
needs no backend, but the agent itself does — the OpenAI key cannot live in a
public static bundle pinned to IPFS. This holds the key and runs the agent.

## Architecture

```
/site (Next static export, IPFS @ spp3.steg.eth.link)
   └── <openai-chatkit>  --domainKey gates origin, calls api.url-->  this service
                                                                      └── OpenAI Agents SDK
                                                                          grounded on app/data/dossier.md
```

## Content source (single source of truth)

`app/data/dossier.md` is **derived** — extracted from `../site/app/page.tsx`
(which tracks canonical `application.md`). Regenerate after any /site change:

```bash
python sync_content.py          # ../site/app/page.tsx -> app/data/dossier.md
# or point at an explicit file:
SITE_PAGE=/path/to/page.tsx python sync_content.py
```

Then redeploy so the new corpus ships.

## Local dev

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env            # add your OPENAI_API_KEY
uvicorn app.main:app --reload --port 8321
```

- `GET  /`        → health (`{"status":"ok"}`)
- `POST /chatkit` → ChatKit protocol endpoint the widget talks to

Point the `/site` widget at `http://localhost:8321/chatkit` during dev.

## Deploy (Railway)

```bash
railway login
railway init            # or: railway link  (to an existing project)
railway variables --set OPENAI_API_KEY=sk-...
railway up              # builds Dockerfile, deploys
```

Set `ALLOWED_ORIGINS` if serving an origin other than the defaults
(`spp3.steg.eth.link` / `.limo` + localhost). Then set the `/site` widget's
build-time ChatKit URL to `https://<railway-app>.up.railway.app/chatkit`.

## Env vars

| var | required | default | purpose |
|---|---|---|---|
| `OPENAI_API_KEY` | yes | — | agent's OpenAI key (server-side only) |
| `DOSSIER_MODEL` | no | `gpt-4.1-mini` | agent model |
| `ALLOWED_ORIGINS` | no | spp3 origins + localhost | CORS allowlist |
| `PORT` | no | 8000 | set by Railway |
