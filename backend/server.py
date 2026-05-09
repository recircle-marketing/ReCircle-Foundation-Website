"""
Python supervisor shim.

The platform's supervisor.conf is read-only and runs:
    uvicorn server:app --host 0.0.0.0 --port 8001

Rather than fighting that, we expose a lightweight FastAPI app that:
  1. Spawns the Node.js backend on `NODE_BACKEND_PORT` (default 8002).
  2. Forwards every HTTP request from port 8001 -> Node on 8002.
  3. Streams uploads/downloads transparently.

All actual business logic lives in /app/backend/server.js (Node + Express).
"""
from __future__ import annotations

import asyncio
import os
import signal
import subprocess
from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

NODE_PORT = int(os.environ.get("NODE_BACKEND_PORT", "8002"))
NODE_BASE = f"http://127.0.0.1:{NODE_PORT}"

state: dict = {"process": None, "client": None}


async def _wait_for_node(timeout: float = 30.0) -> bool:
    deadline = asyncio.get_event_loop().time() + timeout
    async with httpx.AsyncClient(timeout=2.0) as c:
        while asyncio.get_event_loop().time() < deadline:
            try:
                r = await c.get(f"{NODE_BASE}/api/_health")
                if r.status_code == 200:
                    return True
            except httpx.HTTPError:
                pass
            await asyncio.sleep(0.3)
    return False


@asynccontextmanager
async def lifespan(_app: FastAPI):
    env = os.environ.copy()
    env["NODE_BACKEND_PORT"] = str(NODE_PORT)
    proc = subprocess.Popen(
        ["node", "server.js"],
        cwd=str(ROOT),
        env=env,
        stdout=None,
        stderr=None,
        start_new_session=True,
    )
    state["process"] = proc

    ok = await _wait_for_node()
    if not ok:
        try:
            proc.terminate()
        except Exception:  # noqa: BLE001
            pass
        raise RuntimeError("Node backend failed to start within 30s")

    state["client"] = httpx.AsyncClient(base_url=NODE_BASE, timeout=120.0)
    try:
        yield
    finally:
        client = state.get("client")
        if client:
            await client.aclose()
        proc = state.get("process")
        if proc and proc.poll() is None:
            try:
                os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
                proc.wait(timeout=5)
            except Exception:  # noqa: BLE001
                proc.kill()


app = FastAPI(lifespan=lifespan)

_HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length",
}


def _filter_headers(headers: dict) -> dict:
    return {k: v for k, v in headers.items() if k.lower() not in _HOP_BY_HOP}


@app.api_route(
    "/{full_path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
)
async def proxy(full_path: str, request: Request):
    client: httpx.AsyncClient = state["client"]
    body = await request.body()
    headers = _filter_headers(dict(request.headers))

    target_path = "/" + full_path
    if request.url.query:
        target_path = f"{target_path}?{request.url.query}"

    rp = client.build_request(
        method=request.method,
        url=target_path,
        headers=headers,
        content=body,
    )
    try:
        resp = await client.send(rp, stream=True)
    except httpx.ConnectError:
        return Response(content="Backend unavailable", status_code=502)

    response_headers = _filter_headers(dict(resp.headers))

    async def body_iter():
        try:
            async for chunk in resp.aiter_raw():
                yield chunk
        finally:
            await resp.aclose()

    return StreamingResponse(
        body_iter(),
        status_code=resp.status_code,
        headers=response_headers,
        media_type=resp.headers.get("content-type"),
    )
