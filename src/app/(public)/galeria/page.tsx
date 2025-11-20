'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: number;
  nombre: string;
  slug: string;
  icono?: string;
  color?: string;
}
interface Publication {
  id: number;
  titulo: string;
  slug: string;
  imagenUrl: string | null;
  videoThumbnail?: string | null;
  createdAt: string;
  categoria?: Category | null;
  tags?: any[];
}

export default function GaleriaPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [catPublications, setCatPublications] = useState<{[key: string]: Publication[]}>({});

  useEffect(() => {
    loadCategoriesAndPublications();
  }, []);

  const loadCategoriesAndPublications = async () => {
    setCatLoading(true);
    setCatError(null);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('No se pudo cargar categorías');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
      // Para cada categoría, cargar publicaciones
      const pubByCat: {[key: string]: Publication[]} = {};
      await Promise.all(
        data.map(async (cat: Category) => {
          const pubRes = await fetch(`/api/publications?status=published&category=${cat.slug}`);
          if (pubRes.ok) {
            const pubs = await pubRes.json();
            pubByCat[cat.slug] = Array.isArray(pubs) ? pubs.filter((pub: Publication) => pub.imagenUrl) : [];
          } else {
            pubByCat[cat.slug] = [];
          }
        })
      );
      setCatPublications(pubByCat);
    } catch (err: any) {
      setCatError(err.message || 'Error cargando categorías');
    } finally {
      setCatLoading(false);
    }
  };

  // Solo detecta si es video por extensión
  const isVideo = (url: string | null) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Galería</h1>
          <p className="text-xl text-gray-300">
            Explora nuestras publicaciones multimedia organizadas por categoría
          </p>
        </div>
      </section>

      {/* GALERÍA POR CATEGORÍAS */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {catLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
              <p className="mt-4 text-gray-600">Cargando galería...</p>
            </div>
          ) : catError ? (
            <div className="text-center py-12 text-red-600">{catError}</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">No hay categorías registradas.</div>
          ) : (
            <div className="space-y-12">
              {categories.map((cat) => (
                <div key={cat.id} className="border-b pb-8">
                  <div className="flex items-center gap-2 mb-4">
                    {cat.icono && <span className="text-2xl">{cat.icono}</span>}
                    <span className="font-semibold text-xl" style={{ color: cat.color || undefined }}>{cat.nombre}</span>
                  </div>
                  {catPublications[cat.slug] && catPublications[cat.slug].length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {catPublications[cat.slug].map((pub: Publication) => (
                        <Link
                          key={pub.id}
                          href={`/publicaciones/${pub.slug}`}
                          className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                        >
                          <div className="relative aspect-square bg-gray-200">
                            {isVideo(pub.imagenUrl) ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={pub.videoThumbnail || "/video-poster.png"}
                                  alt="Miniatura del video"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ) : pub.imagenUrl ? (
                              <Image
                                src={pub.imagenUrl}
                                alt={pub.titulo}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              />
                            ) : null}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
                              {pub.titulo}
                            </h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">No hay contenido multimedia en esta categoría.</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* INFO */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Comparte nuestros momentos
          </h2>
          <p className="text-gray-600 mb-6">
            Cada imagen y video representa parte de nuestra historia. Haz clic en cualquier elemento 
            para ver la publicación completa con todos los detalles.
          </p>
          <Link
            href="/publicaciones"
            className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Ver todas las publicaciones
          </Link>
        </div>
      </section>
    </div>
  );
}
