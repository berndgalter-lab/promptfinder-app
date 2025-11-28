-- PromptFinder: Usage Tracking Tables
-- Füge dies zu deinem Supabase SQL-Setup hinzu

-- 1. user_usage Tabelle: Verfolgt jede Workflow-Nutzung
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL,
  input_values JSONB DEFAULT '{}'::jsonb,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_workflow_id ON user_usage(workflow_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_used_at ON user_usage(used_at);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_month ON user_usage(user_id, used_at);

-- 2. user_stats Tabelle: Aggregierte User-Statistiken
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_workflows INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für User-Lookup
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- 3. RLS (Row Level Security) Policies
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Users können ihre eigenen Usage-Daten sehen
DROP POLICY IF EXISTS "Users can view own usage" ON user_usage;
CREATE POLICY "Users can view own usage" 
ON user_usage FOR SELECT 
USING (auth.uid() = user_id);

-- Users können ihre eigenen Usage-Daten erstellen
DROP POLICY IF EXISTS "Users can insert own usage" ON user_usage;
CREATE POLICY "Users can insert own usage" 
ON user_usage FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users können ihre eigenen Stats sehen
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
CREATE POLICY "Users can view own stats" 
ON user_stats FOR SELECT 
USING (auth.uid() = user_id);

-- Users können ihre eigenen Stats erstellen/aktualisieren
DROP POLICY IF EXISTS "Users can upsert own stats" ON user_stats;
CREATE POLICY "Users can upsert own stats" 
ON user_stats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
CREATE POLICY "Users can update own stats" 
ON user_stats FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Trigger zum automatischen Inkrementieren der total_workflows
CREATE OR REPLACE FUNCTION increment_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, total_workflows, last_used_at)
  VALUES (NEW.user_id, 1, NEW.used_at)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_workflows = user_stats.total_workflows + 1,
    last_used_at = NEW.used_at,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger erstellen
DROP TRIGGER IF EXISTS trigger_increment_user_stats ON user_usage;
CREATE TRIGGER trigger_increment_user_stats
AFTER INSERT ON user_usage
FOR EACH ROW
EXECUTE FUNCTION increment_user_stats();

-- 5. Hilfsfunktion: Aktuellen Monats-Usage abrufen
CREATE OR REPLACE FUNCTION get_current_month_usage(p_user_id UUID)
RETURNS TABLE(usage_count BIGINT, limit_count INTEGER, can_use BOOLEAN, remaining INTEGER) AS $$
DECLARE
  first_day_of_month TIMESTAMP WITH TIME ZONE;
  usage_this_month BIGINT;
  free_limit INTEGER := 5;
BEGIN
  -- Erster Tag des aktuellen Monats
  first_day_of_month := date_trunc('month', NOW());
  
  -- Zähle Usage in diesem Monat
  SELECT COUNT(*) INTO usage_this_month
  FROM user_usage
  WHERE user_id = p_user_id
    AND used_at >= first_day_of_month;
  
  -- Rückgabe
  RETURN QUERY
  SELECT 
    usage_this_month,
    free_limit,
    (usage_this_month < free_limit),
    GREATEST(0, free_limit - usage_this_month);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Berechtigungen für die Funktion
GRANT EXECUTE ON FUNCTION get_current_month_usage(UUID) TO authenticated;

-- 6. View für einfache Usage-Abfragen
CREATE OR REPLACE VIEW user_monthly_usage AS
SELECT 
  u.user_id,
  DATE_TRUNC('month', u.used_at) as month,
  COUNT(*) as usage_count,
  5 as limit_count,
  (COUNT(*) < 5) as can_use
FROM user_usage u
GROUP BY u.user_id, DATE_TRUNC('month', u.used_at);

-- Grant SELECT auf View
GRANT SELECT ON user_monthly_usage TO authenticated;

-- Fertig! Usage Tracking ist jetzt eingerichtet

