"""
FitFusion – Workout Controller
"""
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from models.workout_model import WorkoutModel
import datetime


def _current_user_id() -> int:
    return int(get_jwt_identity())


def get_workouts():
    """GET /api/workouts"""
    workouts = WorkoutModel.get_by_user(_current_user_id())
    # Convert date objects to string for JSON serialization
    for w in workouts:
        if hasattr(w.get("workout_date"), "isoformat"):
            w["workout_date"] = w["workout_date"].isoformat()
        if hasattr(w.get("created_at"), "isoformat"):
            w["created_at"] = w["created_at"].isoformat()
    return jsonify(workouts), 200


def add_workout():
    """POST /api/workouts"""
    data = request.get_json() or {}
    required = ["exercise_name", "sets", "reps", "duration", "workout_date"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    workout_id = WorkoutModel.create(
        user_id=_current_user_id(),
        exercise_name=data["exercise_name"],
        sets=int(data["sets"]),
        reps=int(data["reps"]),
        duration=float(data["duration"]),
        notes=data.get("notes", ""),
        workout_date=data["workout_date"],
    )
    return jsonify({"message": "Workout added", "id": workout_id}), 201


def update_workout(workout_id: int):
    """PUT /api/workouts/<id>"""
    data = request.get_json() or {}
    user_id = _current_user_id()

    existing = WorkoutModel.get_by_id(workout_id, user_id)
    if not existing:
        return jsonify({"error": "Workout not found"}), 404

    updated = WorkoutModel.update(
        workout_id=workout_id,
        user_id=user_id,
        exercise_name=data.get("exercise_name", existing["exercise_name"]),
        sets=int(data.get("sets", existing["sets"])),
        reps=int(data.get("reps", existing["reps"])),
        duration=float(data.get("duration", existing["duration"])),
        notes=data.get("notes", existing["notes"]),
        workout_date=data.get("workout_date", existing["workout_date"]),
    )
    return jsonify({"message": "Workout updated" if updated else "No changes made"}), 200


def delete_workout(workout_id: int):
    """DELETE /api/workouts/<id>"""
    deleted = WorkoutModel.delete(workout_id, _current_user_id())
    if not deleted:
        return jsonify({"error": "Workout not found"}), 404
    return jsonify({"message": "Workout deleted"}), 200


def get_weekly_summary():
    """GET /api/workouts/summary/weekly"""
    summary = WorkoutModel.get_weekly_summary(_current_user_id())
    for row in summary:
        if hasattr(row.get("workout_date"), "isoformat"):
            row["workout_date"] = row["workout_date"].isoformat()
        row["total_duration"] = float(row.get("total_duration") or 0)
    return jsonify(summary), 200
