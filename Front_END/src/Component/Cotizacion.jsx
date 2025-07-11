import React, { useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import LOGO_URL from '../assets/Bc.png';
import { AuthContext } from '../config/AuthContext';
import numeroALetras, { limpiarNumero } from '../config/numeroALetras';

const Cotizacion = ({ cliente = {}, productos = [], observaciones = '', onCotizacionGuardada }) => {
  const { user } = useContext(AuthContext);
  const facturaRef = useRef(null);

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [proximoNumero, setProximoNumero] = useState(null);
  const [loadingNumero, setLoadingNumero] = useState(true);
  const [errorNumero, setErrorNumero] = useState(false);

  const fechaFactura = new Date();
  const fechaVencimiento = new Date(Date.now() + 30 * 86400000);

  const subtotal = productos.reduce(
    (acc, item) => acc + limpiarNumero(item.precio) * item.cantidad,
    0
  );

  useEffect(() => {
    const fetchCotizaciones = async () => {
      setLoadingNumero(true);
      setErrorNumero(false);
      try {
        const res = await axios.get('http://localhost:3000/cotizaciones');
        if (Array.isArray(res.data)) {
          const maxId = res.data.reduce((max, c) => Math.max(max, c.id), 0);
          setProximoNumero(maxId + 1);
        } else {
          throw new Error('Respuesta inesperada');
        }
      } catch (error) {
        console.error('Error al traer las cotizaciones:', error);
        setErrorNumero(true);
      } finally {
        setLoadingNumero(false);
      }
    };

    fetchCotizaciones();
  }, []);

  const guardarCotizacion = async () => {
    try {
      setGuardando(true);
      setMensaje('');

      const payload = {
        clienteNombre: cliente.nombre || cliente.razonSocial || '',
        clienteNit: cliente.cliente || '',
        clienteDireccion: cliente.direccion || '',
        clienteTelefono: cliente.telefono || '',
        clienteCiudad: cliente.ciudad || '',
        representanteNombre: user?.nombre || '',
        representanteDocumento: user?.documento || '',
        observaciones: observaciones || '',
        productos: productos.map((item) => ({
          item: String(item.item ?? item.codigo ?? ''),
          descripcion: item.descripcion || '',
          cantidad: item.cantidad || 0,
          precio: limpiarNumero(item.precio),
          lote: item.lote || '',
          fechaVcto: item.fechaVcto || '',
          grupo: item.grupo || '',
          linea: item.linea || '',
        })),
      };

      await axios.post('http://localhost:3000/cotizaciones', payload);

      setMensaje('✅ Cotización guardada correctamente');
    } catch (error) {
      console.error('Error al guardar cotización:', error);
      if (error.response && error.response.data) {
        setMensaje(`❌ Error: ${JSON.stringify(error.response.data)}`);
      } else {
        setMensaje('❌ Error al guardar la cotización');
      }
    } finally {
      setGuardando(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => facturaRef.current,
    documentTitle: `Cotizacion_${proximoNumero ? String(proximoNumero).padStart(4, '0') : '0000'}`,
  });

  let textoNumeroCotizacion;
  if (loadingNumero) {
    textoNumeroCotizacion = 'Cargando número...';
  } else if (errorNumero) {
    textoNumeroCotizacion = 'Error al cargar número';
  } else {
    textoNumeroCotizacion = `COTIZACIÓN N° ${String(proximoNumero).padStart(4, '0')}`;
  }

  return (
    <div className="p-4">
      {/* Vista previa de la cotización */}
      <div
        ref={facturaRef}
        className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 max-w-4xl mx-auto text-sm font-sans text-gray-800"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center p-2 mb-4 text-center">
          <div className="flex items-center">
            <img src={LOGO_URL} alt="Logo" className="h-24 mr-4" />
            <div className="text-xs leading-tight ml-30">
              <div className="font-bold uppercase">SAN MIGUEL GROUP SAS</div>
              <div>NIT 901757169-3 - RESPONSABLE DE IVA</div>
              <div>Actividad Económica 4773</div>
              <div>Bodega Ventas Punto</div>
              <div>notificaciones@smgroupsas.com.co | 310 5164909</div>
              <div>Calle 17 No 19-46, SAN MIGUEL</div>
            </div>
          </div>
          <div className="border border-gray-400 p-2 text-xs text-center">
            <div className="font-bold">{textoNumeroCotizacion}</div>
            <div>Fecha: {fechaFactura.toLocaleDateString('es-CO')}</div>
          </div>
        </div>

        {/* Cliente y datos */}
        <table className="w-full text-xs mb-4 border border-black" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th className="border border-black p-1 text-left">Señores</th>
              <th className="border border-black p-1 text-left align-top">
                {cliente.nombreApellidos || cliente.nombre || cliente.razonSocial}
              </th>
              <th className="border border-black p-1 text-left">NIT</th>
              <th className="border border-black p-1 text-left">{cliente.cliente}</th>
              <th className="border border-black p-1 text-center" colSpan="3">FECHA DE VENCIMIENTO</th>
              <th className="border border-black p-1 text-center">
                {fechaVencimiento.toLocaleDateString('es-CO')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black font-bold p-1 text-left">Dirección</td>
              <td className="border border-black p-1 text-left">{cliente.direccion}</td>
              <td className="border border-black font-bold p-1 text-left">Teléfono</td>
              <td className="border border-black p-1 text-left">{cliente.telefono}</td>
              <td className="border border-black font-bold p-1 text-center" colSpan="3">Ciudad</td>
              <td className="border border-black p-1 text-center">{cliente.ciudad}</td>
            </tr>
          </tbody>
        </table>

        {/* Tabla productos */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-700 mb-4 text-xs p-4">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="border border-gray-700 p-2">No</th>
                <th className="border border-gray-700 p-2">ITEM</th>
                <th className="border border-gray-700 p-2">DESCRIPCIÓN</th>
                <th className="border border-gray-700 p-2">CANT.</th>
                <th className="border border-gray-700 p-2">LOTE</th>
                <th className="border border-gray-700 p-2">FECHA VCTO</th>
                <th className="border border-gray-700 p-2">VR. UNIT</th>
                <th className="border border-gray-700 p-2">VR. TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500 p-2">
                    Sin productos
                  </td>
                </tr>
              ) : (
                productos.map((item, idx) => (
                  <tr key={item.codigo ?? idx} className="even:bg-gray-50">
                    <td className="text-center border border-gray-700 p-2">{idx + 1}</td>
                    <td className="text-center border border-gray-700 p-2">{String(item.item ?? item.codigo ?? '-')}</td>
                    <td className="text-left border border-gray-700 p-2">{item.descripcion}</td>
                    <td className="text-center border border-gray-700 p-2">{item.cantidad}</td>
                    <td className="text-center border border-gray-700 p-2">{item.lote || '-'}</td>
                    <td className="text-center border border-gray-700 p-2">{item.fechaVcto || '-'}</td>
                    <td className="text-right border border-gray-700 p-2">
                      {limpiarNumero(item.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                    </td>
                    <td className="text-right border border-gray-700 p-2 font-semibold">
                      {(limpiarNumero(item.precio) * item.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="flex justify-end mt-10">
          <table className="w-1/2 text-sm">
            <thead>
              <tr>
                <th className="text-right">Concepto</th>
                <th className="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-right font-medium py-1 pr-2">Subtotal:</td>
                <td className="text-right">
                  {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </td>
              </tr>
              <tr className="bg-green-100 font-bold text-green-900">
                <td className="text-right py-1 pr-2">TOTAL:</td>
                <td className="text-right">
                  {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 mb-5">
          <span className="font-semibold">Valor en Letras: </span>
          {numeroALetras(subtotal)}
        </div>

        {/* Observaciones */}
        <div className="observaciones">
          <div className="font-semibold mb-1">Observaciones:</div>
          <div>{observaciones || 'Ninguna'}</div>
        </div>

        {/* Representante y condiciones */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm">
          <div>
            <div className="font-semibold">Representante de ventas:</div>
            <div>{user?.nombre || 'No disponible'}</div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div>Tipo de pago: Crédito</div>
            <div>Medio de pago: Transferencia</div>
            <div>Vencimiento: {fechaVencimiento.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Botones para guardar y para imprimir */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={guardarCotizacion}
          disabled={guardando}
          className="bg-green-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-900 disabled:bg-gray-400"
        >
          {guardando ? 'Guardando...' : 'Guardar Cotización'}
        </button>

        <button
          onClick={handlePrint}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-800"
          title="Imprimir o guardar como PDF"
          type="button"
        >
          Imprimir / Descargar PDF
        </button>
      </div>

      {/* Mensajes */}
      {mensaje && mensaje !== '✅ Cotización guardada correctamente' && (
        <div className="mt-4 text-center text-sm text-red-700">{mensaje}</div>
      )}

      {mensaje === '✅ Cotización guardada correctamente' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <svg className="mx-auto mb-4 w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="mb-4 font-semibold text-lg">Cotización guardada con éxito</p>
            <button
              onClick={() => {
                setMensaje('');
                if (typeof onCotizacionGuardada === 'function') onCotizacionGuardada();
              }}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Nueva Cotización
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Cotizacion.propTypes = {
  cliente: PropTypes.object.isRequired,
  productos: PropTypes.array.isRequired,
  observaciones: PropTypes.string,
  onCotizacionGuardada: PropTypes.func,
};

export default Cotizacion;
