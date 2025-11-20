
"use client";
import React, { useEffect, useState } from 'react';
import UserTable, { User } from './UserTable';

const UsuariosPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener el rol del usuario autenticado desde localStorage
        const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
        const roleName = user.roleName || '';
        const userId = user.id ? String(user.id) : '';
        const res = await fetch('/api/users', {
          headers: {
            'x-user-role': roleName,
            'x-user-id': userId,
          },
        });
        const data = await res.json();
        if (res.ok && data.users) {
          setUsers(
            data.users.map((u: any) => ({
              id: u.id,
              name: u.fullName,
              email: u.email,
              roleName: u.role?.name || '',
            }))
          );
        } else {
          setError(data.error || 'Error al obtener usuarios');
        }
      } catch (err) {
        setError('Error de conexión');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <p className="mb-2">Aquí podrás ver, crear, editar y eliminar usuarios del sistema.</p>
      <div className="border rounded p-4 bg-white shadow">
        {loading ? (
          <p className="text-gray-400">Cargando usuarios...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <UserTable users={users} />
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;
