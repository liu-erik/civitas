from __future__ import annotations

from supabase import Client

from models.schemas import LocalDataOut


def list_local_for_city_state(
    client: Client, city: str, state: str
) -> list[LocalDataOut]:
    city_q = (city or "").strip()
    state_q = (state or "").strip()
    if not city_q or not state_q:
        return []

    r = (
        client.table("local_data")
        .select("id, type, city, state, data")
        .eq("active", True)
        .ilike("city", city_q)
        .ilike("state", state_q)
        .order("type")
        .execute()
    )
    rows = r.data or []
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
