
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    account_type = Column(String(30), nullable=False)

    nisn = Column(String(10), unique=True, nullable=True, index=True)
    nip = Column(String(30), unique=True, nullable=True, index=True)
    email = Column(String(150), unique=True, nullable=True)

    class_name = Column(String(20), nullable=True)
    major = Column(String(50), nullable=True)
    school_role = Column(String(50), nullable=True)

    password_hash = Column(String(255), nullable=False)

    account_status = Column(
        String(20),
        default="pending",
        nullable=False
    )

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    token_hash = Column(String(255), unique=True, nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    revoked_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(150), nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    admin_id = Column(
        Integer,
        ForeignKey("admins.id"),
        nullable=False,
        index=True
    )

    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=True)
    target_id = Column(Integer, nullable=True)
    description = Column(String(255), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
