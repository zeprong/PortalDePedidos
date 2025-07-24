import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Home, Users, Upload, UserCheck, Menu, TrendingUpDown, BriefcaseBusiness, NotebookPenIcon,CalendarRange,
  LogOut, Settings, ShoppingCart, Warehouse, DollarSign, Briefcase, UserCog, Laptop
} from 'lucide-react';
import { AuthContext } from '../config/AuthContext';
import Logo from '../assets/Bc.png';

const Sidebar = ({ onViewSelect }) => {
  const { user, signOut } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => setIsVisible(prev => !prev);

  const menu = [
    { label: 'Inicio', icon: Home, view: 'inicio', roles: ['admin', 'vendedor', 'comprador', 'almacen', 'gerente'] },
    { label: 'Siesa Uno-e', icon: Laptop, view: 'siesaUnoE', roles: ['admin', 'comprador', 'almacen', 'gerente'] },
    { label: 'Clientes', icon: Users, view: 'clientes', roles: ['vendedor', 'admin'] },
    { label: 'Usuarios', icon: Users, view: 'usuarios', roles: ['admin'] },
    { label: 'Actualización', icon: Upload, view: 'actualizacion', roles: ['admin'] },
    { label: 'Portafolio', icon: BriefcaseBusiness, view: 'portafolio', roles: ['admin', 'vendedor'] },
    { label: 'Aprobaciones', icon: UserCheck, view: 'aprobaciones', roles: ['admin'] },
    { label: 'Resumen Ventas', icon: DollarSign, view: 'resumenVentas', roles: ['gerente'] },
    { label: 'Gestión Personal', icon: UserCog, view: 'gestionPersonal', roles: ['gerente'] },
    { label: 'Órdenes de Compra', icon: ShoppingCart, view: 'ordenesCompra', roles: ['comprador'] },
    { label: 'Proveedores', icon: Briefcase, view: 'proveedores', roles: ['comprador'] },
    { label: 'Inventario', icon: Warehouse, view: 'inventario', roles: ['almacen'] },
    { label: 'Recepción', icon: Upload, view: 'recepcion', roles: ['almacen'] },
    { label: 'Cotizaciones', icon: NotebookPenIcon, view: 'cotizacion', roles: ['vendedor'] },
    { label: 'Programador Visitas', icon: CalendarRange, view: 'programadorVisitas', roles: ['vendedor'] },
   
    { label: 'Historial de Ventas', icon: TrendingUpDown, view: 'historialVentas', roles: ['vendedor'] },
    { label: 'Configuración', icon: Settings, view: 'configuracion', roles: ['admin', 'vendedor', 'comprador', 'almacen', 'gerente'] },
  ];

  const menuFiltrado = menu.filter(item => item.roles.includes(user?.rol));
  const inicioIndex = menuFiltrado.findIndex(item => item.label === 'Inicio');

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    signOut();
  };

  return (
    <aside className={`transition-all duration-300 ease-in-out ${isVisible ? 'w-60' : 'w-20'} bg-white border-r shadow-md h-screen p-4 flex flex-col`}>
      {/* Logo y botón de colapso */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={toggleSidebar} className="text-green-950 hover:text-green-600">
          <Menu className="w-5 h-5" />
        </button>
        {isVisible && (
          <img src={Logo} alt="Logo" className="h-40 object-contain" />
        )}
      </div>

      {/* Menú principal */}
      <nav className="flex-1 space-y-1">
        {menuFiltrado.map((item, idx) => (
          <React.Fragment key={item.label}>
            <NavItem
              icon={item.icon}
              label={item.label}
              visible={isVisible}
              onSelect={() => onViewSelect(item.view)}
            />
            {idx === inicioIndex && (
              <hr className="my-2 border-green-200" />
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-600 hover:text-green-600 p-2 rounded-md hover:bg-green-50 transition"
        >
          <LogOut className="w-5 h-5 text-green-900" />
          {isVisible && <span className="text-sm font-medium text-green-700">Salir</span>}
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon: Icon, label, visible, onSelect }) => (
  <button
    onClick={onSelect}
    className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 text-green-900 hover:text-green-600 transition group w-full"
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    {visible && <span className="text-sm font-medium ">{label}</span>}
  </button>
);

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

Sidebar.propTypes = {
  onViewSelect: PropTypes.func.isRequired,
};

export default Sidebar;
