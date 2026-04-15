from __future__ import annotations

import json
import logging
import os
import re
from typing import Any

import anthropic

from models.schemas import ChatResponseBody, Source
from services.claude_service import CHAT_MODEL

logger = logging.getLogger(__name__)

_MAX_TOKENS_TRANSLATE = 2000

_LANG_NAMES = {
    "en": "English",
    "es": "Spanish",
    "zh": "Simplified Chinese",
}

_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL)


def _target_language_name(code: str) -> str:
    short = (code or "en").split("-", 1)[0].lower()
    return _LANG_NAMES.get(short, code)


def _extract_json_object(text: str) -> dict[str, Any]:
    raw = text.strip()
    m = _JSON_FENCE_RE.search(raw)
    if m:
        raw = m.group(1)
    return json.loads(raw)


async def translate_chat_response(body: ChatResponseBody, language_code: str) -> ChatResponseBody:
    """
    Translate an English ChatResponseBody into the target language.
    CLAUDE.md: translation prompt returns ONLY the translated payload as JSON.
    """
    short = language_code.split("-", 1)[0].lower()
    if short == "en":
        return body

    target = _target_language_name(short)
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set")

    payload = body.model_dump()
    instruction = (
        f"Translate every human-readable string in this JSON into {target}. "
        "Keep the same keys and structure. Do not translate URL strings inside the "
        '"url" fields (leave URLs exactly as they are). '
        "Output a single JSON object only — no markdown, no commentary.\n\n"
        f"INPUT_JSON:\n{json.dumps(payload, ensure_ascii=False)}"
    )

    client = anthropic.AsyncAnthropic(api_key=api_key)
    msg = await client.messages.create(
        model=CHAT_MODEL,
        max_tokens=_MAX_TOKENS_TRANSLATE,
        system=(
            "You are a professional translator for civic education content. "
            "Follow the user's instructions exactly."
        ),
        messages=[{"role": "user", "content": instruction}],
    )
    text_parts: list[str] = []
    for block in msg.content:
        if block.type == "text":
            text_parts.append(block.text)
    combined = "\n".join(text_parts).strip()
    if not combined:
        raise RuntimeError("empty translation output")

    try:
        data = _extract_json_object(combined)
        response = str(data.get("response", "")).strip()
        sources_out: list[Source] = []
        for item in data.get("sources") or []:
            if not isinstance(item, dict):
                continue
            try:
                sources_out.append(
                    Source(
                        title=str(item.get("title", "")).strip()[:500],
                        url=str(item.get("url", "")).strip(),
                        summary=str(item.get("summary", "")).strip()[:2000],
                    )
                )
            except Exception:
                continue
        if not response:
            raise ValueError("empty translated response")
        return ChatResponseBody(response=response, sources=sources_out[:4])
    except (json.JSONDecodeError, ValueError, TypeError) as e:
        logger.warning("translation JSON parse failed: %s", e)
        raise RuntimeError("translation output was not valid JSON") from e
