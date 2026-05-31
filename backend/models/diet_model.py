"""
FitFusion – Diet Model (DB operations)
"""
from database.db import get_db


class DietModel:

    @staticmethod
    def create(user_id, meal_name, calories, protein, carbs, fat, water_intake, meal_type, diet_date) -> int:
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO diet (user_id, meal_name, calories, protein, carbs, fat, water_intake, meal_type, diet_date)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (user_id, meal_name, calories, protein, carbs, fat, water_intake, meal_type, diet_date),
            )
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()

    @staticmethod
    def get_by_user(user_id: int) -> list[dict]:
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM diet WHERE user_id = %s ORDER BY diet_date DESC",
                (user_id,),
            )
            return cursor.fetchall()
        finally:
            conn.close()

    @staticmethod
    def get_by_id(diet_id: int, user_id: int) -> dict | None:
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM diet WHERE id = %s AND user_id = %s",
                (diet_id, user_id),
            )
            return cursor.fetchone()
        finally:
            conn.close()

    @staticmethod
    def update(diet_id, user_id, meal_name, calories, protein, carbs, fat, water_intake, meal_type, diet_date) -> bool:
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute(
                """UPDATE diet SET meal_name=%s, calories=%s, protein=%s, carbs=%s,
                   fat=%s, water_intake=%s, meal_type=%s, diet_date=%s
                   WHERE id=%s AND user_id=%s""",
                (meal_name, calories, protein, carbs, fat, water_intake, meal_type, diet_date, diet_id, user_id),
            )
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    @staticmethod
    def delete(diet_id: int, user_id: int) -> bool:
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM diet WHERE id = %s AND user_id = %s",
                (diet_id, user_id),
            )
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    @staticmethod
    def get_daily_summary(user_id: int, date: str) -> dict:
        """Return total calories and water for a specific date."""
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                """SELECT SUM(calories) as total_calories, SUM(water_intake) as total_water
                   FROM diet WHERE user_id=%s AND diet_date=%s""",
                (user_id, date),
            )
            row = cursor.fetchone()
            return {
                "total_calories": float(row["total_calories"] or 0),
                "total_water": float(row["total_water"] or 0),
            }
        finally:
            conn.close()
