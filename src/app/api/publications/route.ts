/**
 * API Route: Publicaciones
 * GET /api/publications - Listar publicaciones
 * POST /api/publications - Crear publicación
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPublicationSchema } from '@/lib/validations'

// GET - Listar publicaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const tagId = searchParams.get('tagId')
    const search = searchParams.get('search')
    const categorySlug = searchParams.get('category')
    
    const skip = (page - 1) * limit
    const where: any = {}
    
    if (status) {
      where.status = status
    }

    if (categorySlug) {
      // Buscar el id de la categoría por slug
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) {
        where.categoryId = category.id;
      } else {
        // Si no existe la categoría, devolver vacío
        return NextResponse.json([]);
      }
    }

    if (tagId) {
      where.tags = {
        some: { tagId: parseInt(tagId) },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } },
      ]
    }
    
    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
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
            include: {
              tag: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
            },
          },
          _count: {
            select: { 
              comments: true,
              visits: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.publication.count({ where }),
    ])

    // Mapear los campos para el frontend (todos los datos relevantes)
    const mappedPublications = publications.map((p: any) => ({
      id: p.id,
      titulo: p.title ?? '',
      slug: p.slug,
      descripcion: p.description ?? '',
      contenido: p.content ?? '',
      imagen_principal: p.mainImage ?? '',
      videoThumbnail: p.videoThumbnail ?? '',
      estado: p.status ?? '',
      fecha_creacion: p.createdAt,
      etiquetas: p.tags?.map((t: any) => ({ nombre: t.tag.name })) ?? [],
      categoria: p.category ? { id: p.category.id, nombre: p.category.name, icono: p.category.icon, color: p.category.color } : null,
      id_categoria: p.category?.id || null,
      // Si necesitas mostrar el autor, descomenta la siguiente línea:
      // autor: p.author ? { nombre_completo: p.author.fullName, id_usuario: p.author.id, usuario: p.author.username } : { nombre_completo: '' },
    }))
    return NextResponse.json(mappedPublications)
  } catch (error) {
    console.error('Error al obtener publicaciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener publicaciones' },
      { status: 500 }
    )
  }
}

// POST - Crear publicación
export async function POST(request: NextRequest) {
  const userRole = request.headers.get('x-user-role')
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    console.log('[POST /api/publications] Headers:', {
      'x-user-id': userId,
      'x-user-role': userRole,
    })
    
      const body = await request.json()
      // Mapear imageUrl del frontend a mainImage para la base de datos y asegurar status correcto
      const mappedData = {
        ...body,
        status: body.status === 'published' ? 'published' : 'draft',
        videoThumbnail: body.videoThumbnail || null,
      }
      // Eliminar mainImage si es null, undefined o string vacío
      if (!body.mainImage || body.mainImage === '' || body.mainImage === null) {
        delete mappedData.mainImage
      } else {
        mappedData.mainImage = body.mainImage
      }
      console.log('[POST /api/publications] Datos recibidos para validación:', mappedData)
      let validatedData
      try {
        validatedData = createPublicationSchema.parse(mappedData)
      } catch (err) {
        if (err instanceof Error && 'errors' in err) {
          // Zod error: mostrar detalles
          const zodErr = err as any
          const details = zodErr.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(' | ')
          return NextResponse.json({ error: 'Datos inválidos', details }, { status: 400 })
        }
        return NextResponse.json({ error: (err instanceof Error ? err.message : 'Datos inválidos') }, { status: 400 })
      }

      // Crear publicación con tags y categoría, incluyendo videoThumbnail
      // Construir objeto data sin videoThumbnail si es null o undefined
      const publicationData: any = {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        content: validatedData.content,
        mainImage: validatedData.mainImage,
        status: validatedData.status,
        author: { connect: { id: parseInt(userId) } },
        category: validatedData.categoryId ? { connect: { id: validatedData.categoryId } } : undefined,
        tags: {
          create: validatedData.tagIds?.map((tagId: number) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      };
      if (validatedData.videoThumbnail) {
        publicationData.videoThumbnail = validatedData.videoThumbnail;
      }
      const publication = await prisma.publication.create({
        data: publicationData,
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

      // Mapear la respuesta para incluir videoThumbnail como en GET
      const mappedPublication = {
        id: publication.id,
        titulo: publication.title ?? '',
        slug: publication.slug,
        descripcion: publication.description ?? '',
        contenido: publication.content ?? '',
        imagen_principal: publication.mainImage ?? '',
        videoThumbnail: publication.videoThumbnail ?? '',
        estado: publication.status ?? '',
        fecha_creacion: publication.createdAt,
        etiquetas: publication.tags?.map((t: any) => ({ nombre: t.tag.name })) ?? [],
        categoria: publication.category ? { id: publication.category.id, nombre: publication.category.name, icono: publication.category.icon, color: publication.category.color } : null,
        id_categoria: publication.category?.id || null,
      }

      return NextResponse.json(mappedPublication, { status: 201 })
  } catch (error) {
    console.error('Error al crear publicación:', error);
    let errorMsg = 'Error al crear publicación';
    let details = '';
    if (error instanceof Error) {
      errorMsg = error.message || errorMsg;
      if ('errors' in error) {
        // Zod error
        const zodErr = error as any;
        details = zodErr.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(' | ');
      }
    }
    return NextResponse.json(
      { error: errorMsg, details },
      { status: 500 }
    );
  }
}
