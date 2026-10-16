import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    APP_NAME: str = "DK CRM API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    # Set to "production" on the public server. Production turns off the API docs, refuses to start
    # with unsafe settings (see production_problems) and does not create a default admin account.
    ENVIRONMENT: str = "development"
    # Production only: set true to keep /docs and /openapi.json reachable.
    ENABLE_API_DOCS: bool = False

    DATABASE_URL: str = "sqlite+aiosqlite:///./crm.db"

    SECRET_KEY: str = "changeme-use-a-strong-secret-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Shared secret for the public storefront server (catalog reads and inquiry intake).
    # Must match CRM_STOREFRONT_TOKEN in storefront/.env.local. Empty disables those endpoints.
    STOREFRONT_INTEGRATION_TOKEN: str = ""

    UPLOAD_DIR: str = "uploads/images"
    MAX_UPLOAD_SIZE_MB: int = 5

    # ── Notifications: WhatsApp Business API (primary channel) ──────────────
    WHATSAPP_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_API_BASE_URL: str = "https://graph.facebook.com"
    WHATSAPP_API_VERSION: str = "v20.0"

    # ── Notifications: SMTP email (fallback channel) ─────────────────────────
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "no-reply@dkservice.com"
    SMTP_USE_TLS: bool = True

    # ── IoT Telemetry (forklift GPS/hour-meter device webhook) ───────────────
    IOT_WEBHOOK_API_KEY: str = ""

    # ── Initial admin user (seed_admin.py / scripts/rotate_admin_password.py) ─
    # Not used by the running app itself — only read by the seed/rotation
    # scripts, which fail loudly if email/password are unset.
    DEFAULT_ADMIN_EMAIL: str = ""
    DEFAULT_ADMIN_PASSWORD: str = ""
    DEFAULT_ADMIN_USERNAME: str = "admin"
    DEFAULT_ADMIN_FULL_NAME: str = "System Administrator"

    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    SERVICE_API_KEY: str = os.getenv("SERVICE_API_KEY", "")

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.strip().lower() == "production"

    @property
    def docs_enabled(self) -> bool:
        return (not self.is_production) or self.ENABLE_API_DOCS

    def production_problems(self) -> tuple[list[str], list[str]]:
        """Return (errors, warnings). Errors must stop a production start; warnings are logged."""
        errors: list[str] = []
        warnings: list[str] = []
        if self.SECRET_KEY.lower().startswith("changeme") or len(self.SECRET_KEY) < 32:
            errors.append("SECRET_KEY is the placeholder or shorter than 32 characters, so login tokens could be forged")
        if self.DEBUG:
            errors.append("DEBUG must be false")
        if "*" in self.ALLOWED_ORIGINS:
            errors.append("ALLOWED_ORIGINS must list your real domains, not *")
        if self.STOREFRONT_INTEGRATION_TOKEN and len(self.STOREFRONT_INTEGRATION_TOKEN) < 32:
            errors.append("STOREFRONT_INTEGRATION_TOKEN is shorter than 32 characters")
        local = [o for o in self.ALLOWED_ORIGINS if "localhost" in o or "127.0.0.1" in o]
        if local:
            warnings.append(f"ALLOWED_ORIGINS still lists local addresses: {', '.join(local)}")
        insecure = [o for o in self.ALLOWED_ORIGINS if o.startswith("http://") and o not in local]
        if insecure:
            warnings.append(f"ALLOWED_ORIGINS has non-HTTPS origins: {', '.join(insecure)}")
        return errors, warnings


settings = Settings()

