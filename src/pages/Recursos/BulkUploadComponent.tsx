import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface RecursoInput {
  codigo: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  presupuesto: boolean;
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
}

const BulkUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const parseExcelDate = (excelDate: number): string => {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const data = await file.arrayBuffer();
      
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      console.log(jsonData)
      const recursos: RecursoInput[] = jsonData.map((item, index) => {
        // Validación básica
        if (!item['codigo'] || !item['nombre'] || !item['fecha']) {
          throw new Error(`Faltan datos requeridos en la fila ${index + 2}`);
        }

        return {
          codigo: item['codigo'],
          nombre: item['nombre'],
          descripcion: item['descripcion'],
          fecha: typeof item['fecha'] === 'number' ? parseExcelDate(item['fecha']) : item['fecha'],
          cantidad: Number(item['cantidad']),
          unidad_id: item['unidad_id'],
          precio_actual: Number(item['precio_actual']),
          presupuesto: item['presupuesto'] === 'true' || item['presupuesto'] === true,
          tipo_recurso_id: item['tipo_recurso_id'],
          clasificacion_recurso_id: item['clasificacion_recurso_id'],
        };
      });

      const mutation = `
        mutation BulkCreateRecursos($recursos: [RecursoInput!]!) {
          bulkCreateRecursos(recursos: $recursos) {
            success
            message
            createdCount
            errors
          }
        }
      `;

      const response = await fetch('https://inacons-30db36fa833f.herokuapp.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Añadir encabezados adicionales si es necesario
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            recursos,
          },
        }),
      });

      const result = await response.json();

      if (result.data.bulkCreateRecursos.success) {
        setMessage('Datos cargados exitosamente.');
      } else {
        setMessage('Error al cargar datos: ' + result.data.bulkCreateRecursos.message);
      }
    } catch (error: any) {
      console.error(error);
      setMessage('Ocurrió un error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Archivo'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BulkUploadComponent;