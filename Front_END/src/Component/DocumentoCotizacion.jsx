import React, { forwardRef } from 'react';

const DocumentoCotizacion = forwardRef(({ 
  numeroDocumento, 
  fechaDocumento, 
  cliente, 
  productos, 
  observaciones, 
  representante,
  fechaVencimiento,
  subtotal,
  valorLetras
}, ref) => (
  <div ref={ref} className="print-document" style={{ 
    background: '#fff', 
    color: '#000', 
    fontSize: '12px', 
    fontFamily: 'Arial, sans-serif', 
    padding: '20px', 
    maxWidth: '800px', 
    margin: '0 auto' 
  }}>
    {/* Encabezado */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo-bucanero.png" alt="Logo" style={{ height: '80px', marginRight: '15px' }} />
        <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>SAN MIGUEL GROUP SAS</div>
          <div style={{ textAlign: 'center' }}>NIT 901757169-3 - RESPONSABLE DE IVA</div>
          <div style={{ textAlign: 'center' }}>Actividad Económica 4773</div>
          <div style={{ textAlign: 'center' }}>Bodega Ventas Punto</div>
          <div style={{ textAlign: 'center' }}>notificaciones@smgroupsas.com.co | 310 5164909</div>
          <div style={{ textAlign: 'center' }}>Calle 17 No 19-46, SAN MIGUEL</div>
        </div>
      </div>
      <div style={{ 
        border: '1px solid #000', 
        padding: '8px', 
        textAlign: 'center', 
        fontSize: '11px',
        width: '180px'
      }}>
        <div style={{ fontWeight: 'bold' }}>COTIZACIÓN N° {numeroDocumento}</div>
        <div>Fecha: {fechaDocumento}</div>
      </div>
    </div>

    {/* Cliente */}
    <table style={{ 
      width: '100%', 
      borderCollapse: 'collapse', 
      marginBottom: '15px',
      fontSize: '11px'
    }}>
      <tbody>
        <tr>
          <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Señores</th>
          <td style={{ border: '1px solid #000', padding: '4px' }}>{cliente.nombre}</td>
          <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>NIT</th>
          <td style={{ border: '1px solid #000', padding: '4px' }}>{cliente.nit}</td>
          <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontWeight: 'bold' }} colSpan="2">FECHA DE VENCIMIENTO</th>
          <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{fechaVencimiento}</td>
        </tr>
        <tr>
          <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Dirección</th>
          <td style={{ border: '1px solid #000', padding: '4px' }}>{cliente.direccion}</td>
          <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Teléfono</th>
          <td style={{ border: '1px solid #000', padding: '4px' }}>{cliente.telefono}</td>
          <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontWeight: 'bold' }} colSpan="2">Ciudad</th>
          <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{cliente.ciudad}</td>
        </tr>
      </tbody>
    </table>

    {/* Productos */}
    <table style={{ 
      width: '100%', 
      borderCollapse: 'collapse', 
      marginBottom: '20px',
      fontSize: '11px'
    }}>
      <thead>
        <tr style={{ backgroundColor: '#0c5231', color: 'white' }}>
          <th style={{ border: '1px solid #000', padding: '6px', width: '30px' }}>No</th>
          <th style={{ border: '1px solid #000', padding: '6px', width: '40px' }}>ITEM</th>
          <th style={{ border: '1px solid #000', padding: '6px' }}>DESCRIPCIÓN</th>
          <th style={{ border: '1px solid #000', padding: '6px', width: '50px' }}>CANT.</th>
          <th style={{ border: '1px solid #000', padding: '6px', width: '60px' }}>LOTE</th>
          <th style={{ border: '1px solid #000', padding: '6px', width: '80px' }}>FECHA VCTO</th>
          <th style={{ border: '1px solid #000', padding: '6px', width: '80px' }}>VR. UNIT</th>
          <th style={{ border: '1px solid #000', padding: '6px', width: '80px' }}>VR. TOTAL</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((item, idx) => (
          <tr key={idx}>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{idx + 1}</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.item}</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>{item.descripcion}</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.cantidad}</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.lote || ''}</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.fechaVcto || ''}</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{item.precioUnitario}</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{item.precioTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Totales */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
      <table style={{ width: '300px', borderCollapse: 'collapse', fontSize: '12px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '4px', textAlign: 'right' }}>Concepto</td>
            <td style={{ padding: '4px', textAlign: 'right' }}>Valor</td>
          </tr>
          <tr>
            <td style={{ padding: '4px', textAlign: 'right' }}>Subtotal:</td>
            <td style={{ padding: '4px', textAlign: 'right' }}>{subtotal}</td>
          </tr>
          <tr style={{ backgroundColor: '#d1f1c2' }}>
            <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>TOTAL:</td>
            <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{subtotal}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style={{ marginBottom: '10px', fontSize: '12px' }}>
      <span style={{ fontWeight: 'bold' }}>Valor en Letras: </span>
      {valorLetras}
    </div>

    <div style={{ marginBottom: '15px', fontSize: '12px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Observaciones:</div>
      <div>{observaciones}</div>
      {cliente.nombre && <div style={{ marginTop: '5px' }}>Cliente: {cliente.nombre}</div>}
    </div>

    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginTop: '30px', 
      paddingTop: '10px', 
      borderTop: '1px solid #ddd',
      fontSize: '11px'
    }}>
      <div>
        <div style={{ fontWeight: 'bold' }}>Representante de ventas:</div>
        <div>{representante}</div>
      </div>
      <div style={{ textAlign: 'right', color: '#555' }}>
        <div>Tipo de pago: Crédito</div>
        <div>Medio de pago: Transferencia</div>
        <div>Vencimiento: {fechaVencimiento}</div>
      </div>
    </div>
  </div>
));

export default DocumentoCotizacion;

