import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import DocumentoCotizacion from './DocumentoCotizacion'; // Asegúrate de que esta ruta sea correcta

// Datos de ejemplo para la cotización (simulando los props que vendrían de un componente padre o un estado)
const datosCotizacionEjemplo = {
  numeroDocumento: '0001',
  fechaDocumento: new Date().toLocaleDateString('es-CO'),
  cliente: {
    nombre: 'Cliente de Ejemplo S.A.S',
    nit: '900.123.456-7',
    direccion: 'Calle Ficticia # 123-45',
    telefono: '300-1234567',
    ciudad: 'Bogotá D.C.',
  },
  productos: [
    {
      item: 'PROD001',
      descripcion: 'Producto A de alta calidad',
      cantidad: 2,
      lote: 'LOTE123',
      fechaVcto: '31/12/2025',
      precioUnitario: '$ 150.000,00',
      precioTotal: '$ 300.000,00',
    },
    {
      item: 'PROD002',
      descripcion: 'Servicio de consultoría especializada',
      cantidad: 1,
      lote: '',
      fechaVcto: '',
      precioUnitario: '$ 500.000,00',
      precioTotal: '$ 500.000,00',
    },
    {
      item: 'PROD003',
      descripcion: 'Licencia de software anual',
      cantidad: 3,
      lote: 'N/A',
      fechaVcto: '31/03/2026',
      precioUnitario: '$ 100.000,00',
      precioTotal: '$ 300.000,00',
    },
  ],
  observaciones: 'Esta es una cotización de prueba generada automáticamente. Los precios están sujetos a cambios y válidos por 7 días hábiles.',
  representante: 'Juan Pérez',
  fechaVencimiento: new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('es-CO'),
  subtotal: '$ 1.100.000,00',
  valorLetras: 'UN MILLÓN CIEN MIL PESOS M/CTE',
};

const CotizacionImprimible = () => {
  const printRef = useRef();
  const [generandoPDF, setGenerandoPDF] = useState(false);

  // Ajusta el documento antes de generar el PDF
  const ajustarDocumento = () => {
    // Aquí puedes realizar cualquier ajuste necesario al documento antes de exportar.
    // Por ejemplo, podrías modificar estilos, agregar marcas de agua, etc.
    if (printRef.current) {
      printRef.current.style.backgroundColor = '#fff';
    }
  };

  const restaurarDocumento = () => {
    // Restaura cualquier cambio realizado en ajustarDocumento
    if (printRef.current) {
      printRef.current.style.backgroundColor = '';
    }
  };

  const handleDescargarPDF = () => {
    if (!printRef.current) return;

    setGenerandoPDF(true);

    ajustarDocumento();

    const opt = {
      margin: [10, 10, 10, 10], // Ajusta los márgenes para mejor presentación
      filename: `Cotizacion_${datosCotizacionEjemplo.numeroDocumento}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#fff', // Asegura fondo blanco
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf()
      .from(printRef.current)
      .set(opt)
      .save()
      .then(() => {
        restaurarDocumento();
        setGenerandoPDF(false);
      })
      .catch((err) => {
        console.error('Error al generar PDF:', err);
        restaurarDocumento();
        setGenerandoPDF(false);
      });
  };

  return (
    <div>
      <div style={{ padding: '20px', background: '#f9f9f9' }}>
        <div ref={printRef}>
          <DocumentoCotizacion {...datosCotizacionEjemplo} />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0', padding: '10px' }}>
        <button
          onClick={handleDescargarPDF}
          disabled={generandoPDF}
          style={{
            padding: '12px 24px',
            backgroundColor: '#0c5231',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: generandoPDF ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {generandoPDF ? 'Generando PDF...' : 'Descargar Cotización PDF'}
        </button>
      </div>
    </div>
  );
};

export default CotizacionImprimible;
