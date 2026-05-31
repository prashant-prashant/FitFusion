"""
FitFusion Backend – Configuration
Reads settings from environment variables with sensible defaults.
"""
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file if present


class Config:
    # ── Flask ──────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    # ── JWT ────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES: int = 60 * 60  # 1 hour (seconds)

    # ── MySQL ──────────────────────────────────────────────────
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", 3306))
    DB_NAME: str = os.getenv("DB_NAME", "fitfusion")
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "fitfusion123")

    # ── CORS ───────────────────────────────────────────────────
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
