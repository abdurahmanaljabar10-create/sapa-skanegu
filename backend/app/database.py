from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Menentukan lokasi database
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATABASE_DIR = PROJECT_ROOT / "database"

# Membuat folder database jika belum tersedia
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_FILE = DATABASE_DIR / "sapa_skanegu.db"
DATABASE_URL = f"sqlite:///{DATABASE_FILE.as_posix()}"

# Membuat koneksi SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Membuat session database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Fondasi seluruh tabel database
class Base(DeclarativeBase):
    pass


# Dependency untuk koneksi database
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()