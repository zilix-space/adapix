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

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const token =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value

  // Handle session expiration
  if (pathname === '/auth/session-expired') {
    const response = redirectTo('/auth')
    deleteSessionCookies(response)
    response.headers.set('x-pathname', pathname)
    return response
  }

  // Redirect authenticated users trying to access /auth
  if (pathname === '/auth' && token) {
    return redirectTo('/app')
  }

  // Redirect unauthenticated users trying to access /app routes
  if (!token && pathname.startsWith('/app')) {
    const response = redirectTo(`/auth?callbackUrl=${pathname}`)
    if (pathname.startsWith('/app/invites')) {
      const inviteId = pathname.split('/').pop()
      if (isValidUUID(inviteId)) {
        response.cookies.set('x-tenant-invite', inviteId)
      }
    }
    return response
  }

  // Handle tenant selection
  if (pathname.startsWith('/app/select-account')) {
    const tenantId = pathname.split('/').pop()
    if (isValidUUID(tenantId)) {
      const response = redirectTo('/app')
      response.cookies.set('x-tenant', tenantId)
      response.headers.set('x-pathname', pathname)
      return response
    } else {
      const response = redirectTo('/app')
      deleteTenantCookies(response)
      return response
    }
  }

  // For all other cases, proceed with the request
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
