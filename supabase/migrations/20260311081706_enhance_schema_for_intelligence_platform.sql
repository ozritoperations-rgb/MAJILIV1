/*
  # Enhance Schema for Intelligence Platform

  1. Updates to Documents Table
    - Add confidence_score for AI analysis
    - Add tags array for categorization
    - Add review_status for document workflow
    
  2. Updates to Tasks Table
    - Add category field for task organization
    - Add source field to track origin (WhatsApp, Voice Note, etc.)
    
  3. New Tables
    - decision_log - Track parliamentary decisions
    - sessions - Track active user sessions
    - security_events - Track security-related events
    
  4. Security
    - All tables have RLS enabled
    - Appropriate policies for each user role
*/

-- Add new columns to documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'confidence_score'
  ) THEN
    ALTER TABLE documents ADD COLUMN confidence_score integer DEFAULT 95 CHECK (confidence_score >= 0 AND confidence_score <= 100);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'tags'
  ) THEN
    ALTER TABLE documents ADD COLUMN tags text[] DEFAULT ARRAY[]::text[];
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'review_status'
  ) THEN
    ALTER TABLE documents ADD COLUMN review_status text DEFAULT 'pending' CHECK (review_status IN ('pending', 'reviewed', 'approved'));
  END IF;
END $$;

-- Add new columns to tasks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'category'
  ) THEN
    ALTER TABLE tasks ADD COLUMN category text DEFAULT 'general' CHECK (category IN ('legal', 'finance', 'investment', 'communication', 'personal', 'general'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'source'
  ) THEN
    ALTER TABLE tasks ADD COLUMN source text DEFAULT 'manual' CHECK (source IN ('manual', 'whatsapp', 'voice_note', 'email', 'system'));
  END IF;
END $$;

-- Create decision_log table
CREATE TABLE IF NOT EXISTS decision_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  decision_type text NOT NULL CHECK (decision_type IN ('approved', 'rejected', 'deferred', 'amended')),
  related_document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  decided_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision_date timestamptz DEFAULT now(),
  impact_level text DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE decision_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view decisions"
  ON decision_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can create decisions"
  ON decision_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_type text,
  ip_address text,
  user_agent text,
  last_activity timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create security_events table
CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('login_success', 'login_failed', 'permission_denied', 'data_access', 'threat_blocked', 'suspicious_activity')),
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text,
  details text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security events"
  ON security_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert security events"
  ON security_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_confidence_score ON documents(confidence_score);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_documents_review_status ON documents(review_status);

CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_source ON tasks(source);

CREATE INDEX IF NOT EXISTS idx_decision_log_decided_by ON decision_log(decided_by);
CREATE INDEX IF NOT EXISTS idx_decision_log_decision_date ON decision_log(decision_date DESC);
CREATE INDEX IF NOT EXISTS idx_decision_log_decision_type ON decision_log(decision_type);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions(last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
