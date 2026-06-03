"""FastAPI entrypoint for the SPP3 dossier chat backend.

Endpoints:
  GET  /         health check (also Railway healthcheckPath)
  POST /chatkit  ChatKit protocol endpoint the widget talks to

The OpenAI key lives only here (server-side) — never in the static /site bundle.
Origin binding is enforced client-side by ChatKit's domainKey; CORS below is a
second, defense-in-depth allowlist for the browser fetch.
"""

import os
from typing import Any

from dotenv import load_dotenv

load_dotenv()

from chatkit.server import StreamingResult
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse

from .server import DossierChatKitServer
from .store import MemoryStore

app = FastAPI(title="SPP3 Dossier Chat Backend")

# Comma-separated override; defaults to the canonical ENS origin + local dev.
_DEFAULT_ORIGINS = (
    "https://spp3.steg.eth.link,https://spp3.steg.eth.limo,"
    "http://localhost:3001,http://localhost:3000"
)
ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get("ALLOWED_ORIGINS", _DEFAULT_ORIGINS).split(",") if o.strip()
]

# Regex allowlist for dynamic hosts (ngrok shares have changing URLs). Override
# with ALLOWED_ORIGIN_REGEX; default matches *.ngrok-free.app / *.ngrok.io / .dev.
ALLOWED_ORIGIN_REGEX = os.environ.get(
    "ALLOWED_ORIGIN_REGEX", r"https://([a-z0-9-]+\.)*ngrok(-free)?\.(app|io|dev)$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = MemoryStore()
server = DossierChatKitServer(store=store)


@app.get("/")
async def health() -> dict[str, Any]:
    return {"status": "ok", "agent": "SPP3 Dossier Assistant"}


@app.post("/chatkit")
async def chatkit_endpoint(request: Request) -> Response:
    body = await request.body()
    context: dict[str, Any] = {}
    result = await server.process(body, context=context)
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")
