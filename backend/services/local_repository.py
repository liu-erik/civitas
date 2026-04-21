from __future__ import annotations

import logging

from supabase import Client

from models.schemas import LocalDataOut

logger = logging.getLogger(__name__)


def list_local_for_city_state(
    client: Client, city: str, state: str
) -> list[LocalDataOut]:
    city_q = (city or "").strip()
    state_q = (state or "").strip()
    if not city_q or not state_q:
        return []

    # PostgREST expects lowercase boolean literals. Using Python True produces
    # `active=eq.True` which does not match boolean `true` rows.
    r = (
        client.table("local_data")
        .select("id, type, city, state, data")
        .is_("active", "true")
        .ilike("city", city_q)
        .ilike("state", state_q)
        .order("created_at")
        .execute()
    )
    rows = r.data or []
    if not rows:
        logger.debug(
            "local_data query returned 0 rows for city=%r state=%r",
            city_q,
            state_q,
        )
    out: list[LocalDataOut] = []
    for row in rows:
        t = str(row.get("type") or "")
        if t not in ("representative", "organization", "event"):
            continue
        out.append(
            LocalDataOut(
                id=str(row["id"]),
                type=t,  # type: ignore[arg-type]
                city=row.get("city"),
                state=row.get("state"),
                data=dict(row.get("data") or {}),
            )
        )
    return out
