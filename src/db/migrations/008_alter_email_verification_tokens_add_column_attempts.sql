ALTER TABLE IF EXISTS email_verification_tokens
ADD COLUMN attempts SMALLINT NOT NULL DEFAULT 0
CHECK (attempts <= 3);