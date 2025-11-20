import { describe, it, expect } from 'vitest'

const TEST_VIDEO_URL = 'https://res.cloudinary.com/demo/video/upload/sample.mp4'
const TEST_THUMBNAIL_URL = 'https://res.cloudinary.com/demo/video/upload/sample-thumbnail.jpg'

// Mock user headers
const headers = {
  'x-user-id': '1',
  'x-user-role': 'admin',
  'Content-Type': 'application/json',
}

describe('API /api/publications', () => {
  it('debería crear una publicación con video y miniatura', async () => {
    const body = {
      title: 'Test Video',
      slug: 'test-video',
      description: 'Publicación de prueba con video',
      content: 'Contenido de prueba',
      mainImage: TEST_VIDEO_URL,
      videoThumbnail: TEST_THUMBNAIL_URL,
      status: 'published',
      categoryId: null,
      tagIds: [],
    }
    const res = await fetch('http://localhost:3000/api/publications', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.videoThumbnail).toBe(TEST_THUMBNAIL_URL)
    expect(data.imagen_principal).toBe(TEST_VIDEO_URL)
    expect(data.titulo).toBe('Test Video')
  })

  it('debería crear una publicación con imagen', async () => {
    const TEST_IMAGE_URL = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
    const body = {
      title: 'Test Imagen',
      slug: 'test-imagen',
      description: 'Publicación de prueba con imagen',
      content: 'Contenido de prueba para imagen',
      mainImage: TEST_IMAGE_URL,
      status: 'published',
      categoryId: null,
      tagIds: [],
    }
    const res = await fetch('http://localhost:3000/api/publications', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.imagen_principal).toBe(TEST_IMAGE_URL)
    expect(data.titulo).toBe('Test Imagen')
  })

  it('debería crear una publicación sin imagen ni video', async () => {
    const body = {
      title: 'Test Sin Media',
      slug: 'test-sin-media',
      description: 'Publicación sin imagen ni video',
      content: 'Contenido de prueba sin media',
      status: 'published',
      categoryId: null,
      tagIds: [],
    }
    const res = await fetch('http://localhost:3000/api/publications', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.titulo).toBe('Test Sin Media')
    expect(data.imagen_principal).toBe('')
  })

  it('debería rechazar publicación con datos inválidos', async () => {
    const body = {
      title: 'A', // muy corto
      slug: 'test-error',
      description: 'Error',
      content: 'Corto', // muy corto
      status: 'published',
      categoryId: null,
      tagIds: [],
    }
    const res = await fetch('http://localhost:3000/api/publications', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Datos inválidos/)
    expect(data.details).toBeDefined()
  })
})
