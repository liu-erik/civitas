from fastapi import APIRouter, HTTPException, Request

from middleware.rate_limit import limiter
from models.schemas import CategoryOut, TopicExplanationOut, TopicSummaryOut

router = APIRouter(tags=["topics"])


@router.get("/topics", response_model=list[CategoryOut])
@limiter.limit("20/minute")
async def list_categories(request: Request) -> list[CategoryOut]:
    raise HTTPException(
        status_code=501,
        detail="Topics listing not implemented yet.",
    )


@router.get("/topics/{category}", response_model=list[TopicSummaryOut])
@limiter.limit("20/minute")
async def list_topics(request: Request, category: str) -> list[TopicSummaryOut]:
    raise HTTPException(
        status_code=501,
        detail="Category topics not implemented yet.",
    )


@router.get("/topics/{category}/{topic}", response_model=TopicExplanationOut)
@limiter.limit("20/minute")
async def get_topic_explanation(
    request: Request,
    category: str,
    topic: str,
) -> TopicExplanationOut:
    raise HTTPException(
        status_code=501,
        detail="Topic explanation not implemented yet.",
    )
