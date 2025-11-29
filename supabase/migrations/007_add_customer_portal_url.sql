-- Add customer portal URL to subscriptions table
-- This enables users to manage their subscription via Lemon Squeezy

ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS customer_portal_url TEXT;

-- Add index for portal URL lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_portal_url ON subscriptions(user_id, customer_portal_url);

-- Comment for documentation
COMMENT ON COLUMN subscriptions.customer_portal_url IS 'Lemon Squeezy customer portal URL for subscription management';

-- Update existing subscriptions to have a fallback URL
UPDATE subscriptions 
SET customer_portal_url = 'https://app.lemonsqueezy.com/my-orders'
WHERE customer_portal_url IS NULL AND status IN ('active', 'past_due', 'paused');

