from __future__ import annotations

import re
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

_HTML_TAG_RE = re.compile(r"<[^>]*>")


def strip_html(value: str) -> str:
    """Remove HTML tags and trim whitespace (CLAUDE.md security rules)."""
    return _HTML_TAG_RE.sub("", value).strip()


class Source(BaseModel):
    title: str = Field(..., max_length=500)
    url: str
    summary: str = Field(..., max_length=2000)

    @field_validator("url", mode="before")
    @classmethod
    def _url_as_str(cls, v: Any) -> Any:
        return str(v) if v is not None else v


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    language_code: str = Field(..., min_length=2, max_length=10)

    @field_validator("question", mode="before")
    @classmethod
    def _clean_question(cls, v: Any) -> Any:
        if isinstance(v, str):
            return strip_html(v)
        return v

    @field_validator("language_code", mode="before")
    @classmethod
    def _clean_lang(cls, v: Any) -> Any:
        if isinstance(v, str):
            return strip_html(v).lower()
        return v


class ChatResponseBody(BaseModel):
    response: str
    sources: list[Source] = Field(default_factory=list)


class SignupRequest(BaseModel):
    email: str = Field(..., max_length=320)
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("email", "password", mode="before")
    @classmethod
    def _strip_html_fields(cls, v: Any) -> Any:
        if isinstance(v, str):
            return strip_html(v)
        return v


class LoginRequest(BaseModel):
    email: str = Field(..., max_length=320)
    password: str = Field(..., max_length=128)

    @field_validator("email", "password", mode="before")
    @classmethod
    def _strip_html_fields(cls, v: Any) -> Any:
        if isinstance(v, str):
            return strip_html(v)
        return v


class AuthTokensResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int | None = None


class LocalQueryParams(BaseModel):
    city: str = Field(..., max_length=100)
    state: str = Field(..., max_length=50)

    @field_validator("city", "state", mode="before")
    @classmethod
    def _strip_html_fields(cls, v: Any) -> Any:
        if isinstance(v, str):
            return strip_html(v)
        return v


class CategoryOut(BaseModel):
    id: str
    slug: str
    icon: str
    color: str
    name: str
    description: str
    topic_count: int = 0


class TopicSummaryOut(BaseModel):
    id: str
    slug: str
    title: str


class TopicExplanationOut(BaseModel):
    id: str
    category_id: str
    slug: str
    title: str
    what_it_is: str | None = None
    why_it_matters: str | None = None
    what_you_can_do: str | None = None


class LocalDataOut(BaseModel):
    id: str
    type: Literal["representative", "organization", "event"]
    city: str | None = None
    state: str | None = None
    data: dict[str, Any] = Field(default_factory=dict)
