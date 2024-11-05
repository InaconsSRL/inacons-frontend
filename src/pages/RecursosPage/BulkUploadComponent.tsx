import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { FiCheckCircle, FiUploadCloud, FiX } from 'react-icons/fi';

interface RecursoInput {
  codigo: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  tipo_recurso_id: string;
  tipo_costo_recurso_id: string;
  clasificacion_recurso_id: string;
}

interface ExcelRow {
  [key: string]: string | number | boolean;
}

interface BulkCreateResponse {
  success: boolean;
  message: string;
  createdCount: number;
  errors: string[];
}

const BulkUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

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

  // Función auxiliar para dividir array en lotes
  const chunkArray = (array: RecursoInput[], size: number): RecursoInput[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  // Función para procesar un lote individual
  const processBatch = async (
    batch: RecursoInput[],
    mutation: string
  ): Promise<BulkCreateResponse> => {
    const response = await fetch('https://inacons-30db36fa833fs.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          recursos: batch,
        },
      }),
    });

    const result = await response.json();
    return result.data.bulkCreateRecursos;
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setProgress(0);

    try {
      const data = await file.arrayBuffer();
      
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const recursos: RecursoInput[] = jsonData.map((item, index) => {
        if (!item['codigo'] || !item['nombre'] || !item['fecha']) {
          throw new Error(`Faltan datos requeridos en la fila ${index + 2}`);
        }

        return {
          codigo: String(item['codigo']),
          nombre: String(item['nombre']),
          descripcion: String(item['descripcion']),
          fecha: typeof item['fecha'] === 'number' ? parseExcelDate(item['fecha']) : String(item['fecha']),
          cantidad: Number(item['cantidad']),
          unidad_id: String(item['unidad_id']),
          precio_actual: Number(item['precio_actual']),
          tipo_recurso_id: String(item['tipo_recurso_id']),
          tipo_costo_recurso_id: String(item['tipo_costo_recurso_id']),
          clasificacion_recurso_id: String(item['clasificacion_recurso_id']),
        };
      });

      const batches = chunkArray(recursos, 30);
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

      let totalCreated = 0;
      let totalErrors: string[] = [];

      for (let i = 0; i < batches.length; i++) {
        const result = await processBatch(batches[i], mutation);
        
        if (result.success) {
          totalCreated += result.createdCount;
        } else {
          totalErrors = [...totalErrors, ...result.errors];
        }

        // Actualizar el progreso
        const progress = Math.round(((i + 1) / batches.length) * 100);
        setProgress(progress);
      }

      if (totalErrors.length === 0) {
        setMessage(`Datos cargados exitosamente. ${totalCreated} recursos creados.`);
      } else {
        setMessage(`Carga parcial. ${totalCreated} recursos creados. ${totalErrors.length} errores encontrados.`);
      }

    } catch (error) {
      console.error(error);
      setMessage('Ocurrió un error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Carga Masiva de Recursos</h2>
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-1">Arrastra y suelta tu archivo aquí, o</p>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx, .xls"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          Selecciona un archivo
        </label>
        {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
      </div>
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {loading ? 'Cargando...' : 'Cargar Archivo'}
      </button>
      {loading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.includes('Error') || message.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.includes('Error') || message.includes('error') ? (
            <FiX className="h-5 w-5 inline mr-2" />
          ) : (
            <FiCheckCircle className="h-5 w-5 inline mr-2" />
          )}
          {message}
        </div>
      )}
    </div>
  );
};

export default BulkUploadComponent;