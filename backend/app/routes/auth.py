import time
from collections import defaultdict, deque
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, decode_token
from app.database.session import get_db
from app.dependencies import bearer_scheme, get_current_user
from app.models.activity_log import ActionType, EntityType
from app.models.revoked_token import RevokedToken
from app.models.user import User
from app.schemas.common import RefreshRequest, TokenResponse
from app.schemas.user import UserLogin
from app.services.activity_log_service import ActivityLogService
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Brute-force guard: failed logins per (client IP, username), kept in memory per process.
_MAX_FAILED_LOGINS = 5
_LOGIN_WINDOW_SECONDS = 15 * 60
_failed_logins: dict[tuple[str, str], deque[float]] = defaultdict(deque)


def _login_key(request: Request, username: str) -> tuple[str, str]:
    return (request.client.host if request.client else "unknown", username.strip().lower())


def _recent_failures(key: tuple[str, str]) -> deque[float]:
    attempts = _failed_logins[key]
    cutoff = time.monotonic() - _LOGIN_WINDOW_SECONDS
    while attempts and attempts[0] < cutoff:
        attempts.popleft()
    if not attempts:
        _failed_logins.pop(key, None)
    return attempts


@router.post("/login", response_model=TokenResponse)
async def login(request: Request, credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    key = _login_key(request, credentials.username)
    if len(_recent_failures(key)) >= _MAX_FAILED_LOGINS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Try again in 15 minutes.",
        )
    user = await UserService(db).authenticate(credentials.username, credentials.password)
    if not user:
        _failed_logins[key].append(time.monotonic())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    _failed_logins.pop(key, None)
    await ActivityLogService(db).log(
        user_id=user.id,
        action=ActionType.USER_LOGIN,
        entity_type=EntityType.USER,
        entity_id=user.id,
    )
    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, summary="Revoke access token")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        payload = decode_token(credentials.credentials)
        jti: str | None = payload.get("jti")
        exp = payload.get("exp")
        if jti and exp:
            expires_at = datetime.fromtimestamp(exp, tz=UTC)
            db.add(RevokedToken(jti=jti, expires_at=expires_at))
            # Prune expired revocation records to keep the table small
            await db.execute(
                delete(RevokedToken).where(RevokedToken.expires_at < datetime.now(UTC))
            )
            await db.commit()
    except (ValueError, Exception):
        pass  # token already invalid, nothing to revoke

    await ActivityLogService(db).log(
        user_id=current_user.id,
        action=ActionType.USER_LOGOUT,
        entity_type=EntityType.USER,
        entity_id=current_user.id,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    try:
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            raise ValueError("Not a refresh token")
        user_id = int(payload["sub"])
        jti: str | None = payload.get("jti")
        exp = payload.get("exp")
    except (ValueError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    if jti:
        revoked = await db.execute(select(RevokedToken).where(RevokedToken.jti == jti))
        if revoked.scalar_one_or_none() is not None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user = await UserService(db).get_by_id(user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if jti and exp:
        # Rotate: a refresh token works once, so a stolen copy dies after the real client refreshes.
        db.add(RevokedToken(jti=jti, expires_at=datetime.fromtimestamp(exp, tz=UTC)))
        await db.commit()
    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )
