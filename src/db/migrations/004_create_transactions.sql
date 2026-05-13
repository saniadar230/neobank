DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM('pending', 'succeeded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM('credit', 'debit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE currency AS ENUM('USD', 'PKR', 'EUR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount BIGINT NOT NULL,
    CHECK (amount > 100),
    status transaction_status NOT NULL DEFAULT 'pending',
    type transaction_type NOT NULL,
    to_wallet UUID REFERENCES wallets(id),
    from_wallet UUID REFERENCES wallets(id),
    currency currency NOT NULL DEFAULT 'PKR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)