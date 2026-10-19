from collections.abc import AsyncGenerator
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy.pool import NullPool
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


def _asyncpg_url(url: str) -> tuple[str, dict]:
    """
    Accept a hosted-Postgres URL as the provider prints it (Neon, Render, Supabase):
    postgres:// or postgresql:// with ?sslmode=require&channel_binding=require.
    asyncpg rejects those libpq query options, so they become connect_args instead.
    """
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://"):
        url = "postgresql+asyncpg://" + url[len("postgresql://"):]
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query))
    connect_args: dict = {}
    sslmode = query.pop("sslmode", None)
    query.pop("channel_binding", None)
    if sslmode in {"require", "verify-ca", "verify-full"}:
        connect_args["ssl"] = "require" if sslmode == "require" else True
    # A transaction-mode pooler (Neon "-pooler" host, PgBouncer) cannot keep prepared statements.
    behind_pooler = query.pop("pgbouncer", None) == "true" or "-pooler" in (parts.hostname or "")
    if behind_pooler:
        connect_args["statement_cache_size"] = 0
    return urlunsplit(parts._replace(query=urlencode(query))), connect_args


_is_sqlite = settings.DATABASE_URL.startswith("sqlite")

_engine_kwargs: dict = {"echo": settings.DEBUG}

if _is_sqlite:
    # SQLite does not support connection pooling or cross-thread checks
    _database_url = settings.DATABASE_URL
    _engine_kwargs["connect_args"] = {"check_same_thread": False}
    _engine_kwargs["poolclass"] = NullPool
else:
    _database_url, _connect_args = _asyncpg_url(settings.DATABASE_URL)
    if _connect_args:
        _engine_kwargs["connect_args"] = _connect_args
    _engine_kwargs["pool_pre_ping"] = True
    # Free hosted databases allow few connections; DB_POOL_SIZE keeps the default of 10 elsewhere.
    _engine_kwargs["pool_size"] = settings.DB_POOL_SIZE
    _engine_kwargs["max_overflow"] = settings.DB_POOL_SIZE * 2
    # Hosted databases drop idle connections when they suspend; recycle before that.
    _engine_kwargs["pool_recycle"] = 280

engine = create_async_engine(_database_url, **_engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
