from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.intake import IntakeCreate, IntakeResult
from app.services.intake_service import IntakeService

router = APIRouter(prefix="/intake", tags=["Intake"])


@router.post(
    "/",
    response_model=IntakeResult,
    status_code=status.HTTP_201_CREATED,
    summary="Record a customer request taken by staff (phone, chat, walk-in)",
)
async def create_intake(
    data: IntakeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Finds or creates the customer, logs the request as a lead, and drafts the matching document.

    Permissions are checked per request type inside the service, so a role that cannot create
    rental contracts cannot slip one in through this screen either.
    """
    return await IntakeService(db).create(data, current_user)
