"""
FitFusion – JWT Helper Utilities
"""
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from functools import wraps
from flask import jsonify
import datetime


def generate_token(user_id: int, role: str) -> str:
    """Generate a signed JWT access token."""
    additional_claims = {"role": role}
    return create_access_token(
        identity=str(user_id),
        additional_claims=additional_claims,
        expires_delta=datetime.timedelta(hours=1),
    )


def admin_required(fn):
    """Decorator: endpoint requires admin role inside JWT."""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper
