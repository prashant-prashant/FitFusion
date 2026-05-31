"""
FitFusion – Auth Routes Blueprint
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.auth_controller import register, login, get_profile

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

auth_bp.post("/register")(register)
auth_bp.post("/login")(login)
auth_bp.get("/profile")(jwt_required()(get_profile))
