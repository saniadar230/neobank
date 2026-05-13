
DO $$BEGIN
    CREATE TYPE kyc_status AS ENUM ('not_submitted', 'pending', 'under_review', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN
    NULL;
END;$$;

CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id),
    cnic_front_url VARCHAR UNIQUE NOT NULL,
    cnic_back_url VARCHAR UNIQUE NOT NULL,
    selfie_url VARCHAR UNIQUE NOT NULL,
    kyc_status kyc_status NOT NULL DEFAULT 'not_submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)