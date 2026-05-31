-- Topics table
CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  subject_group TEXT NOT NULL CHECK (subject_group IN ('STEM', 'Applied STEM')),
  service_type TEXT NOT NULL CHECK (service_type IN ('IA', 'EE')),
  level TEXT NOT NULL CHECK (level IN ('SL', 'HL')),
  target_band INTEGER[] NOT NULL,
  topic_area TEXT NOT NULL,
  draft_rq TEXT NOT NULL,
  abstract TEXT NOT NULL DEFAULT '',
  rationale TEXT NOT NULL,
  why_it_works TEXT NOT NULL,
  key_theory TEXT[] DEFAULT '{}',
  methodology TEXT NOT NULL,
  methodology_type TEXT NOT NULL CHECK (methodology_type IN ('Quantitative', 'Qualitative', 'Mixed')),
  primary_source TEXT NOT NULL,
  data_comfort TEXT NOT NULL,
  data_availability TEXT NOT NULL CHECK (data_availability IN ('High', 'Moderate', 'Low')),
  feasibility INTEGER NOT NULL CHECK (feasibility BETWEEN 1 AND 10),
  innovation INTEGER NOT NULL CHECK (innovation BETWEEN 1 AND 10),
  complexity TEXT NOT NULL CHECK (complexity IN ('Low', 'Moderate', 'High')),
  recommended_for TEXT NOT NULL,
  prerequisite_skills TEXT[] DEFAULT '{}',
  risk_flags TEXT[] DEFAULT '{}',
  estimated_hours INTEGER NOT NULL,
  inventory_type TEXT NOT NULL DEFAULT 'Pre-Built' CHECK (inventory_type IN ('Pre-Built', 'Custom')),
  interdisciplinary BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Archived')),
  pdf_url TEXT,
  pdf_filename TEXT,
  uploaded_by TEXT NOT NULL DEFAULT 'admin',
  shortlisted BOOLEAN DEFAULT FALSE,
  converted_to_rq BOOLEAN DEFAULT FALSE,
  mentor_note TEXT DEFAULT ''
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket (run in Supabase dashboard Storage section)
-- Bucket name: topic-papers
-- Public: false
-- Allowed MIME types: application/pdf

-- RLS Policies
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of active topics"
  ON topics FOR SELECT
  USING (status = 'Active');

CREATE POLICY "Allow admin full access"
  ON topics FOR ALL
  USING (true)
  WITH CHECK (true);
