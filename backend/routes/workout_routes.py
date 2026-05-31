"""
FitFusion – Workout Routes Blueprint
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.workout_controller import (
    get_workouts, add_workout, update_workout,
    delete_workout, get_weekly_summary
)

workout_bp = Blueprint("workout", __name__, url_prefix="/api/workouts")

workout_bp.get("/")(jwt_required()(get_workouts))
workout_bp.post("/")(jwt_required()(add_workout))
workout_bp.put("/<int:workout_id>")(jwt_required()(update_workout))
workout_bp.delete("/<int:workout_id>")(jwt_required()(delete_workout))
workout_bp.get("/summary/weekly")(jwt_required()(get_weekly_summary))
