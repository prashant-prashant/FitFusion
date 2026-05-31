"""
FitFusion – User Model (DB operations)
"""
from database.db import get_db


class UserModel:

    @staticmethod
    def create(name: str, email: str, password_hash: str, role: str = "user") -> int:
        """Insert a new user and return the new id."""
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                (name, email, password_hash, role),
            )
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()

    @staticmethod
    def find_by_email(email: str) -> dict | None:
        """Return user dict or None if not found."""
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            return cursor.fetchone()
        finally:
            conn.close()

    @staticmethod
    def find_by_id(user_id: int) -> dict | None:
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT id, name, email, role, created_at FROM users WHERE id = %s",
                (user_id,),
            )
            return cursor.fetchone()
        finally:
            conn.close()

    @staticmethod
    def get_all() -> list[dict]:
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
            )
            return cursor.fetchall()
        finally:
            conn.close()

    @staticmethod
    def delete(user_id: int) -> bool:
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()
