import React, { useState, useEffect } from 'react';
import { openDB, DB_NAME } from '../../../db/initDB';
import TableComponent from '../../../components/Tables/TableComponent';
import LoaderPage from '../../../components/Loader/LoaderPage';

interface TableData {
  headers: string[];
  rows: Record<string, string>[];
  filter: boolean[];
}

interface StoreData {
  [key: string]: Record<string, unknown>[];
}

const DatabaseViewer: React.FC = () => {
  const [storeData, setStoreData] = useState<StoreData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>('');

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const db = await openDB();
        const storeNames = Array.from(db.objectStoreNames);
        const data: StoreData = {};

        for (const storeName of storeNames) {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const items = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
              resolve(request.result);
            };
            request.onerror = () => reject(request.error);
          });
          data[storeName] = items;
        }
        setStoreData(data);
        if (storeNames.length > 0) {
          setSelectedStore(storeNames[0]);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const getTableData = (data: Record<string, unknown>[]): TableData => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        headers: [],
        rows: [],
        filter: []
      };
    }

    try {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => {
        const row: Record<string, string> = {};
        headers.forEach(header => {
          // Manejo especial para diferentes tipos de datos
          if (typeof item[header] === 'object' && item[header] !== null) {
            row[header] = JSON.stringify(item[header]);
          } else {
            row[header] = item[header]?.toString() ?? '-';
          }
        });
        return row;
      });
      return {
        headers,
        rows,
        filter: headers.map(() => true) // Asegúrate que esta línea esté así
      };
    } catch (error) {
      console.error('Error al procesar datos:', error);
      return {
        headers: [],
        rows: [],
        filter: []
      };
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Base de Datos: {DB_NAME}</h1>
        <select
          className="p-2 rounded"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          {Object.keys(storeData).map(store => (
            <option key={store} value={store}>
              {store} ({storeData[store]?.length ?? 0} registros)
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow bg-white/80 rounded-xl p-4 overflow-auto">
        {selectedStore && storeData[selectedStore]?.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {storeData[selectedStore].length} registros de {selectedStore}
            </div>
            <TableComponent tableData={getTableData(storeData[selectedStore])} />
          </>
        ) : (
          <div className="text-center p-4">
            {selectedStore 
              ? `No hay datos en la tabla ${selectedStore}`
              : 'Seleccione una tabla para ver sus datos'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseViewer;
