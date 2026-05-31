import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getSupabaseAdmin } from '@/lib/supabase'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const BUCKET_NAME = 'topic-papers'
const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365 * 7

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const subjectGroup = (formData.get('subject_group') as string) || 'STEM'
    const subject = (formData.get('subject') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    let admin
    try {
      admin = getSupabaseAdmin()
    } catch {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
    }

    const fileId = uuidv4()
    const sanitizedGroup = subjectGroup.replace(/\s+/g, '-').toLowerCase()
    const sanitizedSubject = subject.replace(/\s+/g, '-').toLowerCase()
    const filePath = `${sanitizedGroup}/${sanitizedSubject}/${fileId}.pdf`

    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await admin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: signedUrlData, error: signedUrlError } = await admin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(uploadData.path, SIGNED_URL_EXPIRY)

    if (signedUrlError || !signedUrlData) {
      return NextResponse.json({ error: 'Failed to generate file URL' }, { status: 500 })
    }

    return NextResponse.json({
      pdf_url: signedUrlData.signedUrl,
      pdf_filename: file.name,
      storage_path: uploadData.path,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
