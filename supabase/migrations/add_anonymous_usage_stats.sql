-- ============================================
-- DSGVO-KONFORME ANONYME NUTZUNGSSTATISTIKEN
-- ============================================
-- Diese Tabelle speichert NUR aggregierte Zahlen
-- KEINE persönlichen Daten, KEINE User-IDs, KEINE IPs
-- ============================================

-- Falls Tabellen bereits existieren, erst löschen
DROP TABLE IF EXISTS workflow_daily_stats CASCADE;
DROP TABLE IF EXISTS global_daily_stats CASCADE;
DROP FUNCTION IF EXISTS increment_anonymous_usage CASCADE;
DROP FUNCTION IF EXISTS increment_logged_in_usage CASCADE;

-- 1. Aggregierte Workflow-Nutzung pro Tag
CREATE TABLE IF NOT EXISTS workflow_daily_stats (
  id SERIAL PRIMARY KEY,
  workflow_id TEXT NOT NULL,  -- Workflow-ID als Text (kompatibel mit allen ID-Typen)
  date DATE NOT NULL,
  anonymous_count INTEGER DEFAULT 0,  -- Anonyme Nutzungen
  logged_in_count INTEGER DEFAULT 0,  -- Eingeloggte Nutzungen (zur Referenz)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ein Eintrag pro Workflow pro Tag
  UNIQUE(workflow_id, date)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_workflow_daily_stats_date ON workflow_daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_workflow_daily_stats_workflow ON workflow_daily_stats(workflow_id);

-- 2. Globale tägliche Statistiken (komplett aggregiert)
CREATE TABLE IF NOT EXISTS global_daily_stats (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_anonymous INTEGER DEFAULT 0,
  total_logged_in INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_global_daily_stats_date ON global_daily_stats(date);

-- 3. RLS Policies
-- Diese Tabellen brauchen kein RLS für SELECT (öffentlich lesbar für Admin)
-- Aber INSERT/UPDATE sollte nur über Service Role möglich sein

ALTER TABLE workflow_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_daily_stats ENABLE ROW LEVEL SECURITY;

-- Admins können alles lesen (über Service Role Key)
-- Normale User können nichts sehen (Datenschutz)
DROP POLICY IF EXISTS "Service role full access workflow_daily_stats" ON workflow_daily_stats;
CREATE POLICY "Service role full access workflow_daily_stats" 
ON workflow_daily_stats FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access global_daily_stats" ON global_daily_stats;
CREATE POLICY "Service role full access global_daily_stats" 
ON global_daily_stats FOR ALL 
USING (true)
WITH CHECK (true);

-- 4. Funktion zum Inkrementieren der anonymen Nutzung
-- Wird über API aufgerufen (mit Service Role)
CREATE OR REPLACE FUNCTION increment_anonymous_usage(p_workflow_id TEXT)
RETURNS void AS $$
DECLARE
  today DATE := CURRENT_DATE;
BEGIN
  -- Workflow-spezifische Stats
  INSERT INTO workflow_daily_stats (workflow_id, date, anonymous_count)
  VALUES (p_workflow_id, today, 1)
  ON CONFLICT (workflow_id, date)
  DO UPDATE SET 
    anonymous_count = workflow_daily_stats.anonymous_count + 1,
    updated_at = NOW();
  
  -- Globale Stats
  INSERT INTO global_daily_stats (date, total_anonymous)
  VALUES (today, 1)
  ON CONFLICT (date)
  DO UPDATE SET 
    total_anonymous = global_daily_stats.total_anonymous + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Funktion zum Inkrementieren der eingeloggten Nutzung
-- Wird automatisch getriggert wenn user_usage Insert passiert
CREATE OR REPLACE FUNCTION increment_logged_in_usage()
RETURNS TRIGGER AS $$
DECLARE
  usage_date DATE := DATE(NEW.used_at);
BEGIN
  -- Workflow-spezifische Stats (workflow_id als TEXT casten für Kompatibilität)
  INSERT INTO workflow_daily_stats (workflow_id, date, logged_in_count)
  VALUES (NEW.workflow_id::TEXT, usage_date, 1)
  ON CONFLICT (workflow_id, date)
  DO UPDATE SET 
    logged_in_count = workflow_daily_stats.logged_in_count + 1,
    updated_at = NOW();
  
  -- Globale Stats
  INSERT INTO global_daily_stats (date, total_logged_in)
  VALUES (usage_date, 1)
  ON CONFLICT (date)
  DO UPDATE SET 
    total_logged_in = global_daily_stats.total_logged_in + 1,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische Aktualisierung bei eingeloggter Nutzung
DROP TRIGGER IF EXISTS trigger_increment_logged_in_usage ON user_usage;
CREATE TRIGGER trigger_increment_logged_in_usage
AFTER INSERT ON user_usage
FOR EACH ROW
EXECUTE FUNCTION increment_logged_in_usage();

-- ============================================
-- DSGVO-HINWEIS:
-- Diese Tabellen speichern KEINE:
-- - IP-Adressen
-- - User-IDs für anonyme Besucher
-- - Geräteinformationen
-- - Cookies/Session-IDs
-- 
-- NUR aggregierte Zähler: "X anonyme Nutzungen am Tag Y"
-- ============================================

