import React from 'react';
import Sidebar from '../Component/Sidebar';
import Header from '../Component/Header';

const AdminDashboard = () => {
  const adminName = 'Administrador'; // Aquí puedes hacer dinámico con props, contexto o API

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              ¡Bienvenido, {adminName}!
            </h1>
            <p className="text-gray-600 text-lg">
              Administra tu plataforma desde este panel centralizado. Aquí puedes gestionar usuarios, consultar estadísticas, y controlar toda la operación del sistema.
            </p>
          </div>

          {/* Aquí puedes añadir cards, gráficas, tablas, etc */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
