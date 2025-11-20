import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <table className="min-w-full border rounded">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Rol</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-400">No hay usuarios registrados.</td>
          </tr>
        ) : (
          users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.roleName}</td>
              <td className="px-4 py-2">
                <button className="text-blue-600 hover:underline mr-2">Editar</button>
                <button className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
