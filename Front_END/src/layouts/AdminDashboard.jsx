import React, { useContext, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import Header from '../Component/Header';
import PanelOpciones from '../Component/adminComponent/PanelOpciones';
import ScripSql from '../pages/Admin/ScripSql';
import Usuario from '../pages/Admin/Usuarios';
import Generico from '../pages/Admin/Generico';
import VentasUpload from '../pages/Admin/VentasUpload';
import PortafolioConsumoExistencias from '../pages/vendedor/PortafolioConsumoExistencias';
import Clientes from '../pages/vendedor/Clientes';
import { usePreventNavigation } from '../config/usePreventNavigation';
import { AuthContext } from '../config/AuthContext';

const AdminDashboard = () => {
  usePreventNavigation();
  const { user } = useContext(AuthContext);
  const [vista, setVista] = useState('inicio');

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-700 font-medium">Cargando información del usuario...</p>
          <div className="mt-4 animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto" />
        </div>
      </div>
    );
  }

  const renderVista = () => {
    switch (vista) {
      case 'actualizacion':
        return <PanelOpciones onSelect={setVista} />;
      case 'scripsql':
        return <ScripSql />;
      case 'generico':
        return <Generico />;
      case 'usuarios':
        return <Usuario />;
      case 'ventas':
        return <VentasUpload />;
      case 'clientes':
        return <Clientes />;
        case 'portafolio':
          return <PortafolioConsumoExistencias />;   
      case 'inicio':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
            <h1 className="text-2xl font-bold mb-2">Bienvenido al Panel de Administración</h1>
            <p className="text-sm text-gray-500 max-w-md">
              Desde aquí puedes gestionar productos, usuarios, portafolios, scripts SQL y más.
              Usa el menú lateral para navegar entre las diferentes secciones.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar onViewSelect={setVista} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white shadow-inner rounded-tl-xl">
          {renderVista()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
