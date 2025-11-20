/**
 * API Route: Usuarios
 * GET /api/users - Listar usuarios (requiere admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');
    // Solo el rol Administrador (id=1) puede ver usuarios
    if (userRole !== 'Administrador' || userId !== '1') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      );
    }
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        lastConnection: true,
        registeredAt: true,
      },
      orderBy: { registeredAt: 'desc' },
    })
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}
