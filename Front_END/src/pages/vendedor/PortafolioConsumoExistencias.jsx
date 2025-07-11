import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import Cart from '../../Component/Cart';
import PropTypes from 'prop-types';

const API_EXISTENCIAS = 'http://localhost:3000/existencias';

const MultiSelectDropdown = ({ label, options, selectedValues, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="relative inline-block w-full sm:w-60" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-left flex justify-between items-center focus:outline-none"
        aria-expanded={open}
        aria-controls="dropdown-list"
        aria-haspopup="true"
      >
        <span className="truncate">{label}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          id="dropdown-list"
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto"
          role="menu"
        >
          {options.length === 0 && (
            <div className="p-2 text-gray-500 text-sm">No hay opciones</div>
          )}
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedValues.includes(opt)}
                onChange={() => toggleOption(opt)}
              />
              <span className="truncate">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

MultiSelectDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedValues: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

const PortafolioConsumoExistencias = () => {
  const [existencias, setExistencias] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedGrupos, setSelectedGrupos] = useState([]);
  const [selectedLineas, setSelectedLineas] = useState([]);
  const [mostrarOrden, setMostrarOrden] = useState(false);

  const [cart, setCart] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  // Estados para modal selección lote
  const [modalLoteOpen, setModalLoteOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [lotesProducto, setLotesProducto] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [cantidadLote, setCantidadLote] = useState(1);

  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchExistencias = async () => {
      try {
        const params = {};
        if (selectedGrupos.length > 0) params.grupos = selectedGrupos.join(',');
        if (selectedLineas.length > 0) params.lineas = selectedLineas.join(',');
        const res = await axios.get(API_EXISTENCIAS, { params });
        setExistencias(res.data);
      } catch (err) {
        alert('Error al cargar existencias: ' + err.message);
      }
    };
    fetchExistencias();
  }, [selectedGrupos, selectedLineas]);

  const grupos = useMemo(() => {
    const setGrupos = new Set();
    existencias.forEach((ex) => {
      if (ex.grupos) setGrupos.add(ex.grupos);
    });
    return Array.from(setGrupos).sort();
  }, [existencias]);

  const lineas = useMemo(() => {
    const setLineas = new Set();
    existencias.forEach((ex) => {
      if (ex.lineas) setLineas.add(ex.lineas);
    });
    return Array.from(setLineas).sort();
  }, [existencias]);

  // Agrupar existencias por item, con lotes
  const existenciasPorItem = useMemo(() => {
    const map = {};
    existencias.forEach((ex) => {
      const itemKey = ex.item;
      if (!map[itemKey]) {
        map[itemKey] = {
          item: ex.item,
          notasItem: ex.notasItem,
          unidadMedida: ex.unidadMedida,
          grupos: ex.grupos,
          lineas: ex.lineas,
          lotes: [],
          existenciaTotal: 0,
          cantDisponibleOrdTotal: 0,
          precioUnitarioTotal: 0,
          precioOrdenFactorTotal: 0,
          factorUMOrden: ex.factorUMOrden || null,
          registros: 0,
        };
      }
      map[itemKey].lotes.push(ex);
      map[itemKey].existenciaTotal += ex.existencia || 0;
      map[itemKey].cantDisponibleOrdTotal += ex.cantDisponibleOrd || 0;
      map[itemKey].precioUnitarioTotal += ex.precioUnitario || 0;
      map[itemKey].precioOrdenFactorTotal += ex.precioOrdenFactor || 0;
      map[itemKey].registros += 1;
    });

    return Object.values(map).map((item) => ({
      ...item,
      precioUnitarioPromedio: item.registros > 0 ? item.precioUnitarioTotal / item.registros : 0,
      precioOrdenPromedio: item.registros > 0 ? item.precioOrdenFactorTotal / item.registros : 0,
    }));
  }, [existencias]);

  const itemsFiltrados = useMemo(() => {
    const texto = searchText.toLowerCase();
    return existenciasPorItem.filter((item) => {
      const textoMatch =
        item.item.toString().includes(texto) ||
        (item.notasItem && item.notasItem.toLowerCase().includes(texto));
      const cantidad = mostrarOrden ? item.cantDisponibleOrdTotal : item.existenciaTotal;
      return textoMatch && cantidad > 0;
    });
  }, [existenciasPorItem, searchText, mostrarOrden]);

  const handleAddToCartClick = (item) => {
    if (item.lotes.length > 1) {
      setProductoSeleccionado(item);
      setLotesProducto(item.lotes.filter(l => (mostrarOrden ? l.cantDisponibleOrd : l.existencia) > 0));
      setLoteSeleccionado(null);
      setCantidadLote(1);
      setModalLoteOpen(true);
    } else if (item.lotes.length === 1) {
      agregarAlCarrito(item.lotes[0], 1);
    } else {
      setMessage('No hay lotes disponibles para este producto.');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const agregarAlCarrito = (lote, cantidad) => {
    const maxCantidad = mostrarOrden ? lote.cantDisponibleOrd : lote.existencia;
    if (cantidad <= 0 || cantidad > maxCantidad) {
      setMessage(`Cantidad inválida para el lote ${lote.lote} del item ${lote.item}.`);
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    const precioUnitario = mostrarOrden ? lote.precioOrdenFactor : lote.precioUnitario;

    setCart((prevCart) => {
      const idUnico = `${lote.item}-${lote.lote}`;
      const found = prevCart.find((i) => i.idUnico === idUnico);
      if (found) {
        return prevCart.map((i) =>
          i.idUnico === idUnico ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...prevCart, { ...lote, cantidad, precioUnitario, idUnico }];
    });

    setMessage(`✅ Lote ${lote.lote} del item ${lote.item} añadido al carrito.`);
    setTimeout(() => setMessage(null), 2000);
  };

  // Función para manejar cuando se guarda la cotización y se quiere reiniciar
  const handleCotizacionGuardada = () => {
    setCart([]);        // Vacía carrito
    setPopupOpen(false); // Cierra modal carrito
    // Si quieres, aquí puedes resetear filtros o búsqueda
  };

  // Justo antes del return del componente PortafolioConsumoExistencias
  let maxCantidad = 1;
  if (loteSeleccionado) {
    if (mostrarOrden) {
      maxCantidad = loteSeleccionado.cantDisponibleOrd;
    } else {
      maxCantidad = loteSeleccionado.existencia;
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded shadow relative">

      {/* Filtros fuera del contenedor scroll para evitar recorte */}
      <div className="flex flex-wrap gap-4 mb-6 z-50 relative items-center">
        <input
          type="text"
          placeholder="Buscar por item o descripción..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2 flex-grow min-w-[200px]"
        />

        <MultiSelectDropdown
          label={`Grupos (${selectedGrupos.length})`}
          options={grupos}
          selectedValues={selectedGrupos}
          onChange={setSelectedGrupos}
        />

        <MultiSelectDropdown
          label={`Lineas (${selectedLineas.length})`}
          options={lineas}
          selectedValues={selectedLineas}
          onChange={setSelectedLineas}
        />

        {/* Checkbox para mostrar orden */}
        <label className="flex items-center space-x-2 whitespace-nowrap">
          <input
            type="checkbox"
            checked={mostrarOrden}
            onChange={() => setMostrarOrden(!mostrarOrden)}
            className="accent-green-600"
          />
          <span className="text-sm">Mostrar Presentación y Precio</span>
        </label>
      </div>

      {message && (
        <div className="mb-4 text-center text-sm text-red-600">
          {message}
        </div>
      )}

      {/* Contenedor tabla con scroll */}
      <div className="relative overflow-x-auto max-h-[500px] md:max-h-[600px] rounded border border-gray-200">
        <table className="min-w-full text-sm bg-white">
          <thead className="sticky top-0 z-20 bg-green-800 text-white shadow">
            <tr>
              <th className="px-2 sm:px-3 py-2 border-b text-center">#</th>
              <th className="px-2 sm:px-3 py-2 border-b">Item</th>
              <th className="px-2 sm:px-3 py-2 border-b">Descripción</th>
              <th className="px-2 sm:px-3 py-2 border-b">U.M.</th>
              <th className="px-2 sm:px-3 py-2 border-b text-right">Factor U.M. Orden</th>
              <th className="px-2 sm:px-3 py-2 border-b text-right">
                {mostrarOrden ? 'Existencias Orden' : 'Existencias'}
              </th>
              <th className="px-2 sm:px-3 py-2 border-b text-right">
                {mostrarOrden ? 'Precio Orden' : 'Precio Unitario'}
              </th>
              <th className="px-2 sm:px-3 py-2 border-b text-center">Carrito</th>
            </tr>
          </thead>
          <tbody>
            {itemsFiltrados.map((item, index) => (
              <tr key={item.item} className="hover:bg-gray-50">
                <td className="px-2 sm:px-3 py-2 border-b text-center">{index + 1}</td>
                <td className="px-2 sm:px-3 py-2 border-b">{item.item}</td>
                <td className="px-2 sm:px-3 py-2 border-b">{item.notasItem}</td>
                <td className="px-2 sm:px-3 py-2 border-b">{item.unidadMedida}</td>
                <td className="px-2 sm:px-3 py-2 border-b text-right">{item.factorUMOrden ?? '-'}</td>
                <td className="px-2 sm:px-3 py-2 border-b text-right">
                  {mostrarOrden
                    ? item.cantDisponibleOrdTotal.toLocaleString()
                    : item.existenciaTotal.toLocaleString()}
                </td>
                <td className="px-2 sm:px-3 py-2 border-b text-right">
                  {(mostrarOrden
                    ? item.precioOrdenPromedio
                    : item.precioUnitarioPromedio
                  ).toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-2 sm:px-3 py-2 border-b text-center">
                  <button
                    onClick={() => handleAddToCartClick(item)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition"
                    title="Agregar al carrito"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {itemsFiltrados.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para seleccionar lote */}
      {modalLoteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Selecciona un lote para <span className="text-green-700">{productoSeleccionado.notasItem}</span>
            </h3>

            {/* Selector de lote */}
            <div className="mb-4">
              <label htmlFor="select-lote" className="block text-gray-700 font-medium mb-2">
                Lote
              </label>
              <select
                id="select-lote"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={loteSeleccionado ? loteSeleccionado.lote : ''}
                onChange={(e) => {
                  const lote = lotesProducto.find(l => l.lote === e.target.value);
                  setLoteSeleccionado(lote);
                  setCantidadLote(1);
                }}
              >
                <option value="" disabled>-- Selecciona un lote --</option>
                {lotesProducto.map((lote) => (
                  <option key={lote.lote} value={lote.lote}>
                    {lote.lote} - Vence: {lote.fechaVcto} - Stock: {mostrarOrden ? lote.cantDisponibleOrd : lote.existencia}
                  </option>
                ))}
              </select>
            </div>

            {/* Input cantidad */}
            <div className="mb-6">
              <label htmlFor="input-cantidad" className="block text-gray-700 font-medium mb-2">
                Cantidad
              </label>
              <input
                id="input-cantidad"
                type="number"
                min="1"
                max={maxCantidad}
                value={cantidadLote}
                onChange={(e) => setCantidadLote(Number(e.target.value))}
                disabled={!loteSeleccionado}
                className="w-full border border-gray-300 rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ingrese la cantidad"
              />
              {loteSeleccionado && (
                <p className="mt-1 text-sm text-gray-500">
                  Máximo disponible: <span className="font-semibold">{mostrarOrden ? loteSeleccionado.cantDisponibleOrd : loteSeleccionado.existencia}</span>
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalLoteOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!loteSeleccionado) {
                    alert('Por favor selecciona un lote.');
                    return;
                  }
                  if (cantidadLote < 1 || cantidadLote > (mostrarOrden ? loteSeleccionado.cantDisponibleOrd : loteSeleccionado.existencia)) {
                    alert('Cantidad inválida.');
                    return;
                  }
                  agregarAlCarrito(loteSeleccionado, cantidadLote);
                  setModalLoteOpen(false);
                }}
                className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition"
                type="button"
              >
                Agregar al carrito
              </button>
            </div>

            {/* Botón cerrar en la esquina */}
            <button
              onClick={() => setModalLoteOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Cerrar modal"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Botón para abrir carrito */}
      <button
        onClick={() => setPopupOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl z-50"
        title="Ver carrito"
      >
        🛒
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-2 text-xs font-bold min-w-[20px] text-center">
            {cart.length}
          </span>
        )}
      </button>

      <Cart
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        cart={cart}
        onRemove={(idUnico) => setCart(cart.filter(i => i.idUnico !== idUnico))}
        onClear={() => setCart([])}
        onClienteChange={(cliente) => {
          // Puedes manejar aquí si quieres
        }}
        onCotizacionGuardada={handleCotizacionGuardada} // <-- Pasamos la función para reiniciar
      />
    </div>
  );
};

export default PortafolioConsumoExistencias;
