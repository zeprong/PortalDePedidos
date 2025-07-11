import React from 'react';
import PropTypes from 'prop-types';
import { Database,/* Layers,*/ BarChart2 } from 'lucide-react';

// Opciones del panel
const opciones = [
  {
    id: 'scripsql',
    label: 'Subir Existencias',
    icon: Database,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-100',
  },
 /* {
    id: 'generico',
    label: 'Portafolio Genérico',
    icon: Layers,
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-100',
  },*/
  {
    id: 'ventas',
    label: 'Ventas',
    icon: BarChart2,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-100',
  },
];

// Componente de botón mejorado
const OpcionBoton = ({ id, label, Icon, bgColor, textColor, borderColor, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`
      w-full text-left cursor-pointer group p-6 border rounded-xl shadow-sm hover:shadow-md transition-all
      bg-white hover:bg-gray-50 ${borderColor}
    `}
    type="button"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full ${bgColor} ${textColor} transition-all`}>
        <Icon size={28} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Acceso rápido</span>
        <span className="text-lg font-semibold text-gray-800 group-hover:text-black transition">{label}</span>
      </div>
    </div>
  </button>
);

OpcionBoton.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// Panel de opciones estilizado
const PanelOpciones = ({ onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {opciones.map(({ id, label, icon, bgColor, textColor, borderColor }) => (
      <OpcionBoton
        key={id}
        id={id}
        label={label}
        Icon={icon}
        bgColor={bgColor}
        textColor={textColor}
        borderColor={borderColor}
        onClick={onSelect}
      />
    ))}
  </div>
);

PanelOpciones.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default PanelOpciones;
