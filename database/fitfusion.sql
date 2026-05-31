-- ============================================================
-- FitFusion Database Schema
-- MySQL 8.x Compatible
-- ============================================================

CREATE DATABASE IF NOT EXISTS fitfusion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitfusion;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)         NOT NULL,
    email       VARCHAR(150)         NOT NULL UNIQUE,
    password    VARCHAR(255)         NOT NULL,     -- bcrypt hash
    role        ENUM('user','admin') NOT NULL DEFAULT 'user',
    created_at  TIMESTAMP            DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed admin user  (password: Admin@123 — hashed via bcrypt)
INSERT INTO users (name, email, password, role)
VALUES (
    'Admin',
    'admin@fitfusion.com',
    '$2b$12$Bag/28mzFB6NY4cCdCD3lOHHQZZY0/IoVlElafdm4BeYUVCqJ8iPK',
    'admin'
) ON DUPLICATE KEY UPDATE id=id;

-- ------------------------------------------------------------
-- Table: workouts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workouts (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT          NOT NULL,
    exercise_name VARCHAR(200) NOT NULL,
    sets          INT          NOT NULL DEFAULT 1,
    reps          INT          NOT NULL DEFAULT 1,
    duration      FLOAT        NOT NULL DEFAULT 0,   -- minutes
    notes         TEXT,
    workout_date  DATE         NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workout_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: diet
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diet (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT          NOT NULL,
    meal_name    VARCHAR(200) NOT NULL,
    calories     FLOAT        NOT NULL DEFAULT 0,
    protein      FLOAT        DEFAULT 0,            -- grams
    carbs        FLOAT        DEFAULT 0,            -- grams
    fat          FLOAT        DEFAULT 0,            -- grams
    water_intake FLOAT        DEFAULT 0,            -- litres
    meal_type    ENUM('breakfast','lunch','dinner','snack') DEFAULT 'lunch',
    diet_date    DATE         NOT NULL,
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_diet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: bmi_records
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bmi_records (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT   NOT NULL,
    weight     FLOAT NOT NULL,                  -- kg
    height     FLOAT NOT NULL,                  -- cm
    bmi_value  FLOAT NOT NULL,
    category   VARCHAR(50) NOT NULL,
    record_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bmi_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Indexes for performance
-- ------------------------------------------------------------
CREATE INDEX idx_workouts_user_date ON workouts(user_id, workout_date);
CREATE INDEX idx_diet_user_date ON diet(user_id, diet_date);
CREATE INDEX idx_bmi_user_date ON bmi_records(user_id, record_date);
