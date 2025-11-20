/**
 * API Route: Publicación por ID
 * GET /api/publications/[id] - Obtener publicación
 * PUT /api/publications/[id] - Actualizar publicación
 * DELETE /api/publications/[id] - Eliminar publicación
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updatePublicationSchema } from '@/lib/validations'

// GET - Obtener publicación por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = params.id;
    const isNumeric = /^\d+$/.test(param);
    const where = isNumeric ? { id: parseInt(param) } : { slug: param };
    const publication = await prisma.publication.findUnique({
      where,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        comments: {
          where: { isApproved: true },
          include: {
            reactions: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { visits: true },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    })
    
    if (!publication) {
      return NextResponse.json(
        { error: 'Publicación no encontrada' },
        { status: 404 }
      )
    }
    
    // Registrar visita
    await prisma.visit.create({
      data: {
        publicationId: publication.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })
    
    // Mapear los campos para el frontend igual que en /api/publications
    const mapped = publication ? {
      id: publication.id,
      titulo: publication.title ?? '',
      slug: publication.slug,
      descripcion: publication.description ?? '',
      contenido: publication.content ?? '',
      imagen_principal: publication.mainImage ?? '',
      estado: publication.status ?? '',
      fecha_creacion: publication.createdAt,
      etiquetas: publication.tags?.map((t: any) => ({ nombre: t.tag.name })) ?? [],
      categoria: publication.category ? { id: publication.category.id, nombre: publication.category.name, icono: publication.category.icon, color: publication.category.color } : null,
      id_categoria: publication.category?.id || null,
      // autor: publication.author ? { nombre_completo: publication.author.fullName, id_usuario: publication.author.id, usuario: publication.author.username } : { nombre_completo: '' },
    } : publication;
    return NextResponse.json(mapped)
  } catch (error) {
    console.error('Error al obtener publicación:', error)
    return NextResponse.json(
      { error: 'Error al obtener publicación' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar publicación
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const existingPublication = await prisma.publication.findUnique({
      where: { id: parseInt(params.id) },
    })
    
    if (!existingPublication) {
      return NextResponse.json(
        { error: 'Publicación no encontrada' },
        { status: 404 }
      )
    }
    
    // Solo autor, Administrador o Super Administrador
    if (
      existingPublication.authorId !== parseInt(userId) &&
      userRole !== 'Administrador' &&
      userRole !== 'Super Administrador'
    ) {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = updatePublicationSchema.parse(body)
    
    // Actualizar publicación y tags
    const publication = await prisma.publication.update({
      where: { id: parseInt(params.id) },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        content: validatedData.content,
        mainImage: validatedData.mainImage,
        status: validatedData.status,
        categoryId: validatedData.categoryId ?? null,
        ...(validatedData.tagIds && {
          tags: {
            deleteMany: {},
            create: validatedData.tagIds.map((tagId: number) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    })
    // Mapear categoryId para el frontend
    const mapped = publication ? {
      ...publication,
      categoryId: publication.category?.id || null,
    } : publication;
    return NextResponse.json(mapped)
    
    return NextResponse.json(publication)
  } catch (error) {
    console.error('Error al actualizar publicación:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar publicación' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar publicación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const existingPublication = await prisma.publication.findUnique({
      where: { id: parseInt(params.id) },
    })
    
    if (!existingPublication) {
      return NextResponse.json(
        { error: 'Publicación no encontrada' },
        { status: 404 }
      )
    }
    
    // Solo autor, Administrador o Super Administrador
    if (
      existingPublication.authorId !== parseInt(userId) &&
      userRole !== 'Administrador' &&
      userRole !== 'Super Administrador'
    ) {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    await prisma.publication.delete({
      where: { id: parseInt(params.id) },
    })
    
    return NextResponse.json({ message: 'Publicación eliminada' })
  } catch (error) {
    console.error('Error al eliminar publicación:', error)
    return NextResponse.json(
      { error: 'Error al eliminar publicación' },
      { status: 500 }
    )
  }
}
