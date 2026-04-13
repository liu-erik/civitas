from fastapi import APIRouter, HTTPException, Request

from middleware.rate_limit import limiter
from models.schemas import ChatRequest, ChatResponseBody

router = APIRouter(tags=["chat"])


@router.post(
    "/chat",
    response_model=ChatResponseBody,
    summary="AI civic question answering",
)
@limiter.limit("10/minute")
async def post_chat(request: Request, body: ChatRequest) -> ChatResponseBody:
    raise HTTPException(
        status_code=501,
        detail="Chat endpoint not implemented yet.",
    )
