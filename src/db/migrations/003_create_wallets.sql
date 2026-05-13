DO $$BEGIN
    CREATE TYPE currency AS ENUM('USD','PKR','EUR');
EXCEPTION WHEN duplicate_object THEN
    NULL;
END;$$;

CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    balance BIGINT NOT NULL DEFAULT 0,
    currency currency NOT NULL DEFAULT 'PKR',
    account_number BIGSERIAL UNIQUE,
    user_id UUID UNIQUE REFERENCES users(id),


    iban VARCHAR(34) NOT NULL UNIQUE,
    CHECK (iban LIKE 'PK%'),
    CHECK (iban ~ '^[A-Z0-9]+$'),


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)