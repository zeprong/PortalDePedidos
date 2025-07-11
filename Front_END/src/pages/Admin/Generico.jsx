import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const API_URL = 'http://localhost:3000/generico';

const Generico = () => {
  const [genericos, setGenericos] = useState([]);
  const [form, setForm] = useState({
    item_generico: '',
    descripcion: '',
    reabastecimiento: 'no',
    estado: 'activo',
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const cargarGenericos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setGenericos(res.data);
    } catch (err) {
      console.error('Error al obtener los genéricos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGenericos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        reabastecimiento: form.reabastecimiento === 'si' ? 1 : 0,
      };
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setForm({
        item_generico: '',
        descripcion: '',
        reabastecimiento: 'no',
        estado: 'activo',
      });
      setEditId(null);
      setShowModal(false);
      cargarGenericos();
    } catch (err) {
      console.error('Error al guardar el genérico', err);
    }
  };

  const editarGenerico = (gen) => {
    setForm({
      item_generico: gen.item_generico,
      descripcion: gen.descripcion,
      reabastecimiento:
        gen.reabastecimiento === 1 || gen.reabastecimiento === true ? 'si' : 'no',
      estado: gen.estado,
    });
    setEditId(gen.id_generico);
    setShowModal(true);
  };

  const eliminarGenerico = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este genérico?')) {
      await axios.delete(`${API_URL}/${id}`);
      cargarGenericos();
    }
  };

  const genericosFiltrados = useMemo(() => {
    if (!search.trim()) return genericos;
    return genericos.filter(
      (gen) =>
        gen.item_generico.toLowerCase().includes(search.toLowerCase()) ||
        gen.descripcion.toLowerCase().includes(search.toLowerCase())
    );
  }, [genericos, search]);

  return (
// Asegúrate de tener Tailwind actualizado
<div className="p-4 bg-white rounded-lg shadow-sm max-w-5xl mx-auto text-sm font-inter">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-blue-900">Portaflio de Genéricos</h2>
    <button
      onClick={() => {
        setForm({
          item_generico: '',
          descripcion: '',
          reabastecimiento: 'no',
          estado: 'activo',
        });
        setEditId(null);
        setShowModal(true);
      }}
      className="flex items-center gap-1 border border-gray-300 text-blue-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
    >
      <Plus size={16} />
      Nuevo
    </button>
  </div>

  <input
    type="text"
    placeholder="Buscar item o descripción..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none"
  />

  {loading ? (
    <p className="text-center text-gray-500">Cargando...</p>
  ) : (
    <div className="overflow-x-auto border border-gray-200 rounded max-h-[450px] overflow-y-auto">
      <table className="w-full text-left table-auto">
        <thead className="bg-blue-800 text-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2 border-b">ID</th>
            <th className="px-3 py-2 border-b">Item</th>
            <th className="px-3 py-2 border-b">Descripción</th>
            <th className="px-3 py-2 border-b">Reab.</th>
            <th className="px-3 py-2 border-b">Estado</th>
            <th className="px-3 py-2 border-b text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {genericosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-400">
                No se encontraron registros.
              </td>
            </tr>
          ) : (
            genericosFiltrados.map((gen) => (
              <tr key={gen.id_generico} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b">{gen.id_generico}</td>
                <td className="px-3 py-2 border-b">{gen.item_generico}</td>
                <td className="px-3 py-2 border-b">{gen.descripcion}</td>
                <td className="px-3 py-2 border-b text-center">
                {gen.reabastecimiento === 1 || gen.reabastecimiento === 'si' || gen.reabastecimiento === true ? 'Sí' : 'No'}
                </td>
                <td className="px-3 py-2 border-b">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    gen.estado === 'activo'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {gen.estado}
                  </span>
                </td>
                <td className="px-3 py-2 border-b text-center space-x-2">
                  <button
                    onClick={() => editarGenerico(gen)}
                    className="text-gray-500 hover:text-yellow-500"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => eliminarGenerico(gen.id_generico)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )}

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-semibold mb-4">
          {editId ? 'Editar Genérico' : 'Nuevo Genérico'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="item_generico" className="text-sm text-gray-600">Item Genérico</label>
            <input
              id="item_generico"
              type="text"
              name="item_generico"
              value={form.item_generico}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="text-sm text-gray-600">Descripción</label>
            <input
              id="descripcion"
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="reabastecimiento" className="text-sm text-gray-600">Reabastecimiento</label>
            <select
              id="reabastecimiento"
              name="reabastecimiento"
              value={form.reabastecimiento}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="estado" className="text-sm text-gray-600">Estado</label>
            <select
              id="estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition"
          >
            {editId ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  )}
</div>

  );
};

export default Generico;

