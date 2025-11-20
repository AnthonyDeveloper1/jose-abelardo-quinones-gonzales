/**
 * API Route: Refrescar token
 * POST /api/auth/refresh-token - Genera un nuevo token con credenciales
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🔄 Intentando refrescar token para:', email)

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Generar nuevo token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      roleName: user.role?.name || null,
    })

    console.log('✅ Token refrescado exitosamente')
    console.log('🔐 Nuevo token:', token.substring(0, 20) + '...')

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        roleId: user.roleId,
        roleName: user.role?.name || 'Usuario',
      },
    })
  } catch (error) {
    console.error('❌ Error al refrescar token:', error)
    return NextResponse.json(
      { error: 'Error al refrescar token' },
      { status: 500 }
    )
  }
}
