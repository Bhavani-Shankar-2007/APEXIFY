from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# If DATABASE_URL is not set, fallback to sqlite memory or a local file for dev
# But we expect the user to provide Supabase Postgres URL
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL or "sqlite:///./test.db"

# Handle async postgres if needed, but for simplicity here we'll use sync SQLAlchemy 
# or standard psycopg2 depending on the URL provided. (Supabase uses postgresql://)

if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
