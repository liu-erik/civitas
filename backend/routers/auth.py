from fastapi import APIRouter, HTTPException, Request

from middleware.rate_limit import limiter
from models.schemas import AuthTokensResponse, LoginRequest, SignupRequest

router = APIRouter(tags=["auth"])


@router.post(
    "/auth/signup",
    response_model=AuthTokensResponse,
    summary="Create account",
)
@limiter.limit("5/minute")
async def signup(request: Request, body: SignupRequest) -> AuthTokensResponse:
    raise HTTPException(
        status_code=501,
        detail="Auth signup not implemented yet.",
    )


@router.post(
    "/auth/login",
    response_model=AuthTokensResponse,
    summary="Login",
)
@limiter.limit("5/minute")
async def login(request: Request, body: LoginRequest) -> AuthTokensResponse:
    raise HTTPException(
        status_code=501,
        detail="Auth login not implemented yet.",
    )
