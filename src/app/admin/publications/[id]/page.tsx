'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter, useParams } from 'next/navigation'
import { getAuthHeaders } from '@/lib/client-auth'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface Tag {
  id: number
  name: string
}

interface Publication {
  id: number
  title: string
  slug: string
  description: string | null
  content: string
  mainImage: string | null
  status: string
  tags: Array<{
    tag: {
      id: number
      name: string
    }
  }>
  categoryId?: number | null
  categoria?: {
    id: number
    name: string
    icon?: string
    color?: string
  } | null
}

export default function EditPublicationPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
    content: string;
    mainImage: string;
    status: 'draft' | 'published';
    tagIds: number[];
    categoryId: number | null;
  }>(
    {
      title: '',
      slug: '',
      description: '',
      content: '',
      mainImage: '',
      status: 'draft',
      tagIds: [],
      categoryId: null,
    }
  )

  const loadTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando etiquetas:', error)
      setTags([])
    }
  }

  const loadPublication = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/publications/${params.id}`, { headers })
      
      if (response.ok) {
        const pub: any = await response.json()
        setFormData({
          title: pub.titulo,
          slug: pub.slug,
          description: pub.descripcion || '',
          content: pub.contenido || '',
          mainImage: pub.imagen_principal || '',
          status: pub.estado as 'draft' | 'published',
          tagIds: Array.isArray(pub.etiquetas) ? pub.etiquetas.map((t: any) => t.id).filter(Boolean) : [],
          categoryId: pub.categoria?.id || null,
        })
      } else {
        alert('Error al cargar publicación')
        router.push('/admin/publications')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleTagToggle = (tagId: number) => {
    const tagIds = formData.tagIds.includes(tagId)
      ? formData.tagIds.filter((id: number) => id !== tagId)
      : [...formData.tagIds, tagId]
    setFormData({ ...formData, tagIds })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const headers = getAuthHeaders()
      // Si mainImage está vacío, lo enviamos como undefined
      const dataToSend = {
        ...formData,
        mainImage: formData.mainImage && formData.mainImage.trim() !== '' ? formData.mainImage : undefined,
      }
      const response = await fetch(`/api/publications/${params.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 401) {
          toast.error('No autorizado. Inicia sesión nuevamente.')
        } else if (response.status === 403) {
          toast.error('Sin permisos para editar esta publicación.')
        } else if (response.status === 404) {
          toast.error('Publicación no encontrada.')
        } else if (response.status === 400) {
          toast.error(errorData.error || 'Datos inválidos')
        } else {
          toast.error(errorData.error || 'Error al actualizar')
        }
        return
      }

      toast.success('Publicación actualizada exitosamente')
      router.push('/admin/publications')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando categorías:', error)
      setCategories([])
    }
  }

  if (loadingData) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Editar Publicación</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen destacada */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen/Video destacado</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={formData.mainImage}
              onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="URL de imagen o video (.mp4)"
            />
            <button
              type="button"
              onClick={() => window.open('/admin/gallery', '_blank')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              📁 Galería
            </button>
            {formData.mainImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mainImage: '' })}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                🗑️ Eliminar archivo
              </button>
            )}
          </div>
          {formData.mainImage && (
            formData.mainImage.endsWith('.mp4') ? (
              <video src={formData.mainImage} controls className="mt-2 h-32 rounded" />
            ) : (
              <img src={formData.mainImage} alt="Preview" className="mt-2 h-32 object-cover rounded" />
            )
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenido *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            modules={modules}
            className="h-64 mb-12"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  formData.tagIds.includes(tag.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' })}
                className="mr-2"
              />
              📝 Borrador
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' })}
                className="mr-2"
              />
              ✅ Publicado
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
