import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import LOGO_URL from './assets/Bc.png'; // Asegúrate de que esta ruta sea accesible

const DocumentoCotizacion = forwardRef(
  (
    {
      numeroDocumento,
      fechaDocumento,
      cliente = {},
      productos = [],
      observaciones = '',
      representante,
      fechaVencimiento,
      subtotal,
      valorLetras,
    },
    ref
  ) => (
    <div
      ref={ref}
      className="print-document"
      style={{
        background: '#fff',
        color: '#222',
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        padding: '32px 24px',
        maxWidth: '820px',
        margin: '0 auto',
        borderRadius: '10px',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={LOGO_URL} // Usar el mismo LOGO_URL
            alt="Logo"
            style={{
              height: '80px',
              marginRight: '18px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              background: '#f8f8f8',
              padding: '4px',
            }}
          />
          <div style={{ fontSize: '12px', lineHeight: '1.5', color: '#222' }}>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#0c5231', marginBottom: '2px' }}>
              SAN MIGUEL GROUP SAS
            </div>
            <div style={{ textAlign: 'left' }}>NIT 901757169-3 - RESPONSABLE DE IVA</div>
            <div style={{ textAlign: 'left' }}>Actividad Económica 4773</div>
            <div style={{ textAlign: 'left' }}>Bodega Ventas Punto</div>
            <div style={{ textAlign: 'left' }}>notificaciones@smgroupsas.com.co | 310 5164909</div>
            <div style={{ textAlign: 'left' }}>Calle 17 No 19-46, SAN MIGUEL</div>
          </div>
        </div>
        <div
          style={{
            border: '2px solid #0c5231',
            borderRadius: '8px',
            padding: '12px 18px',
            textAlign: 'center',
            fontSize: '13px',
            minWidth: '180px',
            background: '#f6fff9',
            boxShadow: '0 1px 4px 0 rgba(12,82,49,0.07)',
          }}
        >
          <div style={{ fontWeight: 'bold', color: '#0c5231', fontSize: '16px', marginBottom: '4px' }}>
            COTIZACIÓN N° {numeroDocumento}
          </div>
          <div style={{ color: '#444' }}>Fecha: {fechaDocumento}</div>
        </div>
      </div>

      {/* Cliente */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '18px',
          fontSize: '12px',
          background: '#f8f8f8',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <tbody>
          <tr>
            <th
              style={{
                border: '1px solid #d0d0d0',
                padding: '6px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                background: '#e9f7ef',
                width: '90px',
              }}
            >
              Señores
            </th>
            <td style={{ border: '1px solid #d0d0d0', padding: '6px 8px' }}>{cliente.nombre}</td>
            <th
              style={{
                border: '1px solid #d0d0d0',
                padding: '6px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                background: '#e9f7ef',
                width: '60px',
              }}
            >
              NIT
            </th>
            <td style={{ border: '1px solid #d0d0d0', padding: '6px 8px' }}>{cliente.nit}</td>
            <th
              style={{
                border: '1px solid #d0d0d0',
                padding: '6px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                background: '#e9f7ef',
                width: '120px',
              }}
              colSpan="2"
            >
              FECHA DE VENCIMIENTO
            </th>
            <td style={{ border: '1px solid #d0d0d0', padding: '6px 8px', textAlign: 'center' }}>
              {fechaVencimiento}
            </td>
          </tr>
          <tr>
            <th
              style={{
                border: '1px solid #d0d0d0',
                padding: '6px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                background: '#e9f7ef',
              }}
            >
              Dirección
            </th>
            <td style={{ border: '1px solid #d0d0d0', padding: '6px 8px' }}>{cliente.direccion}</td>
            <th
              style={{
                border: '1px solid #d0d0d0',
                padding: '6px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                background: '#e9f7ef',
              }}
            >
              Teléfono
            </th>
            <td style={{ border: '1px solid #d0d0d0', padding: '6px 8px' }}>{cliente.telefono}</td>
            <th
              style={{
                border: '1px solid #d0d0d0',
                padding: '6px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                background: '#e9f7ef',
              }}
              colSpan="2"
            >
              Ciudad
            </th>
            <td style={{ border: '1px solid #d0d0d0', padding: '6px 8px', textAlign: 'center' }}>
              {cliente.ciudad}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Productos */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '24px',
          fontSize: '12px',
          background: '#fff',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 1px 4px 0 rgba(12,82,49,0.04)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#0c5231', color: 'white' }}>
            <th style={{ border: '1px solid #0c5231', padding: '7px', width: '32px' }}>No</th>
            <th style={{ border: '1px solid #0c5231', padding: '7px', width: '48px' }}>ITEM</th>
            <th style={{ border: '1px solid #0c5231', padding: '7px' }}>DESCRIPCIÓN</th>
            <th style={{ border: '1px solid #0c5231', padding: '7px', width: '60px' }}>CANT.</th>
            <th style={{ border: '1px solid #0c5231', padding: '7px', width: '70px' }}>LOTE</th>
            <th style={{ border: '1px solid #0c5231', padding: '7px', width: '90px' }}>FECHA VCTO</th>
            <th style={{ border: '1px solid #0c5231', padding: '7px', width: '90px' }}>VR. UNIT</th>
            <th style={{ border: '1px solid #0c5231', padding: '7px', width: '100px' }}>VR. TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item, idx) => (
            <tr
              key={idx}
              style={{
                background: idx % 2 === 0 ? '#f6fff9' : '#fff',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'center' }}>{item.item}</td>
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'left' }}>{item.descripcion}</td>
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'center' }}>{item.cantidad}</td>
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'center' }}>{item.lote || ''}</td>
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'center' }}>{item.fechaVcto || ''}</td>
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'right' }}>{item.precioUnitario}</td>
              <td style={{ border: '1px solid #e0e0e0', padding: '7px', textAlign: 'right' }}>{item.precioTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px' }}>
        <table
          style={{
            width: '340px',
            borderCollapse: 'collapse',
            fontSize: '13px',
            background: '#f8f8f8',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 1px 4px 0 rgba(12,82,49,0.04)',
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: '7px', textAlign: 'right', fontWeight: 'bold', color: '#0c5231' }}>Concepto</td>
              <td style={{ padding: '7px', textAlign: 'right', fontWeight: 'bold', color: '#0c5231' }}>Valor</td>
            </tr>
            <tr>
              <td style={{ padding: '7px', textAlign: 'right' }}>Subtotal:</td>
              <td style={{ padding: '7px', textAlign: 'right' }}>{subtotal}</td>
            </tr>
            <tr style={{ backgroundColor: '#d1f1c2' }}>
              <td style={{ padding: '7px', textAlign: 'right', fontWeight: 'bold', color: '#0c5231' }}>TOTAL:</td>
              <td style={{ padding: '7px', textAlign: 'right', fontWeight: 'bold', color: '#0c5231' }}>{subtotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginBottom: '14px',
          fontSize: '13px',
          background: '#e9f7ef',
          borderRadius: '6px',
          padding: '8px 14px',
          color: '#0c5231',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Valor en Letras: </span>
        {valorLetras}
      </div>

      <div
        style={{
          marginBottom: '18px',
          fontSize: '13px',
          background: '#f8f8f8',
          borderRadius: '6px',
          padding: '10px 14px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#0c5231' }}>Observaciones:</div>
        <div>{observaciones}</div>
        {cliente.nombre && (
          <div style={{ marginTop: '7px', color: '#444' }}>
            <span style={{ fontWeight: 'bold' }}>Cliente:</span> {cliente.nombre}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '36px',
          paddingTop: '14px',
          borderTop: '2px solid #e0e0e0',
          fontSize: '12px',
        }}
      >
        <div>
          <div style={{ fontWeight: 'bold', color: '#0c5231', marginBottom: '2px' }}>Representante de ventas:</div>
          <div>{representante}</div>
        </div>
        <div style={{ textAlign: 'right', color: '#555' }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>Tipo de pago:</span> Crédito
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>Medio de pago:</span> Transferencia
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>Vencimiento:</span> {fechaVencimiento}
          </div>
        </div>
      </div>
    </div>
  )
);

DocumentoCotizacion.propTypes = {
  numeroDocumento: PropTypes.string,
  fechaDocumento: PropTypes.string,
  cliente: PropTypes.object,
  productos: PropTypes.array,
  observaciones: PropTypes.string,
  representante: PropTypes.string,
  fechaVencimiento: PropTypes.string,
  subtotal: PropTypes.string,
  valorLetras: PropTypes.string,
};

export default DocumentoCotizacion;
