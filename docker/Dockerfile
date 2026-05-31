# ============================================================
# FitFusion – Backend Dockerfile (Flask / Gunicorn)
# ============================================================

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install Python dependencies (mysql-connector-python is pure Python, no C deps needed)
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Expose Flask/Gunicorn port
EXPOSE 5000

# Run with Gunicorn — 3 worker processes
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "--timeout", "120", "app:create_app()"]
