import React, { useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import LOGO_URL from '../assets/Bc.png';
import { AuthContext } from '../config/AuthContext';
import numeroALetras, { limpiarNumero } from '../config/numeroALetras'; // Ajusta esta ruta según sea necesario

const Cotizacion = ({
  cliente = {},
  productos = [],
  observaciones = '',
  onCotizacionGuardada,
}) => {
  const { user } = useContext(AuthContext);
  const facturaRef = useRef(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [proximoNumero, setProximoNumero] = useState(1);

  // Fecha dinámica
  const fechaFactura = new Date();
  const fechaVencimiento = new Date();
  // Cambiar a una semana (7 días)
  fechaVencimiento.setDate(fechaFactura.getDate() + 7);

  // Obtener el próximo número de cotización desde el backend
  useEffect(() => {
    const fetchProximoNumero = async () => {
      try {
        const res = await axios.get('http://localhost:3000/cotizaciones/proximo');
        if (res.data && typeof res.data.proximo === 'number') {
          setProximoNumero(res.data.proximo);
        }
      } catch (err) {
        console.error('Error al obtener el próximo número de cotización:', err);
        setProximoNumero(1); // Fallback en caso de error
      }
    };
    fetchProximoNumero();
  }, []);

  const subtotal = productos.reduce(
    (acc, item) => acc + limpiarNumero(item.precio) * item.cantidad,
    0
  );

  // Estilos para impresión, PDF y responsividad (se inyectan dinámicamente)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .cotiz-table th, .cotiz-table td { border: 1px solid #000; padding: 4px; font-size: 12px; }
      .cotiz-table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
      .cotiz-table th { background: #14532d; color: #fff; }
      .cotiz-table .encabezado th { background: #fff; color: #222; }
      .cotiz-table .totales td { background: #dcfce7 !important; color: #14532d !important; font-weight: bold; }
      @media print {
        @page { size: A4; margin: 0.2in; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .no-print { display: none !important; }
      }
      /* Responsividad */
      @media (max-width: 900px) {
        .cotiz-container {
          padding: 8px !important;
          max-width: 100vw !important;
        }
        .cotiz-header {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 12px !important;
        }
        .cotiz-header-logo {
          margin-right: 0 !important;
          margin-bottom: 8px !important;
        }
        .cotiz-header-info {
          margin-left: 0 !important;
        }
        .cotiz-table th, .cotiz-table td {
          font-size: 11px !important;
          padding: 2px !important;
        }
      }
      @media (max-width: 600px) {
        .cotiz-container {
          padding: 2px !important;
          font-size: 11px !important;
        }
        .cotiz-header-logo img {
          height: 60px !important;
        }
        .cotiz-table th, .cotiz-table td {
          font-size: 10px !important;
          padding: 1px !important;
        }
        .cotiz-table {
          margin-bottom: 8px !important;
        }
        .cotiz-totales-table {
          width: 100% !important;
        }
      }
      @media (orientation: landscape) and (max-width: 900px) {
        .cotiz-container {
          max-width: 100vw !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleGuardarYDescargar = async () => {
    setGuardando(true);
    setMensaje('');
    try {
      const payload = {
        clienteNombre: cliente.nombreApellidos || cliente.nombre || cliente.razonSocial || '',
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

      if (facturaRef.current) {
        const opt = {
          margin: 0.2,
          filename: `Cotizacion_${String(proximoNumero).padStart(4, '0')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };
        await html2pdf().set(opt).from(facturaRef.current).save();
      }

      // Actualizar consecutivo después de guardar
      try {
        const res = await axios.get('http://localhost:3000/cotizaciones/proximo');
        if (res.data && typeof res.data.proximo === 'number') {
          setProximoNumero(res.data.proximo);
        }
      } catch (err) {
        console.error('Error al actualizar el próximo número de cotización:', err);
      }

      if (onCotizacionGuardada) onCotizacionGuardada();
    } catch (error) {
      console.error('Error al guardar la cotización:', error);
      setMensaje('❌ Error al guardar la cotización');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-4">
      <div
        ref={facturaRef}
        className="cotiz-container"
        style={{
          background: '#fff',
          color: '#222',
          fontSize: 13,
          fontFamily: 'Arial, sans-serif',
          padding: 24,
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {/* Encabezado */}
        <div
          className="cotiz-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div className="cotiz-header-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={LOGO_URL} alt="Logo" style={{ height: 100, marginRight: 16 }} />
            <div
              className="cotiz-header-info"
              style={{ fontSize: 12, lineHeight: 1.3, marginLeft: 100 }}
            >
              <div style={{ fontWeight: 'bold', textAlign: 'center' }}>SAN MIGUEL GROUP SAS</div>
              <div style={{ textAlign: 'center' }}>NIT 901757169-3 - RESPONSABLE DE IVA</div>
              <div style={{ textAlign: 'center' }}>Actividad Económica 4773</div>
              <div style={{ textAlign: 'center' }}>Bodega Ventas Punto</div>
              <div style={{ textAlign: 'center' }}>
                notificaciones@smgroupsas.com.co | 310 5164909
              </div>
              <div style={{ textAlign: 'center' }}>Calle 17 No 19-46, SAN MIGUEL</div>
            </div>
          </div>
          <div
            style={{
              border: '1px solid #bbb',
              padding: 8,
              textAlign: 'center',
              fontSize: 12,
              minWidth: 140,
              marginTop: 8,
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{`COTIZACIÓN N° ${String(
              proximoNumero
            ).padStart(4, '0')}`}</div>
            <div>Fecha: {fechaFactura.toLocaleDateString('es-CO')}</div>
          </div>
        </div>

        {/* Cliente */}
        <table className="cotiz-table" style={{ marginBottom: 8 }}>
          <tbody>
            <tr className="encabezado">
              <th>Señores</th>
              <td>{cliente.nombreApellidos || cliente.nombre || cliente.razonSocial || ''}</td>
              <th>NIT</th>
              <td>{cliente.cliente || ''}</td>
              <th colSpan={2}>FECHA DE VENCIMIENTO</th>
              <td>{fechaVencimiento.toLocaleDateString('es-CO')}</td>
            </tr>
            <tr className="encabezado">
              <th>Dirección</th>
              <td>{cliente.direccion || ''}</td>
              <th>Teléfono</th>
              <td>{cliente.telefono || ''}</td>
              <th colSpan={2}>Ciudad</th>
              <td>{cliente.ciudad || ''}</td>
            </tr>
          </tbody>
        </table>

        {/* Productos */}
        <div style={{ overflowX: 'auto' }}>
          <table className="cotiz-table">
            <thead>
              <tr>
                <th>No</th>
                <th>ITEM</th>
                <th>DESCRIPCIÓN</th>
                <th>CANT.</th>
                <th>LOTE</th>
                <th>FECHA VCTO</th>
                <th>VR. UNIT</th>
                <th>VR. TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#888' }}>
                    Sin productos
                  </td>
                </tr>
              ) : (
                productos.map((item, idx) => (
                  <tr key={item.codigo ?? idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ textAlign: 'center' }}>
                      {String(item.item ?? item.codigo ?? '-')}
                    </td>
                    <td>{item.descripcion}</td>
                    <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
                    <td style={{ textAlign: 'center' }}>{item.lote || '-'}</td>
                    <td style={{ textAlign: 'center' }}>{item.fechaVcto || '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {limpiarNumero(item.precio).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      })}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {(limpiarNumero(item.precio) * item.cantidad).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <table className="cotiz-table cotiz-totales-table" style={{ width: 300, border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'right', border: 'none' }}>Concepto</td>
                <td style={{ textAlign: 'right', border: 'none' }}>Valor</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'right', border: 'none' }}>Subtotal:</td>
                <td style={{ textAlign: 'right', border: 'none' }}>
                  {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </td>
              </tr>
              <tr className="totales">
                <td style={{ textAlign: 'right', border: 'none' }}>TOTAL:</td>
                <td style={{ textAlign: 'right', border: 'none' }}>
                  {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ margin: '16px 0 8px 0', fontWeight: 'bold' }}>
          Valor en Letras: <span style={{ fontWeight: 'normal' }}>{numeroALetras(subtotal)}</span>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 'bold' }}>Observaciones:</div>
          <div>{observaciones || 'Ninguna'}</div>
          {cliente.nombre && <div style={{ marginTop: 5 }}>Cliente: {cliente.nombre}</div>}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 24,
            paddingTop: 8,
            borderTop: '1px solid #ddd',
            fontSize: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Representante de ventas:</div>
            <div>{user?.nombre || 'No disponible'}</div>
          </div>
          <div style={{ textAlign: 'right', color: '#555', marginBottom: 8 }}>
            <div>Tipo de pago: Crédito</div>
            <div>Medio de pago: Transferencia</div>
            <div>Vencimiento: {fechaVencimiento.toLocaleDateString('es-CO')}</div>
          </div>
        </div>
      </div>

      {/* Botón guardar y descargar */}
      <div className="no-print" style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 24 }}>
        <button
          onClick={handleGuardarYDescargar}
          disabled={guardando}
          style={{
            background: '#178c3c',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: guardando ? 'not-allowed' : 'pointer',
          }}
        >
          {guardando ? 'Guardando...' : 'Guardar y Descargar PDF'}
        </button>
      </div>

      {mensaje && (
        <div style={{ marginTop: 24, textAlign: 'center', color: '#b91c1c', fontWeight: 'bold' }}>
          {mensaje}
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
