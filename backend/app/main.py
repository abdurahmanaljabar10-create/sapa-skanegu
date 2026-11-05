
import hashlib
import secrets

from datetime import datetime, timedelta, timezone

from fastapi import Response
from app.schemas import AdminLogin
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from app.database import engine, Base, get_db
from app import models
from app.schemas import StudentRegister


app = FastAPI(
    title="SAPA-SKANEGU API",
    description="Sistem Aspirasi dan Pelaporan Anti-Bullying SMKN 1 Dlanggu",
    version="1.0.0"
)

password_hash = PasswordHash.recommended()


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "application": "SAPA-SKANEGU",
        "message": "Backend berhasil dijalankan!",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/auth/register/student")
def register_student(
    student: StudentRegister,
    db: Session = Depends(get_db)
):
    existing_nisn = db.query(models.User).filter(
        models.User.nisn == student.nisn
    ).first()

    if existing_nisn:
        raise HTTPException(
            status_code=409,
            detail="NISN sudah terdaftar"
        )

    existing_email = db.query(models.User).filter(
        models.User.email == student.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Email sudah terdaftar"
        )

    new_student = models.User(
        full_name=student.full_name,
        account_type="siswa",
        nisn=student.nisn,
        class_name=student.class_name,
        major=student.major,
        email=student.email,
        password_hash=password_hash.hash(student.password)
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Registrasi siswa berhasil",
        "user_id": new_student.id,
        "full_name": new_student.full_name
    }
# ==========================================
# ADMIN LOGIN
# ==========================================

ADMIN_SESSION_COOKIE = "sapa_admin_session"
ADMIN_SESSION_DURATION = timedelta(days=7)



@app.post("/auth/admin/login")
def admin_login(
    data: AdminLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    print("========== DEBUG LOGIN ADMIN ==========")
    print("Username diterima:", repr(data.username))
    print("Panjang password diterima:", len(data.password))
    print("Database:", engine.url.database)

    admin = db.query(models.Admin).filter(
        models.Admin.username == data.username
    ).first()

    print("Admin ditemukan:", admin is not None)

    if admin:
        print("Admin ID:", admin.id)
        print("Admin aktif:", admin.is_active)

        password_valid = password_hash.verify(
            data.password,
            admin.password_hash
        )

        print("Password cocok:", password_valid)
    else:
        password_valid = False
        print("Password cocok: tidak dapat diperiksa")

    print("=======================================")

    if not admin or not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Username atau password salah"
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=403,
            detail="Akun admin tidak aktif"
        )

    session_token = secrets.token_urlsafe(48)

    token_digest = hashlib.sha256(
        session_token.encode()
    ).hexdigest()

    expires_at = datetime.now(timezone.utc) + ADMIN_SESSION_DURATION

    new_session = models.UserSession(
        user_id=admin.id,
        token_hash=token_digest,
        expires_at=expires_at
    )

    db.add(new_session)
    db.commit()

    response.set_cookie(
        key=ADMIN_SESSION_COOKIE,
        value=session_token,
        max_age=int(ADMIN_SESSION_DURATION.total_seconds()),
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

    return {
        "message": "Login admin berhasil",
        "admin": {
            "id": admin.id,
            "username": admin.username,
            "full_name": admin.full_name
        },
        "session_duration_days": 7
    }

    # Membuat token sesi acak
    session_token = secrets.token_urlsafe(48)

    # Database hanya menyimpan hash token
    token_digest = hashlib.sha256(
        session_token.encode()
    ).hexdigest()

    expires_at = datetime.now(timezone.utc) + ADMIN_SESSION_DURATION

    new_session = models.UserSession(
        user_id=admin.id,
        token_hash=token_digest,
        expires_at=expires_at
    )

    db.add(new_session)
    db.commit()

    # Cookie tidak dapat dibaca oleh JavaScript
    response.set_cookie(
        key=ADMIN_SESSION_COOKIE,
        value=session_token,
        max_age=int(ADMIN_SESSION_DURATION.total_seconds()),
        httponly=True,
        secure=False,  # Untuk pengembangan lokal HTTP
        samesite="lax",
        path="/"
    )

    return {
        "message": "Login admin berhasil",
        "admin": {
            "id": admin.id,
            "username": admin.username,
            "full_name": admin.full_name
        },
        "session_duration_days": 7
    }
