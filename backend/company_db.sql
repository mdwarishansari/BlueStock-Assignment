-- ============================
-- USERS TABLE
-- ============================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    signup_type CHAR(1) DEFAULT 'e' NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f', 'o')),
    mobile_no VARCHAR(20) UNIQUE NOT NULL,
    is_mobile_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,

    -- 👇 Add new columns here
    email_verification_token TEXT,
    email_verification_expires TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_email_verification_token 
ON users(email_verification_token);


-- ============================
-- COMPANY PROFILE TABLE
-- ============================

CREATE TABLE IF NOT EXISTS company_profile (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT NOT NULL,
    founded_date DATE,
    description TEXT,
    social_links JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

