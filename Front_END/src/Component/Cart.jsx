import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx'; // Para exportar a Excel
import { saveAs } from 'file-saver'; // Para guardar archivos (excel)

import Cotizacion from './Cotizacion'; // Importamos el componente de Cotización

const Cart = ({ open, onClose, cart, onRemove, onClear, onClienteChange, onCotizacionGuardada }) => {
  const [localCart, setLocalCart] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [inputCliente, setInputCliente] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mostrarCotizacion, setMostrarCotizacion] = useState(false); // Estado para mostrar/ocultar el modal de Cotizacion

  const suggestionsRef = useRef(null); // Ref para cerrar sugerencias al hacer clic fuera

  // Carga inicial de clientes al montar el componente
  useEffect(() => {
    fetch('http://localhost:3000/clientes')
      .then(res => res.json())
      .then(data => {
        const clientesPreparados = data.map(cliente => ({
          ...cliente,
          telefono: cliente.telefono || '',
          ciudad: cliente.ciudad || ''
        }));
        setClientes(clientesPreparados);
        if (!clienteSeleccionado && clientesPreparados.length > 0) {
          setClienteSeleccionado(clientesPreparados[0]);
          setInputCliente(clientesPreparados[0].nombreApellidos || clientesPreparados[0].nombre || '');
          if (onClienteChange) onClienteChange(clientesPreparados[0]);
        }
      })
      .catch(err => console.error('Error cargando clientes:', err));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (clientes.length > 0 && !clienteSeleccionado) {
      setClienteSeleccionado(clientes[0]);
      setInputCliente(clientes[0].nombreApellidos || clientes[0].nombre || '');
      if (onClienteChange) onClienteChange(clientes[0]);
    }
    // eslint-disable-next-line
  }, [clientes]);

  useEffect(() => {
    if (open) {
      const clonedCart = cart.map(item => ({
        ...item,
        precio_editado: item.precioUnitario ?? 0,
        descripcion: item.notasItem ?? item.descripcion ?? '',
        codigo: item.codigo ?? item.id_generico ?? item.item ?? '',
        id_generico: item.id_generico ?? item.item ?? '',
        cantidad: item.cantidad ?? 1,
        lote: item.lote || '-',
        fechaVcto: item.fechaLote || item.fechaVcto || '-',
        iva: item.iva || 0,
      }));
      setLocalCart(clonedCart);
    }
  }, [open, cart]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputCliente(val);
    setShowSuggestions(true);

    const clienteMatch = clientes.find(c =>
      (c.nombreApellidos || c.nombre || '').toLowerCase() === val.toLowerCase()
    );
    if (clienteMatch) {
      setClienteSeleccionado(clienteMatch);
      if (onClienteChange) onClienteChange(clienteMatch);
      setShowSuggestions(false);
    } else {
      setClienteSeleccionado(null);
      if (onClienteChange) onClienteChange(null);
    }
  };

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setInputCliente(cliente.nombreApellidos || cliente.nombre || '');
    setShowSuggestions(false);
    if (onClienteChange) onClienteChange(cliente);
  };

  const handleChangeCantidad = (index, value) => {
    const newCart = [...localCart];
    const cantidad = parseInt(value);
    newCart[index].cantidad = isNaN(cantidad) || cantidad < 0 ? 0 : cantidad;
    setLocalCart(newCart);
  };

  const calcularTotal = () =>
    localCart.reduce((sum, item) => sum + item.cantidad * item.precio_editado, 0);

  const exportToExcel = () => {
    if (!clienteSeleccionado) {
      alert('Por favor selecciona un cliente antes de exportar.');
      return;
    }

    const wb = XLSX.utils.book_new();

    const encabezado = [
      ['San Miguel Group Sas'],
      ['NIT 901757169-3 | Responsable de IVA'],
      ['Actividad Económica: 4773'],
      ['Bodega Ventas Punto'],
      ['notificaciones@smgroupsas.com.co | 310 5164909'],
      ['Calle 17 No 19-46, SAN MIGUEL'],
      [],
      ['Cliente:', clienteSeleccionado.nombreApellidos || clienteSeleccionado.nombre || clienteSeleccionado.razonSocial || ''],
      ['Cédula:', clienteSeleccionado.cliente || ''],
      ['Dirección:', clienteSeleccionado.direccion || ''],
      ['Ciudad:', clienteSeleccionado.ciudad || ''],
      ['Teléfono:', clienteSeleccionado.telefono || ''],
      [],
      ['Factura No:', '0001'],
      ['Fecha de Factura:', new Date().toLocaleDateString()],
      ['Fecha de Vencimiento:', new Date(Date.now() + 30*86400000).toLocaleDateString()],
      [],
    ];

    const productosData = [
      ['No', 'CANT.', 'DESCRIPCIÓN', 'LOTE', 'FECHA VCTO', 'VR. UNIT', 'VR. TOTAL'],
      ...localCart.map((item, idx) => [
        idx + 1,
        item.cantidad,
        item.descripcion,
        item.lote || '-',
        item.fechaVcto || '-',
        item.precio_editado,
        (item.precio_editado * item.cantidad).toFixed(2),
      ]),
      [],
    ];

    const subtotal = localCart.reduce((acc, item) => acc + item.precio_editado * item.cantidad, 0);
    const totales = [
      ['', '', '', '', '', 'Subtotal:', subtotal.toFixed(2)],
      ['', '', '', '', '', 'TOTAL:', subtotal.toFixed(2)],
      [],
    ];

    const observacionesData = [
      ['Observaciones:'],
      [localCart.length === 0 ? 'Ninguna' : ''],
    ];

    const hojaDatos = [
      ...encabezado,
      ...productosData,
      ...totales,
      ...observacionesData,
    ];

    const ws = XLSX.utils.aoa_to_sheet(hojaDatos);
    XLSX.utils.book_append_sheet(wb, ws, 'Cotizacion');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Cotizacion_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleGenerarDocumento = () => {
    setMostrarCotizacion(true);
  };

  const handleCerrarCotizacion = () => {
    setMostrarCotizacion(false);
  };

  const handleCotizacionGuardada = () => {
    onClear();
    setMostrarCotizacion(false);
    setClienteSeleccionado(null);
    setInputCliente('');
    if (onClienteChange) onClienteChange(null);
    if (onCotizacionGuardada) onCotizacionGuardada();
  };

  if (!open) return null;

  const clientesFiltrados = clientes.filter(c =>
    (c.nombreApellidos || c.nombre || '').toLowerCase().includes(inputCliente.toLowerCase())
  ).slice(0, 5);

  // Estilos responsivos adicionales para mobile
  // Usamos clases tailwind y algunos estilos inline para asegurar responsividad
  // y mejor experiencia en vertical/horizontal
  return (
    <>
      {/* Overlay y modal del carrito */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className="
            bg-white rounded-xl w-full
            max-w-[800px] max-h-[90vh]
            shadow-2xl relative border border-gray-300
            text-xs text-gray-800 font-sans flex flex-col
            sm:max-w-[800px]
            md:max-w-[800px]
            lg:max-w-[800px]
            min-h-[60vh]
            sm:min-h-[60vh]
            md:min-h-[60vh]
            lg:min-h-[60vh]
            overflow-hidden
          "
          style={{
            width: '100%',
            maxWidth: '100vw',
            minHeight: '60vh',
            maxHeight: '95vh',
            // Para pantallas pequeñas, que ocupe casi todo el alto
          }}
        >
          {/* Header del carrito */}
          <div className="flex justify-between items-center px-2 sm:px-4 py-2 bg-white border-b border-gray-200 text-sm sticky top-0 z-10 rounded-t-xl">
            <span className="text-green-900 font-medium text-base sm:text-lg">Carrito de productos</span>
            <button onClick={onClose} className="text-gray-500 text-lg font-semibold hover:text-gray-700 px-2">×</button>
          </div>

          {/* Selector de cliente con autocomplete */}
          <div className="p-2 sm:p-4 border-b border-gray-200 relative" ref={suggestionsRef}>
            <label htmlFor="cliente-input" className="block mb-1 font-semibold text-gray-700 text-xs sm:text-sm">Seleccionar Cliente:</label>
            <input
              id="cliente-input"
              type="text"
              value={inputCliente}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full border border-gray-300 rounded px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm"
              placeholder="Escribe el nombre del cliente"
              autoComplete="off"
            />
            {showSuggestions && clientesFiltrados.length > 0 && (
              <ul className="absolute z-20 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto w-full shadow-lg">
                {clientesFiltrados.map(cliente => (
                  <button
                    key={cliente.id}
                    className="px-3 py-2 cursor-pointer hover:bg-green-100 w-full text-left text-xs sm:text-sm"
                    onClick={() => handleSelectCliente(cliente)}
                    type="button"
                  >
                    {cliente.nombreApellidos || cliente.nombre || cliente.razonSocial}
                  </button>
                ))}
              </ul>
            )}
            {clienteSeleccionado && (
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Cliente seleccionado: <strong>{clienteSeleccionado.nombreApellidos || clienteSeleccionado.nombre || clienteSeleccionado.razonSocial}</strong>
              </p>
            )}
          </div>

          {/* Contenido del carrito (productos) */}
          <div
            id="cart-content"
            className="overflow-y-auto flex-1 p-2 sm:p-4 space-y-3"
            style={{
              minHeight: '30vh',
              maxHeight: '40vh',
              // En mobile, que no crezca demasiado
            }}
          >
            {localCart.length === 0 ? (
              <p className="text-gray-400 text-center py-10 text-sm sm:text-base">Sin productos.</p>
            ) : (
              localCart.map((item, idx) => {
                const precio = item.precio_editado;
                const total = precio * item.cantidad;
                return (
                  <div
                    key={item.id_generico || idx}
                    className="border border-gray-100 rounded-md p-2 sm:p-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{idx + 1}. {item.descripcion}</div>
                      <div className="text-[11px] text-gray-500 mb-1">Código: {item.codigo}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor={`cantidad-${idx}`} className="text-[11px] text-gray-600">Cant.</label>
                          <input
                            id={`cantidad-${idx}`}
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => handleChangeCantidad(idx, e.target.value)}
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right"
                          />
                        </div>
                        <div>
                          <label htmlFor={`precio-${idx}`} className="text-[11px] text-gray-600">Precio</label>
                          <input
                            id={`precio-${idx}`}
                            type="number"
                            value={precio}
                            readOnly
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-right text-gray-600">
                        Total: <strong className="text-gray-800">{total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0 sm:ml-4">
                      <button onClick={() => onRemove(item.id_generico)} className="text-red-500 text-xs hover:underline">Eliminar</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del carrito */}
          {localCart.length > 0 && (
            <div className="bg-white p-2 sm:p-3 border-t border-gray-200 sticky bottom-0 z-10 rounded-b-xl flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
              <button onClick={onClear} className="text-red-600 hover:underline mb-2 sm:mb-0">Vaciar</button>
              <div className="flex space-x-2 mb-2 sm:mb-0">
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 rounded text-xs"
                  title="Exportar carrito a Excel"
                >
                  Exportar a Excel
                </button>
                <button
                  onClick={handleGenerarDocumento}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 sm:px-3 py-1 rounded text-xs"
                  title="Generar documento"
                >
                  Generar documento
                </button>
              </div>
              <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                Total: {calcularTotal().toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal para la Cotización (vista previa y descarga) */}
      {mostrarCotizacion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-60 flex items-center justify-center p-2 sm:p-4">
          <div
            className="
              bg-white rounded-xl w-full
              max-w-4xl max-h-[95vh]
              shadow-2xl relative border border-gray-300 p-2 sm:p-4 overflow-auto
            "
            style={{
              width: '100%',
              maxWidth: '100vw',
              minHeight: '60vh',
              maxHeight: '95vh',
            }}
          >
            <button
              onClick={handleCerrarCotizacion}
              className="absolute top-2 right-4 text-xl text-gray-600 hover:text-gray-900"
              title="Cerrar"
            >
              ×
            </button>
            {/* Componente Cotizacion, con mapeo explícito de propiedades del cliente */}
            <Cotizacion
              cliente={{
                nombreApellidos: clienteSeleccionado?.nombreApellidos || '',
                nombre: clienteSeleccionado?.nombre || '',
                razonSocial: clienteSeleccionado?.razonSocial || '',
                cliente: clienteSeleccionado?.cliente || clienteSeleccionado?.nit || '',
                direccion: clienteSeleccionado?.direccion || '',
                telefono: clienteSeleccionado?.telefono || '',
                ciudad: clienteSeleccionado?.ciudad || ''
              }}
              productos={localCart.map(item => ({
                codigo: item.codigo,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precio: item.precio_editado,
                lote: item.lote || '-',
                fechaVcto: item.fechaLote || item.fechaVcto || '-',
                iva: item.iva || 0,
              }))}
              observaciones={`Cliente: ${clienteSeleccionado ? (clienteSeleccionado.nombreApellidos || clienteSeleccionado.nombre || clienteSeleccionado.razonSocial) : ''}`}
              onCotizacionGuardada={handleCotizacionGuardada}
            />
          </div>
        </div>
      )}
      {/* Estilos responsivos extra para mobile */}
      <style>{`
        @media (max-width: 640px) {
          #cart-content {
            min-height: 30vh !important;
            max-height: 40vh !important;
          }
          .max-w-4xl, .max-w-[800px] {
            max-width: 100vw !important;
          }
          .rounded-xl {
            border-radius: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
};

Cart.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onClienteChange: PropTypes.func,
  onCotizacionGuardada: PropTypes.func,
};

export default Cart;
