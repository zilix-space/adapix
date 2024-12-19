import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from './helpers/get-url'
import { isValidUUID } from './helpers/is-valid-uuid'

function redirectTo(url: string) {
  return NextResponse.redirect(new URL(getUrl(url)))
}

function deleteSessionCookies(response: NextResponse) {
  response.cookies.delete('next-auth.session-token')
  response.cookies.delete('__Secure-next-auth.session-token')
}

function deleteTenantCookies(response: NextResponse) {
  response.cookies.delete('x-tenant')
}

const tokens = {
  sessions: ['next-auth.session-token', '__Secure-next-auth.session-token'],
}
export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // For all other cases, proceed with the request
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
