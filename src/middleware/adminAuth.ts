import type { NextRequest } from 'next/server'

export function isAdminAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('admin_session')
  return sessionCookie?.value === 'authenticated'
}
