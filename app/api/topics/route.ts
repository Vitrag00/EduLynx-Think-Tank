import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import type { DbTopic } from '@/types/database'
import type { Topic, TargetBand } from '@/types/topic'
import mockTopics from '@/data/mockTopics.json'

const createTopicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  subject_group: z.enum(['STEM', 'Applied STEM']),
  service_type: z.enum(['IA', 'EE']),
  level: z.enum(['SL', 'HL']),
  target_band: z.array(z.number()).min(1, 'Select at least one band'),
  topic_area: z.string().min(1, 'Topic area is required'),
  draft_rq: z.string().min(1, 'Draft RQ is required'),
  abstract: z.string().min(1, 'Abstract is required'),
  rationale: z.string().min(1, 'Rationale is required'),
  why_it_works: z.string().min(1, 'Why it works is required'),
  key_theory: z.array(z.string()),
  methodology: z.string().min(1, 'Methodology is required'),
  methodology_type: z.enum(['Quantitative', 'Qualitative', 'Mixed']),
  primary_source: z.string().min(1, 'Primary source is required'),
  data_comfort: z.string().min(1, 'Data comfort is required'),
  data_availability: z.enum(['High', 'Moderate', 'Low']),
  feasibility: z.number().min(1).max(10),
  innovation: z.number().min(1).max(10),
  complexity: z.enum(['Low', 'Moderate', 'High']),
  recommended_for: z.string().min(1, 'Recommended for is required'),
  prerequisite_skills: z.array(z.string()),
  risk_flags: z.array(z.string()),
  estimated_hours: z.number().min(1, 'Estimated hours required'),
  inventory_type: z.enum(['Pre-Built', 'Custom']),
  interdisciplinary: z.boolean(),
  status: z.enum(['Active', 'Draft', 'Archived']),
  pdf_url: z.string().nullable().optional(),
  pdf_filename: z.string().nullable().optional(),
  uploaded_by: z.string(),
  shortlisted: z.boolean(),
  converted_to_rq: z.boolean(),
  mentor_note: z.string(),
})

function mapDbToTopic(db: DbTopic): Topic {
  return {
    id: db.id,
    version: '1.0',
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    programme: 'IB DP',
    subjectGroup: db.subject_group,
    subject: db.subject,
    serviceType: db.service_type,
    level: db.level,
    inventoryType: db.inventory_type,
    topicTitle: db.title,
    topicArea: db.topic_area,
    draftRQ: db.draft_rq,
    abstract: db.abstract,
    rationale: db.rationale,
    whyItWorks: db.why_it_works,
    keyTheory: db.key_theory,
    targetBand: db.target_band as TargetBand[],
    feasibility: db.feasibility,
    innovation: db.innovation,
    complexity: db.complexity,
    interdisciplinary: db.interdisciplinary,
    dataAvailability: db.data_availability,
    methodology: db.methodology,
    methodologyType: db.methodology_type,
    primarySource: db.primary_source,
    dataComfort: db.data_comfort,
    recommendedFor: db.recommended_for,
    prerequisiteSkills: db.prerequisite_skills,
    riskFlags: db.risk_flags,
    estimatedHours: db.estimated_hours,
    status: db.status,
    shortlisted: db.shortlisted,
    convertedToRQ: db.converted_to_rq,
    mentorNote: db.mentor_note,
    pdfUrl: db.pdf_url,
    pdfFilename: db.pdf_filename,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fetchAll = searchParams.get('all') === 'true'
    const adminSession = request.cookies.get('admin_session')
    const isAdmin = adminSession?.value === 'authenticated'

    let client
    try {
      client = (fetchAll && isAdmin) ? getSupabaseAdmin() : getSupabaseClient()
    } catch {
      return NextResponse.json(mockTopics, { status: 200 })
    }

    let query = client.from('topics').select('*').order('created_at', { ascending: false })
    if (!fetchAll || !isAdmin) {
      query = query.eq('status', 'Active')
    }

    const { data, error } = await query

    if (error || !data) {
      return NextResponse.json(mockTopics, { status: 200 })
    }

    const topics = (data as DbTopic[]).map(mapDbToTopic)
    return NextResponse.json(topics)
  } catch (err) {
    console.error('Topics GET error:', err)
    return NextResponse.json(mockTopics, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createTopicSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    let admin
    try {
      admin = getSupabaseAdmin()
    } catch {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { data, error } = await admin
      .from('topics')
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(mapDbToTopic(data as DbTopic), { status: 201 })
  } catch (err) {
    console.error('Topics POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
