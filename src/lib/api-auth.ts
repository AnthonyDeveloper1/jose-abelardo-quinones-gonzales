/**
 * Utilidades de autenticación para API Routes
 */

import { NextRequest } from 'next/server'
import { verifyToken, type JWTPayload } from './auth'

/**
 * Obtiene y verifica el token JWT de una request
 * Retorna el payload si es válido, null si no
 */
export function getAuthFromRequest(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.replace('Bearer ', '')
  return verifyToken(token)
}

/**
 * Verifica si el usuario tiene rol de administrador
 */
export function isAdmin(payload: JWTPayload | null): boolean {
  if (!payload) return false
  return payload.roleName === 'Administrador' || payload.roleName === 'Super Administrador'
}

/**
 * Verifica si el usuario tiene uno de los roles permitidos
 */
export function hasRole(payload: JWTPayload | null, allowedRoles: string[]): boolean {
  if (!payload || !payload.roleName) return false
  return allowedRoles.includes(payload.roleName)
}
