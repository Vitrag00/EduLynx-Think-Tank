import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { DbTopic } from '@/types/database'
import type { Topic, TargetBand } from '@/types/topic'

const updateTopicSchema = z.object({
  title: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  subject_group: z.enum(['STEM', 'Applied STEM']).optional(),
  service_type: z.enum(['IA', 'EE']).optional(),
  level: z.enum(['SL', 'HL']).optional(),
  target_band: z.array(z.number()).optional(),
  topic_area: z.string().min(1).optional(),
  draft_rq: z.string().min(1).optional(),
  abstract: z.string().optional(),
  rationale: z.string().min(1).optional(),
  why_it_works: z.string().min(1).optional(),
  key_theory: z.array(z.string()).optional(),
  methodology: z.string().min(1).optional(),
  methodology_type: z.enum(['Quantitative', 'Qualitative', 'Mixed']).optional(),
  primary_source: z.string().min(1).optional(),
  data_comfort: z.string().min(1).optional(),
  data_availability: z.enum(['High', 'Moderate', 'Low']).optional(),
  feasibility: z.number().min(1).max(10).optional(),
  innovation: z.number().min(1).max(10).optional(),
  complexity: z.enum(['Low', 'Moderate', 'High']).optional(),
  recommended_for: z.string().min(1).optional(),
  prerequisite_skills: z.array(z.string()).optional(),
  risk_flags: z.array(z.string()).optional(),
  estimated_hours: z.number().min(1).optional(),
  inventory_type: z.enum(['Pre-Built', 'Custom']).optional(),
  interdisciplinary: z.boolean().optional(),
  status: z.enum(['Active', 'Draft', 'Archived']).optional(),
  pdf_url: z.string().nullable().optional(),
  pdf_filename: z.string().nullable().optional(),
  mentor_note: z.string().optional(),
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

function getAdmin() {
  try {
    return getSupabaseAdmin()
  } catch {
    return null
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { data, error } = await admin
      .from('topics')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    return NextResponse.json(mapDbToTopic(data as DbTopic))
  } catch (err) {
    console.error('Topic GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const parsed = updateTopicSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const admin = getAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { data, error } = await admin
      .from('topics')
      .update(parsed.data)
      .eq('id', params.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
    }

    return NextResponse.json(mapDbToTopic(data as DbTopic))
  } catch (err) {
    console.error('Topic PUT error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { error } = await admin
      .from('topics')
      .update({ status: 'Archived' })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Topic DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
