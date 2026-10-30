import asyncio
import os

from sqlalchemy import select

from app.core.security import hash_password
from app.database.session import AsyncSessionLocal
from app.models.user import User


async def reset_admin_password() -> None:
    new_password = os.getenv("ADMIN_NEW_PASSWORD", "")
    if len(new_password) < 12:
        raise SystemExit("Set ADMIN_NEW_PASSWORD (12+ characters) before running this script.")

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(User).where(User.email == "admin@dkservice.com")
        )
        user = result.scalar_one_or_none()

        if user is None:
            raise RuntimeError("Admin user with email admin@dkservice.com was not found.")

        user.hashed_password = hash_password(new_password)
        user.is_active = True
        await db.commit()
        print("Success: admin password reset")


if __name__ == "__main__":
    asyncio.run(reset_admin_password())
