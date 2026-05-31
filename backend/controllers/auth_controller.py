"""
FitFusion – Auth Controller (business logic)
"""
from flask import jsonify, request
from models.user_model import UserModel
from utils.password_hash import hash_password, verify_password
from utils.jwt_helper import generate_token


def register():
    """POST /api/auth/register"""
    data = request.get_json()

    # Validation
    required = ["name", "email", "password"]
    for field in required:
        if not data or not data.get(field, "").strip():
            return jsonify({"error": f"'{field}' is required"}), 400

    name = data["name"].strip()
    email = data["email"].strip().lower()
    password = data["password"]

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # Check duplicate email
    if UserModel.find_by_email(email):
        return jsonify({"error": "Email already registered"}), 409

    password_hash = hash_password(password)
    user_id = UserModel.create(name, email, password_hash)

    token = generate_token(user_id, "user")
    return jsonify({
        "message": "Registration successful",
        "token": token,
        "user": {"id": user_id, "name": name, "email": email, "role": "user"},
    }), 201


def login():
    """POST /api/auth/login"""
    data = request.get_json()

    email = (data or {}).get("email", "").strip().lower()
    password = (data or {}).get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = UserModel.find_by_email(email)
    if not user or not verify_password(password, user["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user["id"], user["role"])
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }), 200


def get_profile():
    """GET /api/auth/profile — requires JWT"""
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    user = UserModel.find_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200
