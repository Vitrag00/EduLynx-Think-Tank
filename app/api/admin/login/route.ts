import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
