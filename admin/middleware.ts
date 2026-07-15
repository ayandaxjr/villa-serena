import { NextResponse, type NextRequest } from 'next/server'

// Auth temporarily disabled — re-enable before going live
export async function middleware(request: NextRequest) {
  // Skip login page redirect — allow all routes
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
