"""
FitFusion – Admin Routes Blueprint
"""
from flask import Blueprint, jsonify
from utils.jwt_helper import admin_required
from models.user_model import UserModel
from database.db import get_db

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.get("/users")
@admin_required
def get_users():
    """Return list of all users."""
    users = UserModel.get_all()
    for u in users:
        if hasattr(u.get("created_at"), "isoformat"):
            u["created_at"] = u["created_at"].isoformat()
    return jsonify(users), 200


@admin_bp.delete("/users/<int:user_id>")
@admin_required
def delete_user(user_id: int):
    deleted = UserModel.delete(user_id)
    if not deleted:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted"}), 200


@admin_bp.get("/reports")
@admin_required
def get_reports():
    """Aggregate stats for admin dashboard."""
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("SELECT COUNT(*) as total_workouts FROM workouts")
        total_workouts = cursor.fetchone()["total_workouts"]

        cursor.execute("SELECT COUNT(*) as total_meals FROM diet")
        total_meals = cursor.fetchone()["total_meals"]

        cursor.execute("SELECT COUNT(*) as total_bmi FROM bmi_records")
        total_bmi = cursor.fetchone()["total_bmi"]

        # Recent 5 registrations
        cursor.execute(
            "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5"
        )
        recent_users = cursor.fetchall()
        for u in recent_users:
            if hasattr(u.get("created_at"), "isoformat"):
                u["created_at"] = u["created_at"].isoformat()
    finally:
        conn.close()

    return jsonify({
        "total_users": total_users,
        "total_workouts": total_workouts,
        "total_meals": total_meals,
        "total_bmi_records": total_bmi,
        "recent_users": recent_users,
    }), 200
