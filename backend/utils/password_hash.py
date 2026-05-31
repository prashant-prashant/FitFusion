"""
FitFusion – Password Hashing Utilities (bcrypt)
"""
import bcrypt


def hash_password(plain_text: str) -> str:
    """Hash a plain-text password and return the bcrypt hash string."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_text.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_text: str, hashed: str) -> bool:
    """Return True if the plain-text matches the stored hash."""
    return bcrypt.checkpw(plain_text.encode("utf-8"), hashed.encode("utf-8"))
