from __future__ import annotations

import hashlib

from supabase import Client

from models.schemas import ChatResponseBody, Source


def chat_question_hash(question: str, language_code: str) -> str:
    """MD5(question + language_code) per CLAUDE.md."""
    payload = (question.strip() + language_code.lower().strip()).encode("utf-8")
    return hashlib.md5(payload).hexdigest()


def get_chat_cache(client: Client, question_hash: str) -> ChatResponseBody | None:
    res = (
        client.table("chat_cache")
        .select("response, sources")
        .eq("question_hash", question_hash)
        .limit(1)
        .execute()
    )
    rows = res.data or []
    if not rows:
        return None
    row = rows[0]
    raw_sources = row.get("sources") or []
    sources: list[Source] = []
    if isinstance(raw_sources, list):
        for item in raw_sources:
            if isinstance(item, dict):
                try:
                    sources.append(Source(**item))
                except Exception:
                    continue
    return ChatResponseBody(response=row["response"], sources=sources)


def upsert_chat_cache(
    client: Client,
    *,
    question_hash: str,
    question: str,
    language_code: str,
    body: ChatResponseBody,
) -> None:
    row = {
        "question_hash": question_hash,
        "question": question,
        "language_code": language_code,
        "response": body.response,
        "sources": [s.model_dump() for s in body.sources],
    }
    client.table("chat_cache").upsert(row, on_conflict="question_hash").execute()
