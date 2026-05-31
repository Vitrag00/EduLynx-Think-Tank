export interface DbTopic {
  id: string
  created_at: string
  updated_at: string
  title: string
  subject: string
  subject_group: 'STEM' | 'Applied STEM'
  service_type: 'IA' | 'EE'
  level: 'SL' | 'HL'
  target_band: number[]
  topic_area: string
  draft_rq: string
  abstract: string
  rationale: string
  why_it_works: string
  key_theory: string[]
  methodology: string
  methodology_type: 'Quantitative' | 'Qualitative' | 'Mixed'
  primary_source: string
  data_comfort: string
  data_availability: 'High' | 'Moderate' | 'Low'
  feasibility: number
  innovation: number
  complexity: 'Low' | 'Moderate' | 'High'
  recommended_for: string
  prerequisite_skills: string[]
  risk_flags: string[]
  estimated_hours: number
  inventory_type: 'Pre-Built' | 'Custom'
  interdisciplinary: boolean
  status: 'Active' | 'Draft' | 'Archived'
  pdf_url: string | null
  pdf_filename: string | null
  uploaded_by: string
  shortlisted: boolean
  converted_to_rq: boolean
  mentor_note: string
}

export type DbTopicInsert = Omit<DbTopic, 'id' | 'created_at' | 'updated_at'>
export type DbTopicUpdate = Partial<DbTopicInsert>
