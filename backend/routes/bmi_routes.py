"""
FitFusion – BMI Routes Blueprint
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.bmi_controller import calculate_bmi, get_bmi_history

bmi_bp = Blueprint("bmi", __name__, url_prefix="/api/bmi")

bmi_bp.post("/calculate")(jwt_required()(calculate_bmi))
bmi_bp.get("/history")(jwt_required()(get_bmi_history))
