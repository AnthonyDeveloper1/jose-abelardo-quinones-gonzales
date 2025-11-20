'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthHeaders } from '@/lib/client-auth'
import Link from 'next/link'

interface Publication {
  // ...existing code...
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  contenido?: string;
  imagen_principal?: string | null;
  estado?: string;
  fecha_creacion?: string;
  etiquetas?: { nombre: string }[];
  categoria?: { id: number; nombre: string; icono?: string; color?: string } | null;
}

export default function PublicationsPage() {
  const router = useRouter()
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    loadPublications()
  }, [])

  const loadPublications = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/publications', { headers })
      
      if (response.ok) {
        const data = await response.json()
        setPublications(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando publicaciones:', error)
      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta publicación?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setPublications(publications.filter(p => p.id !== id))
      } else {
        const errorData = await response.json()
        if (response.status === 401) {
          alert('No autorizado. Inicia sesión nuevamente.')
        } else if (response.status === 403) {
          alert('Sin permisos para eliminar esta publicación.')
        } else if (response.status === 404) {
          alert('Publicación no encontrada.')
        } else {
          alert(errorData.error || 'Error al eliminar')
        }
      }
    } catch (error) {
      alert('Error al eliminar publicación')
    }
  }

  const filteredPublications = publications.filter(pub => {
    if (filter === 'all') return true
    return pub.estado === filter
  })

  if (loading) {
    return <div className="text-center py-8">Cargando publicaciones...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Publicaciones</h2>
        <Link
          href="/admin/publications/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          ➕ Nueva Publicación
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Todas ({publications.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Publicadas ({publications.filter(p => p.estado === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded ${filter === 'draft' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            Borradores ({publications.filter(p => p.estado === 'draft').length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Etiquetas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contenido</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPublications.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{pub.titulo}</div>
                  <div className="text-sm text-gray-500">{pub.slug}</div>
                </td>
                <td className="px-6 py-4">
                  {pub.imagen_principal ? (
                    pub.imagen_principal.endsWith('.mp4') ? (
                      <video
                        src={pub.imagen_principal}
                        className="h-12 w-20 object-cover rounded border bg-black"
                        poster="/video-poster.png"
                        controls={false}
                      >
                        Tu navegador no soporta videos.
                      </video>
                    ) : (
                      <img
                        src={pub.imagen_principal}
                        alt={pub.titulo}
                        className="h-12 w-20 object-cover rounded border"
                      />
                    )
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pub.categoria ? (
                    <span className="inline-flex items-center gap-1">
                      {pub.categoria.icono && <span>{pub.categoria.icono}</span>}
                      <span>{pub.categoria.nombre}</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">Sin categoría</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    pub.estado === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pub.estado === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {Array.isArray(pub.etiquetas) ? pub.etiquetas.map(t => t.nombre).join(', ') : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pub.fecha_creacion ? new Date(pub.fecha_creacion).toLocaleDateString() : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pub.contenido ? pub.contenido.slice(0, 100) + (pub.contenido.length > 100 ? '...' : '') : ''}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/publications/${pub.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPublications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay publicaciones {filter !== 'all' && `en estado "${filter}"`}
          </div>
        )}
      </div>
    </div>
  )
}
