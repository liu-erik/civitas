from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from middleware.rate_limit import limiter
from models.schemas import LocalQueryParams

router = APIRouter(tags=["local"])


def _parse_local_query(
    city: str = Query(..., max_length=100),
    state: str = Query(..., max_length=50),
) -> LocalQueryParams:
    return LocalQueryParams(city=city, state=state)


@router.get("/local")
@limiter.limit("100/minute")
async def get_local(
    request: Request,
    _params: Annotated[LocalQueryParams, Depends(_parse_local_query)],
) -> dict:
    raise HTTPException(
        status_code=501,
        detail="Local data endpoint not implemented yet.",
    )
