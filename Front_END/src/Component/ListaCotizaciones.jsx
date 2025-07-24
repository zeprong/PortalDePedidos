import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cotizacion from './Cotizacion'; // Asegúrate de tener este componente listo

function ListaCotizacionesConImpresion() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const res = await axios.get('http://localhost:3000/cotizaciones');
        setCotizaciones(res.data);
      } catch (err) {
        setError(`Error al cargar cotizaciones: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };
    fetchCotizaciones();
  }, []);

  const calcularTotal = (productos) => {
    if (!productos || !Array.isArray(productos)) return 0;
    return productos.reduce((acc, p) => acc + (parseFloat(p.precio) || 0) * (parseInt(p.cantidad) || 0), 0);
  };

  const imprimirCotizacionPorId = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/cotizaciones/${id}`);
      setCotizacionSeleccionada(res.data);
      setModalAbierto(true);
    } catch (e) {
      alert('Error al obtener la cotización para impresión: ' + e.message);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCotizacionSeleccionada(null);
  };

  // Ahora el filtro busca tanto por nombre de cliente como por NIT
  const cotizacionesFiltradas = cotizaciones.filter((cot) => {
    const filtroLower = filtro.toLowerCase();
    const nombre = cot.clienteNombre?.toLowerCase() || '';
    const nit = cot.clienteNit?.toLowerCase() || '';
    return nombre.includes(filtroLower) || nit.includes(filtroLower);
  });

  // Estilos para ajustar la tabla y el modal tanto en vertical como en horizontal
  // Usamos CSS grid y media queries para adaptar la visualización
  // Además, el modal de impresión se ajusta para landscape y portrait

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 font-sans">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-4 sm:mb-6">Lista de Cotizaciones</h2>

      <input
        type="text"
        placeholder="Buscar por cliente o NIT..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-3 sm:mb-4 px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
      />

      {cargando && <p className="text-center">Cargando cotizaciones...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!cargando && cotizacionesFiltradas.length === 0 && (
        <p className="text-center text-gray-500">No hay cotizaciones disponibles.</p>
      )}

      {!cargando && cotizacionesFiltradas.length > 0 && (
        <div className="overflow-x-auto rounded-md shadow">
          <table className="min-w-full bg-white text-xs sm:text-sm"
            style={{
              tableLayout: 'auto',
              width: '100%',
              // Ajuste para landscape y portrait
              // En pantallas pequeñas, las columnas se apilan
            }}
          >
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">ID</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Cliente</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">NIT</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Fecha</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right">Total</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {cotizacionesFiltradas.map((cot) => (
                <tr key={cot.id} className="border-t hover:bg-gray-100">
                  <td className="py-1 sm:py-2 px-2 sm:px-4">{cot.id}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">{cot.clienteNombre}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">{cot.clienteNit}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">{new Date(cot.fechaCreacion).toLocaleDateString()}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 text-right">
                    ${calcularTotal(cot.productos).toLocaleString()}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                    <button
                      onClick={() => imprimirCotizacionPorId(cot.id)}
                      className="bg-green-700 hover:bg-green-900 text-white py-1 px-2 sm:px-3 rounded-md text-xs sm:text-sm"
                    >
                      Reimprimir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Estilos responsivos para la tabla */}
          <style>
            {`
              @media (max-width: 640px) {
                table, thead, tbody, th, td, tr {
                  display: block;
                }
                thead tr {
                  display: none;
                }
                tbody tr {
                  margin-bottom: 1rem;
                  border: 1px solid #e5e7eb;
                  border-radius: 0.5rem;
                  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
                  background: #fff;
                  padding: 0.5rem;
                }
                td {
                  position: relative;
                  padding-left: 50%;
                  text-align: left;
                  min-height: 2.5rem;
                  border: none;
                }
                td:before {
                  position: absolute;
                  top: 0.5rem;
                  left: 0.75rem;
                  width: 45%;
                  white-space: nowrap;
                  font-weight: bold;
                  color: #065f46;
                  font-size: 0.95em;
                }
                td:nth-of-type(1):before { content: "ID"; }
                td:nth-of-type(2):before { content: "Cliente"; }
                td:nth-of-type(3):before { content: "NIT"; }
                td:nth-of-type(4):before { content: "Fecha"; }
                td:nth-of-type(5):before { content: "Total"; }
                td:nth-of-type(6):before { content: "Acciones"; }
              }
            `}
          </style>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && cotizacionSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={cerrarModal}
        >
          <div
            className="bg-white w-full max-w-md sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg relative p-2 sm:p-6 shadow-xl"
            style={{
              // Ajuste para landscape y portrait en impresión
              // El modal se adapta al ancho y alto de la pantalla
              width: '100%',
              maxWidth: '900px',
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-2 sm:top-3 right-2 sm:right-4 text-xl sm:text-2xl text-gray-500 hover:text-red-600"
              title="Cerrar"
            >
              ×
            </button>

            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Cotizacion
                cliente={{
                  nombreApellidos: cotizacionSeleccionada.clienteNombre,
                  cliente: cotizacionSeleccionada.clienteNit,
                  direccion: cotizacionSeleccionada.clienteDireccion,
                  telefono: cotizacionSeleccionada.clienteTelefono,
                  ciudad: cotizacionSeleccionada.clienteCiudad,
                }}
                productos={cotizacionSeleccionada.productos}
                observaciones={cotizacionSeleccionada.observaciones || ''}
                soloImprimir={true}
                numeroCotizacion={cotizacionSeleccionada.id}
                fechaDocumento={cotizacionSeleccionada.fechaCreacion}
                onCotizacionGuardada={() => {}}
              />
            </div>
            {/* Estilos para impresión en vertical y horizontal */}
            <style>
              {`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .print-modal, .print-modal * {
                    visibility: visible;
                  }
                  .print-modal {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100vw;
                    height: 100vh;
                    background: white;
                  }
                  @page {
                    size: auto;
                    margin: 10mm;
                  }
                  /* Landscape */
                  @media print and (orientation: landscape) {
                    .print-modal {
                      width: 100vw;
                      height: 100vh;
                    }
                  }
                  /* Portrait */
                  @media print and (orientation: portrait) {
                    .print-modal {
                      width: 100vw;
                      height: 100vh;
                    }
                  }
                }
              `}
            </style>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaCotizacionesConImpresion;
