import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import axios from 'axios';

const Modal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ExistenciasUploader = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Funciones auxiliares para parseo
  const parseDate = (value) => {
    if (!value) return null;
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (!date) return null;
      const jsDate = new Date(date.y, date.m - 1, date.d);
      return jsDate.toISOString().slice(0, 10);
    }
    const d = new Date(value);
    if (isNaN(d)) return null;
    return d.toISOString().slice(0, 10);
  };

  const parseInteger = (value) => {
    if (value === null || value === undefined) return null;
    const n = parseInt(value, 10);
    return isNaN(n) ? null : n;
  };

  const parseFloatNumber = (value) => {
    if (value === null || value === undefined) return null;
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
  };

  // Mapea cada fila del Excel a la estructura que espera la API
  const mapExcelRowToApi = (row) => ({
    bodega: (row['Bodega'] ?? '').toString().trim(),
    descBodega: (row['Desc. bodega'] ?? '').toString().trim(),
    item: parseInteger(row['Item']),
    listaPrecio: (row['Lista de precio'] ?? '').toString().trim(),
    referencia: parseInteger(row['Referencia']),
    notasItem: (row['Notas ítem'] ?? '').toString().trim(),
    ubicacion: parseInteger(row['Ubicación']),
    lote: (row['Lote'] ?? '').toString().trim(),
    fechaLote: parseDate(row['Fecha lote']),
    unidadMedida: (row['U.M.'] ?? '').toString().trim(),
    existencia: parseInteger(row['Existencia']),
    grupos: (row['GRUPOS'] ?? '').toString().trim(),
    lineas: (row['LINEAS'] ?? '').toString().trim(),
    cantDisponible: parseInteger(row['Cant. disponible']),
    factorUMOrden: parseInteger(row['Factor U.M. Orden']),
    cantDisponibleOrd: parseInteger(row['Cant. disponible ord.']),
    precioUnitario: parseFloatNumber(row['Precio unitario']),
    precioOrdenFactor: parseFloatNumber(row['Precio orden factor']),
    precioMinimo: parseFloatNumber(row['Precio mínimo']),
    precioMaximo: parseFloatNumber(row['Precio máximo']),
  });

  // Maneja selección de archivo
  const handleFileChange = (event) => {
    setErrors([]);
    setSuccessMessage('');
    const file = event.target.files[0];
    if (file) {
      setFileToUpload(file);
      setShowUploadModal(true);
    }
  };

  // Confirma y procesa la carga
  const handleConfirmUpload = async () => {
    if (!fileToUpload) return;
    setShowUploadModal(false);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        setLoading(true);
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        const mappedData = jsonData.map(mapExcelRowToApi);

        // Validación simple para campos obligatorios
        const invalidRows = mappedData.filter(
          (row) =>
            !row.bodega ||
            !row.descBodega ||
            row.item === null ||
            !row.listaPrecio ||
            row.referencia === null ||
            !row.notasItem ||
            row.ubicacion === null ||
            !row.lote ||
            !row.unidadMedida ||
            row.existencia === null ||
            !row.grupos ||
            !row.lineas ||
            row.cantDisponible === null ||
            row.factorUMOrden === null ||
            row.cantDisponibleOrd === null ||
            row.precioUnitario === null ||
            row.precioOrdenFactor === null ||
            row.precioMinimo === null ||
            row.precioMaximo === null
        );

        if (invalidRows.length > 0) {
          setErrors(['Algunas filas tienen campos inválidos o vacíos. Por favor revisa los datos.']);
          setLoading(false);
          return;
        }

        // Envía datos al backend (ajusta la URL si es necesario)
        await axios.post('http://localhost:3000/existencias/bulk', mappedData);
        setSuccessMessage('✅ Datos importados correctamente');
      } catch (error) {
        setErrors([
          '❌ Error al importar datos: ' +
            (error.response?.data?.message || error.message || 'Error desconocido'),
        ]);
      } finally {
        setLoading(false);
        setFileToUpload(null);
      }
    };

    reader.readAsArrayBuffer(fileToUpload);
  };

  // Cancela la carga
  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setFileToUpload(null);
  };

  // Muestra modal para confirmar eliminación total
  const handleDeleteClick = () => {
    setErrors([]);
    setSuccessMessage('');
    setShowDeleteModal(true);
  };

  // Confirma eliminación total
  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      setLoading(true);
      await axios.delete('http://localhost:3000/existencias');
      setSuccessMessage('🗑 Base de datos limpiada con éxito');
    } catch (err) {
      setErrors(['❌ Error al limpiar la base de datos: ' + (err.message || 'Error desconocido')]);
    } finally {
      setLoading(false);
    }
  };

  // Cancela eliminación
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">📦 Gestión de Existencias</h2>

      <div>
        <label htmlFor="file-upload" className="block text-gray-700 font-medium mb-2">
          Subir archivo Excel (.xlsx / .xls)
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={loading}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <button
          onClick={handleDeleteClick}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-60"
        >
          🗑 Limpiar Base de Datos
        </button>
      </div>

      {loading && <p className="text-center text-sm text-gray-500 italic">Procesando...</p>}

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <ul className="list-disc list-inside">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {/* Modal para confirmar subida */}
      {showUploadModal && (
        <Modal
          title="Confirmar subida"
          message={`¿Estás seguro que deseas subir el archivo "${fileToUpload?.name}"?`}
          onConfirm={handleConfirmUpload}
          onCancel={handleCancelUpload}
        />
      )}

      {/* Modal para confirmar eliminación */}
      {showDeleteModal && (
        <Modal
          title="Confirmar eliminación"
          message="¿Estás seguro que deseas eliminar todas las existencias? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ExistenciasUploader;


