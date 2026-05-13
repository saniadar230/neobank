CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Source - https://stackoverflow.com/a/79938183
-- Posted by Laurenz Albe
-- Retrieved 2026-05-08, License - CC BY-SA 4.0
DO $$BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN
    NULL;  -- ignore the error
END;$$;


CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,

    username VARCHAR(30) UNIQUE NOT NULL,
    CHECK (username ~ '^[a-z0-9_]{3,30}$'),
    
    -- will be using bycrypt hash for password (it is fixed length - 60 characters)
    password VARCHAR(60) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

