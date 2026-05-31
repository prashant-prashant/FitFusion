"""
FitFusion – Workout Model (DB operations)
"""
from database.db import get_db


class WorkoutModel:

    @staticmethod
    def create(user_id, exercise_name, sets, reps, duration, notes, workout_date) -> int:
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO workouts (user_id, exercise_name, sets, reps, duration, notes, workout_date)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (user_id, exercise_name, sets, reps, duration, notes, workout_date),
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
                "SELECT * FROM workouts WHERE user_id = %s ORDER BY workout_date DESC",
                (user_id,),
            )
            return cursor.fetchall()
        finally:
            conn.close()

    @staticmethod
    def get_by_id(workout_id: int, user_id: int) -> dict | None:
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM workouts WHERE id = %s AND user_id = %s",
                (workout_id, user_id),
            )
            return cursor.fetchone()
        finally:
            conn.close()

    @staticmethod
    def update(workout_id, user_id, exercise_name, sets, reps, duration, notes, workout_date) -> bool:
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute(
                """UPDATE workouts SET exercise_name=%s, sets=%s, reps=%s,
                   duration=%s, notes=%s, workout_date=%s
                   WHERE id=%s AND user_id=%s""",
                (exercise_name, sets, reps, duration, notes, workout_date, workout_id, user_id),
            )
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    @staticmethod
    def delete(workout_id: int, user_id: int) -> bool:
        conn = get_db()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM workouts WHERE id = %s AND user_id = %s",
                (workout_id, user_id),
            )
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    @staticmethod
    def get_weekly_summary(user_id: int) -> list[dict]:
        """Aggregate workouts per day for the last 7 days."""
        conn = get_db()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                """SELECT workout_date, COUNT(*) as total_workouts,
                          SUM(duration) as total_duration
                   FROM workouts
                   WHERE user_id=%s AND workout_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                   GROUP BY workout_date ORDER BY workout_date""",
                (user_id,),
            )
            return cursor.fetchall()
        finally:
            conn.close()
