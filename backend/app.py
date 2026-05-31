"""
FitFusion – Flask Application Entry Point
"""
import sys
import os

# Make sure backend/ is in sys.path when running directly
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

# ── Import Blueprints ──────────────────────────────────────────
from routes.auth_routes import auth_bp
from routes.workout_routes import workout_bp
from routes.diet_routes import diet_bp
from routes.bmi_routes import bmi_bp
from routes.admin_routes import admin_bp


def create_app() -> Flask:
    app = Flask(__name__)

    # ── Config ────────────────────────────────────────────────
    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
    app.config["DEBUG"] = Config.DEBUG

    # ── Extensions ────────────────────────────────────────────
    CORS(app, resources={r"/api/*": {"origins": Config.FRONTEND_URL}}, supports_credentials=True)
    JWTManager(app)

    # ── Register Blueprints ────────────────────────────────────
    app.register_blueprint(auth_bp)
    app.register_blueprint(workout_bp)
    app.register_blueprint(diet_bp)
    app.register_blueprint(bmi_bp)
    app.register_blueprint(admin_bp)

    # ── Health check ──────────────────────────────────────────
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "app": "FitFusion API"}), 200

    # ── Generic error handlers ────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
