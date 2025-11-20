'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/client-auth'
import Link from 'next/link'

interface Stats {
  publications: number
  comments: number
  messages: number
  users: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ publications: 0, comments: 0, messages: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [catPublications, setCatPublications] = useState<{[key: string]: any[]}>({});

  useEffect(() => {
    loadStats();
    loadCategories();
  }, []);

  const loadStats = async () => {
    try {
      const headers = getAuthHeaders();
      const [publicationsRes, commentsRes, messagesRes, usersRes] = await Promise.all([
        fetch('/api/publications', { headers }),
        fetch('/api/comments', { headers }),
        fetch('/api/contact', { headers }).catch(() => null),
        fetch('/api/users', { headers }).catch(() => null),
      ]);
      const publications = publicationsRes.ok ? await publicationsRes.json() : [];
      const comments = commentsRes.ok ? await commentsRes.json() : [];
      const messages = messagesRes && messagesRes.ok ? await messagesRes.json() : [];
      const users = usersRes && usersRes.ok ? await usersRes.json() : [];
      setStats({
        publications: Array.isArray(publications) ? publications.length : 0,
        comments: Array.isArray(comments) ? comments.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        users: Array.isArray(users) ? users.length : 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setCatLoading(true);
    setCatError(null);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('No se pudo cargar categorías');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
      // Para cada categoría, cargar publicaciones
      const pubByCat: {[key: string]: any[]} = {};
      await Promise.all(
        data.map(async (cat: any) => {
          const pubRes = await fetch(`/api/publications?status=published&category=${cat.slug}`);
          if (pubRes.ok) {
            const pubs = await pubRes.json();
            pubByCat[cat.slug] = Array.isArray(pubs) ? pubs : [];
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

  if (loading) {
    return <div className="text-center py-8">Cargando estadísticas...</div>;
  }

  const statCards = [
    { title: 'Publicaciones', value: stats.publications, icon: '📝', link: '/admin/publications', color: 'bg-blue-500' },
    { title: 'Comentarios', value: stats.comments, icon: '💬', link: '/admin/comments', color: 'bg-green-500' },
    { title: 'Mensajes', value: stats.messages, icon: '📧', link: '/admin/contact', color: 'bg-yellow-500' },
    { title: 'Usuarios', value: stats.users, icon: '👥', link: '/admin/users', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="mb-4 flex justify-end">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition"
        >
          🌐 Ir a la web pública
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* NUEVA SECCIÓN: Categorías y publicaciones */}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/publications?action=new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            ➕ Nueva Publicación
          </Link>
          <Link
            href="/admin/directors?action=new"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            ➕ Nuevo Directivo
          </Link>
          <Link
            href="/admin/tags?action=new"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            ➕ Nueva Etiqueta
          </Link>
        </div>
      </div>
    </div>
  );
}
