from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, timezone
from typing import Any

import anthropic
from supabase import Client

from models.schemas import TopicExplanationOut
from services.claude_service import CHAT_MODEL, _extract_json_object
from services.topics_repository import get_topic_explanation

logger = logging.getLogger(__name__)

_MAX_TOPIC_TOKENS = 2000
_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL)

_LANG_NAMES = {
    "en": "English",
    "es": "Spanish",
    "zh": "Simplified Chinese",
}


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _row_body_complete(row: dict[str, Any] | None) -> bool:
    if not row:
        return False
    for key in ("what_it_is", "why_it_matters", "what_you_can_do"):
        val = row.get(key)
        if val is None or not str(val).strip():
            return False
    return True


def _fetch_translation_row(client: Client, topic_id: str, lang: str) -> dict | None:
    r = (
        client.table("topic_translations")
        .select("title, what_it_is, why_it_matters, what_you_can_do")
        .eq("topic_id", topic_id)
        .eq("language_code", lang)
        .limit(1)
        .execute()
    )
    return (r.data or [None])[0]


def _fetch_category_name_en(client: Client, category_id: str) -> str:
    r = (
        client.table("category_translations")
        .select("name")
        .eq("category_id", category_id)
        .eq("language_code", "en")
        .limit(1)
        .execute()
    )
    if r.data and r.data[0].get("name"):
        return str(r.data[0]["name"])
    return "Civics"


async def _generate_topic_body_en(
    *, topic_title: str, topic_slug: str, category_name: str
) -> dict[str, str]:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set")

    system = (
        "You are Civitas, a civic education writer for immigrants in the United States.\n"
        "Rules:\n"
        "- Plain language, about 8th grade reading level.\n"
        "- Accurate, neutral, non-partisan overview of the topic.\n"
        "- Do not give individualized legal advice; note when a licensed attorney may be needed.\n"
        "Output a single JSON object only (no markdown fences, no extra text). Keys exactly:\n"
        '{"what_it_is":"","why_it_matters":"","what_you_can_do":""}\n'
        "Each value should be 2–4 short paragraphs separated by blank lines where helpful."
    )
    user = (
        f"Category (English): {category_name}\n"
        f"Topic title (English): {topic_title}\n"
        f"Topic slug: {topic_slug}\n"
        "Write the three JSON fields for this topic."
    )

    client = anthropic.AsyncAnthropic(api_key=api_key)
    msg = await client.messages.create(
        model=CHAT_MODEL,
        max_tokens=_MAX_TOPIC_TOKENS,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    parts: list[str] = []
    for block in msg.content:
        if block.type == "text":
            parts.append(block.text)
    raw = "\n".join(parts).strip()
    if not raw:
        raise RuntimeError("empty topic model output")
    try:
        data = _extract_json_object(raw)
    except json.JSONDecodeError:
        m = _JSON_FENCE_RE.search(raw)
        if not m:
            raise
        data = json.loads(m.group(1))
    out = {
        "what_it_is": str(data.get("what_it_is", "")).strip(),
        "why_it_matters": str(data.get("why_it_matters", "")).strip(),
        "what_you_can_do": str(data.get("what_you_can_do", "")).strip(),
    }
    if not all(out.values()):
        raise ValueError("model returned empty topic fields")
    return out


async def _translate_topic_fields(
    *,
    title: str,
    what_it_is: str,
    why_it_matters: str,
    what_you_can_do: str,
    language_code: str,
) -> dict[str, str]:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set")

    short = language_code.split("-", 1)[0].lower()
    target = _LANG_NAMES.get(short, language_code)
    payload = {
        "title": title,
        "what_it_is": what_it_is,
        "why_it_matters": why_it_matters,
        "what_you_can_do": what_you_can_do,
    }
    instruction = (
        f"Translate every string value in this JSON into {target}. "
        "Keep the same keys. Output only a JSON object — no markdown, no commentary.\n\n"
        f"INPUT_JSON:\n{json.dumps(payload, ensure_ascii=False)}"
    )

    client = anthropic.AsyncAnthropic(api_key=api_key)
    msg = await client.messages.create(
        model=CHAT_MODEL,
        max_tokens=_MAX_TOPIC_TOKENS,
        system="You are a professional translator for civic education. Follow instructions exactly.",
        messages=[{"role": "user", "content": instruction}],
    )
    text = "\n".join(b.text for b in msg.content if b.type == "text").strip()
    try:
        data = _extract_json_object(text)
    except json.JSONDecodeError:
        m = _JSON_FENCE_RE.search(text)
        if not m:
            raise
        data = json.loads(m.group(1))
    return {
        "title": str(data.get("title", "")).strip(),
        "what_it_is": str(data.get("what_it_is", "")).strip(),
        "why_it_matters": str(data.get("why_it_matters", "")).strip(),
        "what_you_can_do": str(data.get("what_you_can_do", "")).strip(),
    }


def _upsert_translation(
    client: Client,
    *,
    topic_id: str,
    language_code: str,
    title: str,
    what_it_is: str,
    why_it_matters: str,
    what_you_can_do: str,
) -> None:
    row = {
        "topic_id": topic_id,
        "language_code": language_code,
        "title": title,
        "what_it_is": what_it_is,
        "why_it_matters": why_it_matters,
        "what_you_can_do": what_you_can_do,
        "generated_at": _iso_now(),
    }
    client.table("topic_translations").upsert(
        row, on_conflict="topic_id,language_code"
    ).execute()


async def load_or_generate_topic_explanation(
    client: Client, category_slug: str, topic_slug: str, lang: str
) -> TopicExplanationOut | None:
    """
    Return topic explanation, generating and caching EN then translating per CLAUDE.md when missing.
    """
    base = get_topic_explanation(client, category_slug, topic_slug, lang)
    if base is None:
        return None

    short = lang.split("-", 1)[0].lower() if lang else "en"
    tid = base.id
    cid = base.category_id

    en_row = _fetch_translation_row(client, tid, "en") or {}
    target_row = (
        _fetch_translation_row(client, tid, short) if short != "en" else en_row
    )

    title_en = str(en_row.get("title") or base.title).strip()

    need_en = not _row_body_complete(en_row)
    need_target = short != "en" and not _row_body_complete(target_row)

    if not need_en and not need_target:
        return base

    if not os.getenv("ANTHROPIC_API_KEY"):
        raise RuntimeError("ANTHROPIC_API_KEY is not set")

    cat_name = _fetch_category_name_en(client, cid)

    if need_en:
        body = await _generate_topic_body_en(
            topic_title=title_en, topic_slug=topic_slug, category_name=cat_name
        )
        _upsert_translation(
            client,
            topic_id=tid,
            language_code="en",
            title=title_en,
            what_it_is=body["what_it_is"],
            why_it_matters=body["why_it_matters"],
            what_you_can_do=body["what_you_can_do"],
        )

    if short != "en" and need_target:
        en_row2 = _fetch_translation_row(client, tid, "en") or {}
        if not _row_body_complete(en_row2):
            raise RuntimeError("English topic content missing after generation")
        translated = await _translate_topic_fields(
            title=str(en_row2.get("title") or title_en),
            what_it_is=str(en_row2.get("what_it_is", "")),
            why_it_matters=str(en_row2.get("why_it_matters", "")),
            what_you_can_do=str(en_row2.get("what_you_can_do", "")),
            language_code=short,
        )
        _upsert_translation(
            client,
            topic_id=tid,
            language_code=short,
            title=translated["title"],
            what_it_is=translated["what_it_is"],
            why_it_matters=translated["why_it_matters"],
            what_you_can_do=translated["what_you_can_do"],
        )

    final = get_topic_explanation(client, category_slug, topic_slug, lang)
    return final if final is not None else base
