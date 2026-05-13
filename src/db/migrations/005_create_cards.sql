DO $$BEGIN
    CREATE TYPE card_type AS ENUM('virtual', 'physical');
EXCEPTION WHEN duplicate_object THEN
    NULL;
END;$$;

DO $$BEGIN
    CREATE TYPE card_status AS ENUM('active', 'blocked', 'expired');
EXCEPTION WHEN duplicate_object THEN
    NULL;
END;$$;

CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY default gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id),    
    card_type card_type,
    card_number VARCHAR(16),
    CHECK(card_number ~ '^[0-9]{16}$'),

    card_status card_status default 'active',

    expiry_month SMALLINT,
    CHECK (expiry_month >= 1 AND expiry_month <= 12),

    expiry_year SMALLINT,
    CHECK (expiry_year >= 2000 AND expiry_year <= 2099),

    cvc SMALLINT,
    CHECK(cvc >= 100 AND cvc <= 999 ),
    
    is_locked BOOLEAN default false,

    card_pin VARCHAR(60),
    CHECK(card_pin ~ '^[0-9]{4}$')
)