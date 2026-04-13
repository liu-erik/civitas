from slowapi import Limiter
from slowapi.util import get_remote_address

# Default for any route without an explicit limit (CLAUDE.md: 100/min for non-AI routes)
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],
)
