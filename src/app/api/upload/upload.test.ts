import { describe, it, expect } from 'vitest';
import { fetch, FormData } from 'undici';
import { Blob } from 'buffer';

const TEST_IMAGE = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
const TEST_VIDEO = 'https://res.cloudinary.com/demo/video/upload/sample.mp4'
const TEST_VIDEO_THUMBNAIL = 'https://res.cloudinary.com/demo/video/upload/sample-thumbnail.jpg'

const headers = {
  'x-user-id': '1',
  'x-user-role': 'Administrador',
}

describe('API /api/upload', () => {
  it('debería subir una imagen correctamente', async () => {
    const formData = new FormData()
    formData.append('file', new Blob([Buffer.from('test')], { type: 'image/jpeg' }), 'test.jpg')
    formData.append('folder', 'colegio/test')
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    })
    expect(res.status).toBe(201)
    const data: any = await res.json()
    expect(data.url).toMatch(/cloudinary/)
    expect(data.success).toBe(true)
  })

  it('debería subir un video correctamente y devolver miniatura', async () => {
    const formData = new FormData()
    formData.append('file', new Blob([Buffer.from('test')], { type: 'video/mp4' }), 'test.mp4')
    formData.append('folder', 'colegio/test')
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    })
    expect(res.status).toBe(201)
    const data: any = await res.json()
    expect(data.url).toMatch(/cloudinary/)
    expect(data.thumbnailUrl).toBeDefined()
    expect(data.success).toBe(true)
  })

  it('debería rechazar archivos no permitidos', async () => {
    const formData = new FormData()
    formData.append('file', new Blob([Buffer.from('test')], { type: 'application/pdf' }), 'test.pdf')
    formData.append('folder', 'colegio/test')
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    })
    expect(res.status).toBe(400)
    const data: any = await res.json()
    expect(data.error).toMatch(/tipo de archivo/i)
  })
})
