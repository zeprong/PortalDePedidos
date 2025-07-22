import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombreApellidos: "",
    cliente: "",
    razonSocial: "",
    direccion: "",
    correoElectronico: "",
    telefono: "",
    ciudad: "",
    tipoNegocio: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const openModalNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openModalEdit = (cliente) => {
    setForm({
      nombreApellidos: cliente.nombreApellidos || "",
      cliente: cliente.cliente || "",
      razonSocial: cliente.razonSocial || "",
      direccion: cliente.direccion || "",
      correoElectronico: cliente.correoElectronico || "",
      telefono: cliente.telefono || "",
      ciudad: cliente.ciudad || "",
      tipoNegocio: cliente.tipoNegocio || "",
    });
    setEditingId(cliente.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      nombreApellidos: "",
      cliente: "",
      razonSocial: "",
      direccion: "",
      correoElectronico: "",
      telefono: "",
      ciudad: "",
      tipoNegocio: "",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, form);
      } else {
        await api.post("/clientes", form);
      }
      await fetchClientes();
      closeModal();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const filteredClientes = clientes.filter((c) =>
    (c.nombreApellidos || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.razonSocial || "").toLowerCase().includes(search.toLowerCase())
  );

  // Vista de tarjeta para móvil
  const ClienteCard = ({ cliente, onEdit }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-green-200 flex flex-col gap-2">
      <div>
        <span className="font-semibold text-green-800">Nombre: </span>
        {cliente.nombreApellidos}
      </div>
      <div>
        <span className="font-semibold text-green-800">Cliente: </span>
        {cliente.cliente}
      </div>
      <div>
        <span className="font-semibold text-green-800">Razón Social: </span>
        {cliente.razonSocial}
      </div>
      <div>
        <span className="font-semibold text-green-800">Dirección: </span>
        {cliente.direccion}
      </div>
      <div>
        <span className="font-semibold text-green-800">Correo: </span>
        {cliente.correoElectronico}
      </div>
      <div>
        <span className="font-semibold text-green-800">Teléfono: </span>
        {cliente.telefono}
      </div>
      <div>
        <span className="font-semibold text-green-800">Ciudad: </span>
        {cliente.ciudad}
      </div>
      <div>
        <span className="font-semibold text-green-800">Tipo de Negocio: </span>
        {cliente.tipoNegocio}
      </div>
      <div className="flex justify-end mt-2">
        <button
          className="text-green-700 border border-green-700 px-3 py-1 rounded hover:bg-green-700 hover:text-white transition whitespace-nowrap"
          onClick={() => onEdit(cliente)}
        >
          Editar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-screen-xl mx-auto">

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 px-2 sm:px-4 py-2 bg-white sticky top-0 z-30 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-semibold text-green-800">
            Gestión de Clientes
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={openModalNew}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition whitespace-nowrap"
            >
              Nuevo Cliente
            </button>
          </div>
        </header>

        {/* Vista de tabla en escritorio, tarjetas en móvil */}
        <div>
          {/* Vista de tabla solo en pantallas medianas en adelante */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-md bg-white max-h-[500px] overflow-y-auto">
              <table className="min-w-full table-fixed border-collapse">
                <thead className="bg-green-100 sticky top-0 z-20">
                  <tr>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Nombre
                    </th>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Cliente
                    </th>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Razón Social
                    </th>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Dirección
                    </th>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Correo
                    </th>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Teléfono
                    </th>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Ciudad
                    </th>
                    <th className="p-3 border-b border-green-300 text-left text-green-900 font-semibold whitespace-nowrap">
                      Tipo de Negocio
                    </th>
                    <th className="p-3 border-b border-green-300 text-center text-green-900 font-semibold whitespace-nowrap">
                      Editar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-gray-500">
                        No se encontraron clientes.
                      </td>
                    </tr>
                  )}
                  {filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="even:bg-green-50 hover:bg-green-100 transition"
                    >
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.nombreApellidos}</td>
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.cliente}</td>
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.razonSocial}</td>
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.direccion}</td>
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.correoElectronico}</td>
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.telefono}</td>
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.ciudad}</td>
                      <td className="p-3 border-b border-green-200 whitespace-nowrap">{cliente.tipoNegocio}</td>
                      <td className="p-3 border-b border-green-200 text-center">
                        <button
                          className="text-green-700 border border-green-700 px-3 py-1 rounded hover:bg-green-700 hover:text-white transition whitespace-nowrap"
                          onClick={() => openModalEdit(cliente)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Vista de tarjetas solo en móvil */}
          <div className="block md:hidden mt-2">
            {filteredClientes.length === 0 && (
              <div className="p-6 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                No se encontraron clientes.
              </div>
            )}
            {filteredClientes.map((cliente) => (
              <ClienteCard key={cliente.id} cliente={cliente} onEdit={openModalEdit} />
            ))}
          </div>
        </div>

        {/* Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModal}
          >
            <div className="min-h-screen px-2 sm:px-4 text-center bg-black bg-opacity-30 flex items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="inline-block w-full max-w-md sm:max-w-3xl p-4 sm:p-6 my-10 overflow-hidden text-left align-middle transition-all transform bg-white shadow-green-600 shadow-lg rounded-lg">
                  <Dialog.Title
                    as="h3"
                    className="text-xl sm:text-2xl font-bold mb-5 text-green-800"
                  >
                    {editingId ? "Editar Cliente" : "Crear Cliente"}
                  </Dialog.Title>

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-3 sm:gap-4 max-h-[70vh] overflow-y-auto sm:grid-cols-2"
                  >
                    {[
                      { label: "Nombre y Apellidos", name: "nombreApellidos" },
                      { label: "Cliente", name: "cliente" },
                      { label: "Razón Social", name: "razonSocial" },
                      { label: "Dirección", name: "direccion" },
                      { label: "Correo Electrónico", name: "correoElectronico", type: "email" },
                      { label: "Teléfono", name: "telefono" },
                      { label: "Ciudad", name: "ciudad" },
                      { label: "Tipo de Negocio", name: "tipoNegocio" },
                    ].map(({ label, name, type }) => (
                      <input
                        key={name}
                        type={type || "text"}
                        name={name}
                        placeholder={label}
                        value={form[name]}
                        onChange={handleChange}
                        required={name === "nombreApellidos" || name === "cliente"}
                        className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    ))}

                    <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2 sm:mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-md border border-green-500 text-green-700 hover:bg-green-100 transition"
                        onClick={closeModal}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        {editingId ? "Actualizar" : "Crear"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        
      </div>
    </div>
  );
}
