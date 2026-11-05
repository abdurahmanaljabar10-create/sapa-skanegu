
import sys
from pathlib import Path
from getpass import getpass

# Mengatur lokasi agar modul app bisa ditemukan
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models


password_hash = PasswordHash.recommended()


def create_admin(db: Session, username: str):
    existing = db.query(models.Admin).filter(
        models.Admin.username == username
    ).first()

    if existing:
        print(f"Akun {username} sudah tersedia. Dilewati.")
        return

    print(f"\nMembuat akun {username}")

    full_name = input("Nama lengkap admin: ").strip()

    if len(full_name) < 3:
        print("Nama harus minimal 3 karakter.")
        return

    password = getpass("Masukkan password: ")

    if len(password) < 12:
        print("Password minimal 12 karakter.")
        return

    confirmation = getpass("Ulangi password: ")

    if password != confirmation:
        print("Password tidak cocok.")
        return

    admin = models.Admin(
        username=username,
        full_name=full_name,
        password_hash=password_hash.hash(password),
        is_active=True
    )

    db.add(admin)
    db.commit()

    print(f"Akun {username} berhasil dibuat!")


def main():
    db = SessionLocal()

    try:
        create_admin(db, "admin01")
        create_admin(db, "admin02")

    except Exception:
        db.rollback()
        print("Terjadi kesalahan saat membuat akun.")

    finally:
        db.close()


if __name__ == "__main__":
    main()
