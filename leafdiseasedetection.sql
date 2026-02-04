BEGIN;

-- =========================
-- ENUM TYPES
-- =========================
CREATE TYPE growth_stage_enum AS ENUM ('Seeding','Growing','Mature');
CREATE TYPE analysis_status_enum AS ENUM ('Pending','InProgress','Completed');

-- =========================
-- ADMIN
-- =========================
CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP
);

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    profile_picture_url VARCHAR(255)
);

-- =========================
-- DATASET
-- =========================
CREATE TABLE dataset (
    dataset_id SERIAL PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(50),
    description TEXT,
    total_images INTEGER NOT NULL,
    total_classes INTEGER NOT NULL,
    target_classes JSONB,
    used_for_training BOOLEAN NOT NULL DEFAULT TRUE,
    url VARCHAR(512),
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- LEAF IMAGE
-- =========================
CREATE TABLE leafimage (
    image_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    capture_date TIMESTAMP,
    plant_species_guess VARCHAR(100),
    disease_prediction VARCHAR(100),
    confidence NUMERIC(5,4),
    analysis_status analysis_status_enum NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_leafimage_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================
-- USER HISTORY
-- =========================
CREATE TABLE user_history (
    image_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    capture_date TIMESTAMP,
    plant_species_guess VARCHAR(100),
    disease_prediction VARCHAR(100),
    confidence NUMERIC(5,4),
    analysis_status analysis_status_enum NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_userhistory_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================
-- DISEASE REPORT
-- =========================
CREATE TABLE diseasereport (
    report_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    image_id INTEGER,
    detected_diseases TEXT,
    symptoms TEXT,
    treatment_recommendations TEXT,
    fertilizer_recommendation_id INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_diseasereport_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_diseasereport_image
        FOREIGN KEY (image_id) REFERENCES leafimage(image_id)
);

-- =========================
-- FERTILIZER CALCULATOR
-- =========================
CREATE TABLE fertilizercalculator (
    calc_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    plant_type VARCHAR(100) NOT NULL,
    soil_area_sqft REAL NOT NULL,
    growth_stage growth_stage_enum NOT NULL,
    recommended_amount REAL,
    calculation_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_fertilizer_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================
-- FEEDBACK
-- =========================
CREATE TABLE feedback (
    feedback_id BIGSERIAL PRIMARY KEY,
    image_id INTEGER,
    diagnosis_id BIGINT,
    user_id INTEGER,
    description TEXT NOT NULL,
    action_requested VARCHAR(30) DEFAULT 'None',
    status VARCHAR(30) DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    consent_used BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_feedback_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_feedback_image
        FOREIGN KEY (image_id) REFERENCES leafimage(image_id)
);

-- =========================
-- NOTIFICATION
-- =========================
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    admin_id INTEGER,
    feedback_id BIGINT,
    type VARCHAR(50) NOT NULL,
    content_summary VARCHAR(255) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_actioned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_notification_feedback
        FOREIGN KEY (feedback_id) REFERENCES feedback(feedback_id)
);

-- =========================
-- TRIGGERS (ON UPDATE TIMESTAMP)
-- =========================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_feedback_updated
BEFORE UPDATE ON feedback
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE FUNCTION update_dataset_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dataset_updated
BEFORE UPDATE ON dataset
FOR EACH ROW
EXECUTE FUNCTION update_dataset_timestamp();

COMMIT;
