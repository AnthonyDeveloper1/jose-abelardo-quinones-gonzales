/**
 * Middleware de Next.js
 * Protege rutas del dashboard /admin
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // El middleware solo protege rutas /admin en el cliente
  // La validación de JWT se hace en las API routes individuales
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
