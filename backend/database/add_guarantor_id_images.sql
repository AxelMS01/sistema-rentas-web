ALTER TABLE guarantors
ADD COLUMN IF NOT EXISTS ine_front_url TEXT;

ALTER TABLE guarantors
ADD COLUMN IF NOT EXISTS ine_back_url TEXT;
