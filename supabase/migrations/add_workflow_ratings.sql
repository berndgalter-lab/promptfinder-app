-- Workflow Ratings Table
-- Run this in Supabase SQL Editor

-- Drop if exists for clean re-run
DROP TABLE IF EXISTS workflow_ratings CASCADE;

CREATE TABLE workflow_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id BIGINT NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ein User kann pro Workflow nur einmal bewerten
  UNIQUE(workflow_id, user_id)
);

-- Index für schnelle Abfragen
CREATE INDEX idx_workflow_ratings_workflow_id ON workflow_ratings(workflow_id);
CREATE INDEX idx_workflow_ratings_user_id ON workflow_ratings(user_id);

-- RLS Policies
ALTER TABLE workflow_ratings ENABLE ROW LEVEL SECURITY;

-- Jeder kann Ratings lesen (für Durchschnitt)
CREATE POLICY "Anyone can read ratings" ON workflow_ratings
  FOR SELECT USING (true);

-- Nur eingeloggte User können eigene Ratings erstellen
CREATE POLICY "Users can insert own ratings" ON workflow_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User können eigene Ratings updaten
CREATE POLICY "Users can update own ratings" ON workflow_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- User können eigene Ratings löschen
CREATE POLICY "Users can delete own ratings" ON workflow_ratings
  FOR DELETE USING (auth.uid() = user_id);

