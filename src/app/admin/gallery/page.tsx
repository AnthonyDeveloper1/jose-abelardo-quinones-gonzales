'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/client-auth'

interface GalleryImage {
  id: number
  title: string
  description: string | null
  imageUrl: string
  type: string
  uploadedAt: string
  author?: {
    fullName: string
  }
  category?: {
    id: number
    nombre: string
    color?: string
    icono?: string
  }
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
    loadPublications();
  }, []);

  const loadImages = async () => {
    // Ya no se usa, la galería se arma desde publicaciones
  }

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setCategories([]);
    }
  }

  const loadPublications = async () => {
    setLoading(true);
    try {
      const url = '/api/publications?status=published';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPublications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setPublications([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) {
      return
    }

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setImages(images.filter(img => img.id !== id))
        alert('Imagen eliminada correctamente')
      } else {
        alert('Error al eliminar la imagen')
      }
    } catch (error) {
      alert('Error al eliminar la imagen')
    }
  }

  // Eliminado: ya no se usa

  // Agrupar imágenes por categoría
  // Agrupar publicaciones por categoría y extraer multimedia
  const imagesByCategory: { [key: string]: any[] } = {};
  publications
    .filter(pub => pub.imagen_principal || pub.miniatura_video)
    .forEach(pub => {
      const catName = pub.category?.name || 'Sin categoría';
      if (!imagesByCategory[catName]) imagesByCategory[catName] = [];
      if (pub.imagen_principal) {
        imagesByCategory[catName].push({
          id: pub.id,
          title: pub.titulo,
          imageUrl: pub.imagen_principal,
          type: 'imagen',
          uploadedAt: pub.fecha_creacion || pub.createdAt,
          author: pub.author,
          category: pub.category
        });
      }
      if (pub.miniatura_video) {
        imagesByCategory[catName].push({
          id: pub.id,
          title: pub.titulo,
          imageUrl: pub.miniatura_video,
          type: 'video',
          uploadedAt: pub.fecha_creacion || pub.createdAt,
          author: pub.author,
          category: pub.category
        });
      }
    });

  // Obtener categorías únicas
  const categoryNames = Object.keys(imagesByCategory);

  if (loading) {
    return <div className="text-center py-8">Cargando galería...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Galería Multimedia</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          📷 Esta galería muestra automáticamente todas las imágenes y videos de las publicaciones subidas.
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded ${categoryFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Todas ({publications.length})
          </button>
          {categoryNames.map(catName => (
            <button
              key={catName}
              onClick={() => setCategoryFilter(catName)}
              className={`px-4 py-2 rounded ${categoryFilter === catName ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {catName} ({imagesByCategory[catName].length})
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="🔍 Buscar por título..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Galería agrupada por categoría */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Archivos multimedia agrupados por categoría
        </h3>
        {categoryFilter === 'all' ? (
          categoryNames.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {filter ? 'No se encontraron archivos' : 'No hay archivos en la galería'}
            </div>
          ) : (
            <div className="space-y-12">
              {categoryNames.map(catName => (
                <div key={catName}>
                  <h4 className="text-xl font-bold mb-4" style={{ color: categories.find(c => c.nombre === catName)?.color || undefined }}>
                    {categories.find(c => c.nombre === catName)?.icono && <span className="mr-2">{categories.find(c => c.nombre === catName)?.icono}</span>}
                    {catName}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagesByCategory[catName]
                      .filter(img => img.title.toLowerCase().includes(filter.toLowerCase()))
                      .map((img) => (
                        <div
                          key={img.id + img.imageUrl}
                          className="group relative rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                        >
                          {img.type === 'imagen' ? (
                            <img
                              src={img.imageUrl}
                              alt={img.title}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                              <span className="text-white text-4xl">🎥</span>
                            </div>
                          )}
                          <div className="p-3 bg-white">
                            <p className="text-sm font-medium truncate">{img.title}</p>
                            {img.author && (
                              <p className="text-xs text-gray-500">{img.author.fullName}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(img.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div>
            <h4 className="text-xl font-bold mb-4" style={{ color: categories.find(c => c.nombre === categoryFilter)?.color || undefined }}>
              {categories.find(c => c.nombre === categoryFilter)?.icono && <span className="mr-2">{categories.find(c => c.nombre === categoryFilter)?.icono}</span>}
              {categoryFilter}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagesByCategory[categoryFilter]
                ?.filter(img => img.title.toLowerCase().includes(filter.toLowerCase()))
                .map((img) => (
                  <div
                    key={img.id + img.imageUrl}
                    className="group relative rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                  >
                    {img.type === 'imagen' ? (
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                        <span className="text-white text-4xl">🎥</span>
                      </div>
                    )}
                    <div className="p-3 bg-white">
                      <p className="text-sm font-medium truncate">{img.title}</p>
                      {img.author && (
                        <p className="text-xs text-gray-500">{img.author.fullName}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(img.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
