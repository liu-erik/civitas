import logging
import os

import anthropic
from fastapi import APIRouter, HTTPException, Request

from middleware.rate_limit import limiter
from models.schemas import ChatRequest, ChatResponseBody
from services import cache_service, claude_service, translation_service
from services.supabase_client import get_supabase

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])


@router.post(
    "/chat",
    response_model=ChatResponseBody,
    summary="AI civic question answering",
)
@limiter.limit("10/minute")
async def post_chat(request: Request, body: ChatRequest) -> ChatResponseBody:
    try:
        supabase = get_supabase()
    except KeyError:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured (SUPABASE_URL and SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY).",
        ) from None

    qhash = cache_service.chat_question_hash(body.question, body.language_code)
    try:
        cached = cache_service.get_chat_cache(supabase, qhash)
    except Exception as e:
        logger.exception("chat cache read failed")
        raise HTTPException(
            status_code=503,
            detail="Could not read chat cache from database.",
        ) from e

    if cached is not None:
        return cached

    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="AI is not configured (ANTHROPIC_API_KEY).",
        )

    try:
        english = await claude_service.generate_chat_answer_english(body.question)
    except anthropic.APIError as e:
        logger.warning("Anthropic API error: %s", e)
        raise HTTPException(
            status_code=502,
            detail="The AI service returned an error. Please try again later.",
        ) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        logger.exception("Unexpected error generating chat answer")
        raise HTTPException(
            status_code=502,
            detail="Could not generate an answer.",
        ) from e

    short_lang = body.language_code.split("-", 1)[0].lower()
    if short_lang == "en":
        out = english
    else:
        try:
            out = await translation_service.translate_chat_response(
                english, body.language_code
            )
        except RuntimeError as e:
            raise HTTPException(status_code=502, detail=str(e)) from e
        except anthropic.APIError as e:
            logger.warning("Anthropic translation error: %s", e)
            raise HTTPException(
                status_code=502,
                detail="The translation service returned an error.",
            ) from e

    try:
        cache_service.upsert_chat_cache(
            supabase,
            question_hash=qhash,
            question=body.question,
            language_code=body.language_code,
            body=out,
        )
    except Exception:
        logger.exception("chat cache upsert failed; returning uncached response")

    return out
