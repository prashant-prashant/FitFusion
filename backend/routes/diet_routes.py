"""
FitFusion – Diet Routes Blueprint
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.diet_controller import (
    get_diet, add_meal, update_meal, delete_meal, get_daily_summary
)

diet_bp = Blueprint("diet", __name__, url_prefix="/api/diet")

diet_bp.get("/")(jwt_required()(get_diet))
diet_bp.post("/")(jwt_required()(add_meal))
diet_bp.put("/<int:diet_id>")(jwt_required()(update_meal))
diet_bp.delete("/<int:diet_id>")(jwt_required()(delete_meal))
diet_bp.get("/summary")(jwt_required()(get_daily_summary))
