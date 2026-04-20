import logging

from fastapi import APIRouter, HTTPException, Query, Request

from middleware.rate_limit import limiter
from models.schemas import CategoryOut, TopicExplanationOut, TopicSummaryOut, strip_html
from services import topic_content_service, topics_repository
from services.supabase_client import get_supabase

logger = logging.getLogger(__name__)

router = APIRouter(tags=["topics"])


@router.get("/topics", response_model=list[CategoryOut])
@limiter.limit("20/minute")
async def list_categories(
    request: Request,
    lang: str = Query("en", max_length=10, description="BCP-47 language code, e.g. en, es, zh"),
) -> list[CategoryOut]:
    try:
        client = get_supabase()
    except KeyError:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY).",
        ) from None
    try:
        return topics_repository.list_categories(client, strip_html(lang))
    except Exception:
        logger.exception("GET /topics failed")
        raise HTTPException(
            status_code=503,
            detail="Could not load categories from the database.",
        ) from None


@router.get("/topics/{category}", response_model=list[TopicSummaryOut])
@limiter.limit("20/minute")
async def list_topics(
    request: Request,
    category: str,
    lang: str = Query("en", max_length=10),
) -> list[TopicSummaryOut]:
    cat_slug = strip_html(category)
    if not cat_slug:
        raise HTTPException(status_code=404, detail="Category not found.")
    try:
        client = get_supabase()
    except KeyError:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY).",
        ) from None
    try:
        rows = topics_repository.list_topics_for_category(
            client, cat_slug, strip_html(lang)
        )
    except Exception:
        logger.exception("GET /topics/{category} failed")
        raise HTTPException(
            status_code=503,
            detail="Could not load topics from the database.",
        ) from None
    if rows is None:
        raise HTTPException(status_code=404, detail="Category not found.")
    return rows


@router.get("/topics/{category}/{topic}", response_model=TopicExplanationOut)
@limiter.limit("20/minute")
async def get_topic_explanation(
    request: Request,
    category: str,
    topic: str,
    lang: str = Query("en", max_length=10),
) -> TopicExplanationOut:
    cat_slug = strip_html(category)
    topic_slug = strip_html(topic)
    if not cat_slug or not topic_slug:
        raise HTTPException(status_code=404, detail="Topic not found.")
    try:
        client = get_supabase()
    except KeyError:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY).",
        ) from None
    lang_clean = strip_html(lang)
    try:
        body = await topic_content_service.load_or_generate_topic_explanation(
            client, cat_slug, topic_slug, lang_clean
        )
    except RuntimeError as exc:
        logger.warning("Topic content generation unavailable: %s", exc)
        raise HTTPException(
            status_code=503,
            detail=str(exc) or "Topic content is temporarily unavailable.",
        ) from exc
    except Exception:
        logger.exception("GET /topics/{category}/{topic} failed")
        raise HTTPException(
            status_code=503,
            detail="Could not load topic from the database.",
        ) from None
    if body is None:
        raise HTTPException(status_code=404, detail="Topic not found.")
    return body
