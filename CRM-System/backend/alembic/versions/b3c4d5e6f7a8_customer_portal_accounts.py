"""Add customer portal accounts.

Revision ID: b3c4d5e6f7a8
Revises: a2b3c4d5e6f7
Create Date: 2026-10-13
"""

from alembic import op
import sqlalchemy as sa


revision = "b3c4d5e6f7a8"
down_revision = "a2b3c4d5e6f7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "customer_portal_accounts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=100), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("token_version", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("customer_id", name="uq_customer_portal_customer"),
        sa.UniqueConstraint("username"),
    )
    op.create_index("ix_customer_portal_accounts_id", "customer_portal_accounts", ["id"])
    op.create_index("ix_customer_portal_accounts_customer_id", "customer_portal_accounts", ["customer_id"])
    op.create_index("ix_customer_portal_accounts_username", "customer_portal_accounts", ["username"])


def downgrade() -> None:
    op.drop_index("ix_customer_portal_accounts_username", table_name="customer_portal_accounts")
    op.drop_index("ix_customer_portal_accounts_customer_id", table_name="customer_portal_accounts")
    op.drop_index("ix_customer_portal_accounts_id", table_name="customer_portal_accounts")
    op.drop_table("customer_portal_accounts")
