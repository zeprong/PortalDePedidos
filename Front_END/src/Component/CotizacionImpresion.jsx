import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import numeroALetras, { limpiarNumero } from '../config/numeroALetras';
import LOGO_URL from '../assets/Bc.png';

const CotizacionImpresion = forwardRef(({ cliente, productos, observaciones, proximoNumero, fechaFactura, fechaVencimiento }, ref) => {
  const subtotal = productos.reduce(
    (acc, item) => acc + limpiarNumero(item.precio) * item.cantidad,
    0
  );

  return (
    <div ref={ref} style={{ padding: 20, backgroundColor: 'white', color: 'black', fontFamily: 'sans-serif', fontSize: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={LOGO_URL} alt="Logo" style={{ height: 80, marginRight: 20 }} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>SAN MIGUEL GROUP SAS</div>
            <div>NIT 901757169-3 - RESPONSABLE DE IVA</div>
            <div>Actividad Económica 4773</div>
            <div>Bodega Ventas Punto</div>
            <div>notificaciones@smgroupsas.com.co | 310 5164909</div>
            <div>Calle 17 No 19-46, SAN MIGUEL</div>
          </div>
        </div>
        <div style={{ border: '1px solid black', padding: 10, textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>
            {proximoNumero ? `COTIZACIÓN N° ${String(proximoNumero).padStart(4, '0')}` : 'Cargando número...'}
          </div>
          <div>Fecha: {fechaFactura.toLocaleDateString('es-CO')}</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: 4, textAlign: 'left' }}>Señores</th>
            <th style={{ border: '1px solid black', padding: 4, textAlign: 'left' }}>{cliente.nombreApellidos || cliente.nombre || cliente.razonSocial}</th>
            <th style={{ border: '1px solid black', padding: 4, textAlign: 'left' }}>NIT</th>
            <th style={{ border: '1px solid black', padding: 4, textAlign: 'left' }}>{cliente.cliente}</th>
            <th style={{ border: '1px solid black', padding: 4, textAlign: 'center' }} colSpan={3}>FECHA DE VENCIMIENTO</th>
            <th style={{ border: '1px solid black', padding: 4, textAlign: 'center' }}>{fechaVencimiento.toLocaleDateString('es-CO')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: 4, fontWeight: 'bold' }}>Dirección</td>
            <td style={{ border: '1px solid black', padding: 4 }}>{cliente.direccion}</td>
            <td style={{ border: '1px solid black', padding: 4, fontWeight: 'bold' }}>Teléfono</td>
            <td style={{ border: '1px solid black', padding: 4 }}>{cliente.telefono}</td>
            <td style={{ border: '1px solid black', padding: 4, fontWeight: 'bold' }} colSpan={3}>Ciudad</td>
            <td style={{ border: '1px solid black', padding: 4 }}>{cliente.ciudad}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#006400', color: 'white' }}>
          <tr>
            <th style={{ border: '1px solid black', padding: 6 }}>No</th>
            <th style={{ border: '1px solid black', padding: 6 }}>ITEM</th>
            <th style={{ border: '1px solid black', padding: 6 }}>DESCRIPCIÓN</th>
            <th style={{ border: '1px solid black', padding: 6 }}>CANT.</th>
            <th style={{ border: '1px solid black', padding: 6 }}>LOTE</th>
            <th style={{ border: '1px solid black', padding: 6 }}>FECHA VCTO</th>
            <th style={{ border: '1px solid black', padding: 6 }}>VR. UNIT</th>
            <th style={{ border: '1px solid black', padding: 6 }}>VR. TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: 10, color: '#666' }}>Sin productos</td>
            </tr>
          ) : (
            productos.map((item, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ border: '1px solid black', padding: 6, textAlign: 'center' }}>{idx + 1}</td>
                <td style={{ border: '1px solid black', padding: 6, textAlign: 'center' }}>{item.item ?? item.codigo ?? '-'}</td>
                <td style={{ border: '1px solid black', padding: 6 }}>{item.descripcion}</td>
                <td style={{ border: '1px solid black', padding: 6, textAlign: 'center' }}>{item.cantidad}</td>
                <td style={{ border: '1px solid black', padding: 6, textAlign: 'center' }}>{item.lote || '-'}</td>
                <td style={{ border: '1px solid black', padding: 6, textAlign: 'center' }}>{item.fechaVcto || '-'}</td>
                <td style={{ border: '1px solid black', padding: 6, textAlign: 'right' }}>
                  {limpiarNumero(item.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </td>
                <td style={{ border: '1px solid black', padding: 6, textAlign: 'right', fontWeight: 'bold' }}>
                  {(limpiarNumero(item.precio) * item.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <table style={{ width: '50%', fontSize: 14 }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 10 }}>Subtotal:</td>
              <td style={{ textAlign: 'right' }}>
                {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#e0ffe0', fontWeight: 'bold', color: '#006400' }}>
              <td style={{ textAlign: 'right', paddingRight: 10 }}>TOTAL:</td>
              <td style={{ textAlign: 'right' }}>
                {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        Valor en Letras: {numeroALetras(subtotal)}
      </div>

      <div style={{ marginTop: 20 }}>
        <b>Observaciones:</b>
        <div>{observaciones || 'Ninguna'}</div>
      </div>
    </div>
  );
});

CotizacionImpresion.displayName = 'CotizacionImpresion';

CotizacionImpresion.propTypes = {
  cliente: PropTypes.object.isRequired,
  productos: PropTypes.array.isRequired,
  observaciones: PropTypes.string,
  proximoNumero: PropTypes.number,
  fechaFactura: PropTypes.instanceOf(Date),
  fechaVencimiento: PropTypes.instanceOf(Date),
};

export default CotizacionImpresion;
