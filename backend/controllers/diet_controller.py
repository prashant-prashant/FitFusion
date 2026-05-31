"""
FitFusion – Diet Controller
"""
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from models.diet_model import DietModel
import datetime


def _current_user_id() -> int:
    return int(get_jwt_identity())


def _serialize(row: dict) -> dict:
    """Convert date/datetime objects for JSON."""
    for key in ("diet_date", "created_at"):
        if row.get(key) and hasattr(row[key], "isoformat"):
            row[key] = row[key].isoformat()
    return row


def get_diet():
    """GET /api/diet"""
    records = DietModel.get_by_user(_current_user_id())
    return jsonify([_serialize(r) for r in records]), 200


def add_meal():
    """POST /api/diet"""
    data = request.get_json() or {}
    required = ["meal_name", "calories", "diet_date"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    diet_id = DietModel.create(
        user_id=_current_user_id(),
        meal_name=data["meal_name"],
        calories=float(data["calories"]),
        protein=float(data.get("protein", 0)),
        carbs=float(data.get("carbs", 0)),
        fat=float(data.get("fat", 0)),
        water_intake=float(data.get("water_intake", 0)),
        meal_type=data.get("meal_type", "lunch"),
        diet_date=data["diet_date"],
    )
    return jsonify({"message": "Meal added", "id": diet_id}), 201


def update_meal(diet_id: int):
    """PUT /api/diet/<id>"""
    data = request.get_json() or {}
    user_id = _current_user_id()

    existing = DietModel.get_by_id(diet_id, user_id)
    if not existing:
        return jsonify({"error": "Meal not found"}), 404

    DietModel.update(
        diet_id=diet_id,
        user_id=user_id,
        meal_name=data.get("meal_name", existing["meal_name"]),
        calories=float(data.get("calories", existing["calories"])),
        protein=float(data.get("protein", existing["protein"])),
        carbs=float(data.get("carbs", existing["carbs"])),
        fat=float(data.get("fat", existing["fat"])),
        water_intake=float(data.get("water_intake", existing["water_intake"])),
        meal_type=data.get("meal_type", existing["meal_type"]),
        diet_date=data.get("diet_date", existing["diet_date"]),
    )
    return jsonify({"message": "Meal updated"}), 200


def delete_meal(diet_id: int):
    """DELETE /api/diet/<id>"""
    deleted = DietModel.delete(diet_id, _current_user_id())
    if not deleted:
        return jsonify({"error": "Meal not found"}), 404
    return jsonify({"message": "Meal deleted"}), 200


def get_daily_summary():
    """GET /api/diet/summary?date=YYYY-MM-DD"""
    date = request.args.get("date", datetime.date.today().isoformat())
    summary = DietModel.get_daily_summary(_current_user_id(), date)
    return jsonify(summary), 200
