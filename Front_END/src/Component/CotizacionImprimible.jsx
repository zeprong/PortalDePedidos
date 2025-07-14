import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import DocumentoCotizacion from './DocumentoCotizacion';

const CotizacionImprimible = () => {
  const printRef = useRef();
  const [generandoPDF, setGenerandoPDF] = useState(false);
  
 

  const handleDescargarPDF = () => {
    if (!printRef.current) return;
    
    setGenerandoPDF(true);
    
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Cotizacion_${datosCotizacion.numeroDocumento}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf()
      .from(printRef.current)
      .set(opt)
      .save()
      .then(() => {
        setGenerandoPDF(false);
      })
      .catch(err => {
        console.error('Error al generar PDF:', err);
        setGenerandoPDF(false);
      });
  };

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <DocumentoCotizacion
          ref={printRef}
          {...datosCotizacion}
        />
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
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {generandoPDF ? 'Generando PDF...' : 'Descargar Cotización PDF'}
        </button>
      </div>
    </div>
  );
};

export default CotizacionImprimible;
