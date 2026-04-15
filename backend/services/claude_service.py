from __future__ import annotations

import json
import logging
import os
import re
from typing import Any

import anthropic

from models.schemas import ChatResponseBody, Source

logger = logging.getLogger(__name__)

CHAT_MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS_CHAT = 1000

_SYSTEM_EN = """You are Civitas, a civic education assistant for people living in the United States, especially immigrants.

Rules:
- Use plain language at about an 8th grade reading level.
- Give accurate, neutral information about U.S. civics: voting, rights, immigration basics at a general level, local government, and how to get involved. Do not give legal advice; suggest consulting qualified professionals when legal risk is involved.
- The user's question may be written in any language; understand it and answer in clear English.

Output format (critical):
Return a single JSON object only. No markdown fences, no commentary before or after the JSON.
Shape exactly:
{"response":"<your answer in English>","sources":[{"title":"","url":"https://...","summary":""}]}

Use 0 to 4 sources when helpful. Each source must use a real https URL (official .gov, state/local election sites, well-known nonprofits, etc.). Summaries should be one or two sentences in English."""


_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL)


def _extract_json_object(text: str) -> dict[str, Any]:
    raw = text.strip()
    m = _JSON_FENCE_RE.search(raw)
    if m:
        raw = m.group(1)
    return json.loads(raw)


def _parse_chat_json(data: dict[str, Any]) -> ChatResponseBody:
    response = str(data.get("response", "")).strip()
    sources_out: list[Source] = []
    raw_sources = data.get("sources") or []
    if isinstance(raw_sources, list):
        for item in raw_sources:
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
        raise ValueError("empty response from model")
    return ChatResponseBody(response=response, sources=sources_out[:4])


async def generate_chat_answer_english(question: str) -> ChatResponseBody:
    """
    Produce civic answer + sources in English (first step before translation).
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set")

    client = anthropic.AsyncAnthropic(api_key=api_key)
    msg = await client.messages.create(
        model=CHAT_MODEL,
        max_tokens=MAX_TOKENS_CHAT,
        system=_SYSTEM_EN,
        messages=[{"role": "user", "content": question.strip()}],
    )
    text_blocks = []
    for block in msg.content:
        if block.type == "text":
            text_blocks.append(block.text)
    combined = "\n".join(text_blocks).strip()
    if not combined:
        raise RuntimeError("empty model output")

    try:
        parsed = _extract_json_object(combined)
        return _parse_chat_json(parsed)
    except (json.JSONDecodeError, ValueError, TypeError) as e:
        logger.warning("chat JSON parse failed, falling back to plain text: %s", e)
        return ChatResponseBody(response=combined[:8000], sources=[])
