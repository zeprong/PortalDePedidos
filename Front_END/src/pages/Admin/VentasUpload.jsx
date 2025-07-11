import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {
  FileUp, UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle, HelpCircle
} from 'lucide-react';

function formatFecha(valor) {
  if (typeof valor === 'number') {
    const date = new Date((valor - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  if (typeof valor === 'string') {
    const partes = valor.split(/[/-]/);
    if (partes.length === 3) {
      const [dia, mes, anio] = partes;
      const fechaISO = new Date(`${anio}-${mes}-${dia}`);
      if (!isNaN(fechaISO)) return fechaISO.toISOString().split('T')[0];
    }
    const d = new Date(valor);
    if (!isNaN(d)) return d.toISOString().split('T')[0];
  }
  return null;
}

function parseDecimal(valor) {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') {
    const convertido = parseFloat(valor.replace(',', '.'));
    return isNaN(convertido) ? null : convertido;
  }
  return null;
}

const mapearCampos = (item) => ({
  descTipoDocto: item['Desc tipo docto'] || null,
  tipoDocto: item['Tipo docto'] || null,
  nroDocumento: item['Nro documento'] || null,
  fechaEntregaItem: item['Fecha entrega ítem'] ? formatFecha(item['Fecha entrega ítem']) : null,
  item: item['Item'] || null,
  notasItem: item['Notas ítem'] || null,
  lote: item['Lote'] || null,
  fecha: item['Fecha'] ? formatFecha(item['Fecha']) : null,
  fechaVctoLote: item['Fecha vcto lote'] ? formatFecha(item['Fecha vcto lote']) : null,
  descBodega: item['Desc bodega'] || null,
  bodega: item['Bodega'] || null,
  cantidadInv: parseDecimal(item['Cantidad inv']),
  cantidad: parseDecimal(item['Cantidad']),
  precioUnit: parseDecimal(item['Precio unit']),
  costoPromedioUniInst: parseDecimal(item['Costo promedio uni inst']),
  costoMp: parseDecimal(item['Costo MP']),
  costoPromedioTotal: parseDecimal(item['Costo promedio total']),
  valorNetoLocal: parseDecimal(item['Valor neto local']),
  razonSocialClienteDespacho: item['Razón social cliente despacho'] || null,
  estado: item['Estado'] || null,
  nombreVendedor: item['Nombre vendedor'] || null,
  idGenerico: item['id generico'] ? parseInt(item['id generico']) : null,
});

const VentasUpload = () => {
  const [datosExcel, setDatosExcel] = useState([]);
  const [consolidado, setConsolidado] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      const datosMapeados = json.map(mapearCampos);
      setDatosExcel(datosMapeados);
    };
    reader.readAsArrayBuffer(file);
  };

  const confirmarSubida = () => {
    if (datosExcel.length === 0) {
      setModalContent({
        title: 'Archivo no seleccionado',
        message: 'Por favor, selecciona un archivo válido para continuar.',
        type: 'error',
      });
      setShowModal(true);
      return;
    }

    setModalContent({
      title: 'Confirmar carga',
      message: `¿Estás seguro de subir ${datosExcel.length} registros a la base de datos? Esta acción no se puede deshacer.`,
      type: 'confirm',
    });
    setShowModal(true);
  };

  const enviarDatos = async () => {
    try {
      await axios.post('http://localhost:3000/ventas/subir', datosExcel);
      setModalContent({
        title: 'Carga exitosa',
        message: `${datosExcel.length} registros guardados correctamente.`,
        type: 'success',
      });
      setDatosExcel([]);
      cargarConsolidado();
    } catch (error) {
      setModalContent({
        title: 'Error al guardar',
        message: error.response?.data?.message || 'Ocurrió un error al guardar los datos.',
        type: 'error',
      });
    } finally {
      setShowModal(true);
    }
  };

  const cargarConsolidado = async () => {
    try {
      const res = await axios.get('http://localhost:3000/ventas');
      const ventas = res.data;

      const consolidadoData = ventas.reduce((acc, venta) => {
        if (!venta.fecha) return acc;
        const fecha = new Date(venta.fecha);
        if (isNaN(fecha)) return acc;

        const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        const valor = venta.valorNetoLocal ?? venta.valor_neto_local ?? 0;
        acc[clave] = (acc[clave] || 0) + Number(valor);
        return acc;
      }, {});

      const consolidadoArray = Object.entries(consolidadoData)
        .map(([mesAnio, total]) => ({ mesAnio, total: Number(total.toFixed(2)) }))
        .sort((a, b) => (a.mesAnio < b.mesAnio ? 1 : -1));

      setConsolidado(consolidadoArray);
    } catch (error) {
      console.error('Error cargando consolidado:', error);
    }
  };

  useEffect(() => {
    cargarConsolidado();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto text-sm text-gray-700 font-sans">

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-md p-6 w-[350px] shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              {modalContent.type === 'error' && <AlertCircle className="text-red-600" />}
              {modalContent.type === 'success' && <CheckCircle className="text-green-600" />}
              {modalContent.type === 'confirm' && <HelpCircle className="text-blue-600" />}
              <h3 className="text-lg font-medium">{modalContent.title}</h3>
            </div>
            <p className="mb-5 text-sm">{modalContent.message}</p>
            {modalContent.type === 'confirm' ? (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="px-3 py-1.5 border text-gray-700 rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    enviarDatos();
                  }}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Confirmar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-700 text-white py-1.5 rounded hover:bg-gray-800"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" /> Carga de Ventas
        </h2>

        <label className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-1.5 rounded cursor-pointer hover:bg-gray-300 transition text-sm">
          <FileUp className="w-4 h-4" />
          Seleccionar archivo
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            hidden
          />
        </label>
      </div>

      {datosExcel.length > 0 && (
        <div className="mb-5 flex justify-end">
          <button
            onClick={confirmarSubida}
            className="bg-blue-700 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-800 flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Subir {datosExcel.length} registros
          </button>
        </div>
      )}

      {/* Consolidado */}
      <h3 className="text-base font-semibold mb-3">Consolidado por Año-Mes</h3>

      {consolidado.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay datos disponibles.</p>
      ) : (
        <div className="border rounded-md overflow-hidden shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-2">Año-Mes</th>
                <th className="px-4 py-2 text-right">Total Neto</th>
              </tr>
            </thead>
            <tbody>
              {consolidado.map(({ mesAnio, total }) => (
                <tr key={mesAnio} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{mesAnio}</td>
                  <td className="px-4 py-2 text-right font-mono text-gray-800">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VentasUpload;
