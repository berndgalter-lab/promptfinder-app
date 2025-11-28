-- PromptFinder: Subscriptions Table for Lemon Squeezy Integration
-- Run this in your Supabase SQL Editor

-- 1. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Lemon Squeezy IDs
  customer_id TEXT,
  subscription_id TEXT UNIQUE,
  order_id TEXT,
  
  -- Status & Plan
  status TEXT CHECK (status IN ('free', 'active', 'past_due', 'canceled', 'paused')) DEFAULT 'free',
  plan_type TEXT CHECK (plan_type IN ('monthly', 'annual')),
  
  -- Dates
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Pricing
  amount INTEGER, -- in cents
  currency TEXT DEFAULT 'USD',
  
  -- Metadata
  lemon_squeezy_data JSONB, -- Store full webhook payload for debugging
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_id ON subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);

-- 3. Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can view their own subscription
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Service role can do everything (needed for webhooks)
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage subscriptions"
ON subscriptions FOR ALL
USING (auth.role() = 'service_role');

-- 5. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- 7. Helper function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sub_status TEXT;
  period_end TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT status, current_period_end 
  INTO sub_status, period_end
  FROM subscriptions 
  WHERE user_id = check_user_id;
  
  IF sub_status IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF sub_status IN ('active', 'past_due') THEN
    IF period_end IS NULL OR period_end > NOW() THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Done! Test with:
-- SELECT has_active_subscription(auth.uid());

