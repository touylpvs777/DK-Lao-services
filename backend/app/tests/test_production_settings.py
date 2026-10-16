"""Production safety: unsafe settings stop the server, API docs stay hidden, no default admin password."""
import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import app.main as main
from app.core.config import Settings
from app.core.security import verify_password
from app.models.user import User

pytestmark = pytest.mark.anyio

GOOD = dict(
    ENVIRONMENT="production", DEBUG=False, SECRET_KEY="k" * 48,
    ALLOWED_ORIGINS=["https://crm.example.com"], STOREFRONT_INTEGRATION_TOKEN="t" * 64,
)


def settings(**overrides) -> Settings:
    return Settings(**{**GOOD, **overrides})


async def test_good_production_settings_have_no_problems():
    errors, warnings = settings().production_problems()
    assert errors == [] and warnings == []


@pytest.mark.parametrize("overrides, fragment", [
    ({"SECRET_KEY": "changeme-use-a-strong-secret-in-production"}, "SECRET_KEY"),
    ({"SECRET_KEY": "short"}, "SECRET_KEY"),
    ({"DEBUG": True}, "DEBUG"),
    ({"ALLOWED_ORIGINS": ["*"]}, "ALLOWED_ORIGINS"),
    ({"STOREFRONT_INTEGRATION_TOKEN": "weak"}, "STOREFRONT_INTEGRATION_TOKEN"),
])
async def test_unsafe_production_settings_are_errors(overrides, fragment):
    errors, _ = settings(**overrides).production_problems()
    assert any(fragment in e for e in errors)


async def test_local_and_plain_http_origins_only_warn():
    errors, warnings = settings(ALLOWED_ORIGINS=["http://localhost:5173", "http://crm.example.com"]).production_problems()
    assert errors == []
    assert len(warnings) == 2


async def test_an_unset_storefront_token_is_allowed():
    assert settings(STOREFRONT_INTEGRATION_TOKEN="").production_problems()[0] == []


async def test_api_docs_hidden_in_production_unless_enabled():
    assert settings().docs_enabled is False
    assert settings(ENABLE_API_DOCS=True).docs_enabled is True
    assert Settings(ENVIRONMENT="development").docs_enabled is True
    assert settings(ENVIRONMENT=" Production ").is_production is True


async def test_production_does_not_create_the_known_default_admin(db_session: AsyncSession, monkeypatch):
    monkeypatch.setattr(main.settings, "ENVIRONMENT", "production")
    monkeypatch.setattr(main.settings, "DEFAULT_ADMIN_EMAIL", "")
    monkeypatch.setattr(main.settings, "DEFAULT_ADMIN_PASSWORD", "")
    await main._seed_defaults(db_session)
    assert (await db_session.execute(select(User))).scalars().all() == []


async def test_production_rejects_a_weak_first_admin_password(db_session: AsyncSession, monkeypatch):
    monkeypatch.setattr(main.settings, "ENVIRONMENT", "production")
    monkeypatch.setattr(main.settings, "DEFAULT_ADMIN_EMAIL", "owner@example.com")
    monkeypatch.setattr(main.settings, "DEFAULT_ADMIN_PASSWORD", "short")
    await main._seed_defaults(db_session)
    assert (await db_session.execute(select(User))).scalars().all() == []


async def test_production_creates_the_first_admin_from_the_owners_settings(db_session: AsyncSession, monkeypatch):
    monkeypatch.setattr(main.settings, "ENVIRONMENT", "production")
    monkeypatch.setattr(main.settings, "DEFAULT_ADMIN_EMAIL", "owner@example.com")
    monkeypatch.setattr(main.settings, "DEFAULT_ADMIN_PASSWORD", "A-long-owner-password-1")
    await main._seed_defaults(db_session)
    admin = (await db_session.execute(select(User))).scalars().one()
    assert admin.email == "owner@example.com" and admin.is_superuser
    assert verify_password("A-long-owner-password-1", admin.hashed_password)
    assert not verify_password("Admin@123", admin.hashed_password)


async def test_development_still_bootstraps_the_default_admin(db_session: AsyncSession, monkeypatch):
    monkeypatch.setattr(main.settings, "ENVIRONMENT", "development")
    await main._seed_defaults(db_session)
    admin = (await db_session.execute(select(User))).scalars().one()
    assert admin.email == "admin@dkservice.com"
