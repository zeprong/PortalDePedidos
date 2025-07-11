import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../config/AuthContext';
import Logo from '../assets/logo.png';
import { X } from 'lucide-react';
import axios from 'axios';

const UserProfileSidebar = ({ isOpen, onClose }) => {
  const { user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    imagen: null,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setForm((prev) => ({ ...prev, imagen: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('correo', form.correo);
    if (form.imagen) {
      formData.append('imagen', form.imagen);
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/usuarios/${user.id_usuario}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setUser(res.data); // Actualiza en contexto
      setEditMode(false);
    } catch (err) {
      console.error('Error al actualizar perfil', err);
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-6 h-6 object-contain" />
            <h3 className="text-xl font-bold text-gray-800">Mi Perfil</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="animate-pulse h-24 w-24 rounded-full bg-gray-200" />
            <div className="animate-pulse h-6 w-3/4 bg-gray-200 rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-4 w-full bg-gray-200 rounded" />
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatar || 'https://i.pravatar.cc/100'}
                alt="Avatar"
                onError={(e) => { e.target.src = 'https://i.pravatar.cc/100'; }}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md mb-3"
              />
              {!editMode ? (
                <>
                  <h4 className="text-lg font-semibold text-gray-800">{user.nombre}</h4>
                  <p className="text-sm text-gray-500">@{user.usuario}</p>

                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setEditMode(true)}
                  >
                    Editar perfil
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="mt-2 p-2 border rounded w-full"
                    placeholder="Nombre"
                  />
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    className="mt-2 p-2 border rounded w-full"
                    placeholder="Correo"
                  />
                  <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleChange}
                    className="mt-2"
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={handleSubmit}
                    >
                      Guardar
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      onClick={() => setEditMode(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Información */}
            {!editMode && (
              <div className="space-y-3 border-t pt-4">
                <ProfileField label="Correo" value={user.correo} />
                <ProfileField label="Rol" value={capitalize(user.rol)} />
                <ProfileField
                  label="Estado"
                  value={user.estado}
                  valueClass={user.estado === 'activo' ? 'text-green-600' : 'text-red-600'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, valueClass = 'text-gray-700' }) => (
  <div className="flex justify-between items-center border-b pb-2 text-sm">
    <span className="font-medium text-gray-500">{label}</span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

UserProfileSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  valueClass: PropTypes.string,
};

export default UserProfileSidebar;
