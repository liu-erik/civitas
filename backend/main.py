import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from middleware.rate_limit import limiter
from routers import auth, chat, local, topics

load_dotenv()


def _cors_origins() -> list[str]:
    env = os.getenv("ENV", "development").lower()
    production = env in ("production", "prod")
    if production:
        origin = os.getenv("FRONTEND_ORIGIN", "").strip()
        return [origin] if origin else []
    return ["http://localhost:5173", "http://127.0.0.1:5173"]


app = FastAPI(
    title="Civitas API",
    description="Civic education API for Civitas (CLAUDE.md).",
    redirect_slashes=False,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(topics.router)
app.include_router(local.router)
app.include_router(auth.router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
