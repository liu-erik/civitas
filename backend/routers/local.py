import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from middleware.rate_limit import limiter
from models.schemas import LocalDataOut, LocalQueryParams
from services import local_repository
from services.supabase_client import get_supabase

logger = logging.getLogger(__name__)

router = APIRouter(tags=["local"])


def _parse_local_query(
    city: str = Query(..., max_length=100),
    state: str = Query(..., max_length=50),
) -> LocalQueryParams:
    return LocalQueryParams(city=city, state=state)


@router.get("/local", response_model=list[LocalDataOut])
@limiter.limit("100/minute")
async def get_local(
    request: Request,
    params: Annotated[LocalQueryParams, Depends(_parse_local_query)],
) -> list[LocalDataOut]:
    try:
        client = get_supabase()
    except KeyError:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured (SUPABASE_URL and SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY).",
        ) from None
    try:
        return local_repository.list_local_for_city_state(
            client, params.city, params.state
        )
    except Exception:
        logger.exception("GET /local failed")
        raise HTTPException(
            status_code=503,
            detail="Could not load local listings from the database.",
        ) from None
