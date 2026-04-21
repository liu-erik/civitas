from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

# Load backend/.env even when uvicorn is started from the repo root.
_backend_dir = Path(__file__).resolve().parents[1]
load_dotenv(_backend_dir / ".env")
load_dotenv()


def _service_role_key() -> str:
    """Supabase dashboard labels this `service_role`; either env name is accepted."""
    return (
        os.environ.get("SUPABASE_SERVICE_KEY", "").strip()
        or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    )


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    """Service-role client (bypasses RLS); use only on the backend."""
    url = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
    if not url:
        raise KeyError("SUPABASE_URL")
    key = _service_role_key()
    if not key:
        raise KeyError("SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)