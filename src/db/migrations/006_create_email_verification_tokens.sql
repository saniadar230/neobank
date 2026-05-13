CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY default gen_random_uuid(),
    user_id UUID references users(id),
    token VARCHAR(6),
    CHECK (token ~ '^[A-Za-z0-9]{6}$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);