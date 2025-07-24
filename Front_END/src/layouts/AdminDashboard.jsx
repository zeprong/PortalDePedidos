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

import SellerStats from '../Component/SellerStats';
import ListaCotizaciones from '../Component/ListaCotizaciones';

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

  // La vista 'cotizacion' sí llama correctamente al componente ListaCotizaciones.
  // Si no se muestra, asegúrate de que Sidebar envía 'cotizacion' como valor de vista al seleccionar la opción correspondiente.
  // También revisa que el usuario tenga el rol adecuado para ver esa opción en el menú.

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
      case 'cotizacion':
        // Aquí se llama correctamente el componente de cotizaciones
        return <ListaCotizaciones />;
      case 'inicio':
      default:
        return <SellerStats />;
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
