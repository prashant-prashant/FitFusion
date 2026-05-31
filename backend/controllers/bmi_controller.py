"""
FitFusion – BMI Controller
"""
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from database.db import get_db
import datetime


def _current_user_id() -> int:
    return int(get_jwt_identity())


def _bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal weight"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"


def calculate_bmi():
    """POST /api/bmi/calculate"""
    data = request.get_json() or {}
    weight = data.get("weight")  # kg
    height = data.get("height")  # cm

    if weight is None or height is None:
        return jsonify({"error": "weight (kg) and height (cm) are required"}), 400

    weight = float(weight)
    height_m = float(height) / 100
    if height_m <= 0:
        return jsonify({"error": "Height must be greater than 0"}), 400

    bmi_value = round(weight / (height_m ** 2), 2)
    category = _bmi_category(bmi_value)
    record_date = data.get("date", datetime.date.today().isoformat())

    user_id = _current_user_id()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO bmi_records (user_id, weight, height, bmi_value, category, record_date)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (user_id, weight, float(height), bmi_value, category, record_date),
        )
        conn.commit()
        record_id = cursor.lastrowid
    finally:
        conn.close()

    return jsonify({
        "id": record_id,
        "weight": weight,
        "height": float(height),
        "bmi": bmi_value,
        "category": category,
        "date": record_date,
    }), 201


def get_bmi_history():
    """GET /api/bmi/history"""
    user_id = _current_user_id()
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM bmi_records WHERE user_id=%s ORDER BY record_date DESC",
            (user_id,),
        )
        records = cursor.fetchall()
    finally:
        conn.close()

    for r in records:
        if hasattr(r.get("record_date"), "isoformat"):
            r["record_date"] = r["record_date"].isoformat()
        if hasattr(r.get("created_at"), "isoformat"):
            r["created_at"] = r["created_at"].isoformat()
    return jsonify(records), 200
