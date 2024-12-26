import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { SelectedRecursosProps } from './bodega.types';

export const SelectedRecursos: React.FC<SelectedRecursosProps> = ({
  selectedRecursos,
  onUpdateCantidad,
  onRemoveRecurso,
  onProcesar,
  isProcessing,
  error
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 ">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Recursos Seleccionados</h2>
        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
          {Object.keys(selectedRecursos).length} items
        </span>
      </div>
      
      {(error) && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto xl:h-[calc(100vh-20rem)] h-[calc(100vh-30rem)]">
        {Object.entries(selectedRecursos).map(([id, { recurso, cantidad }], index) => (
          <div key={id} className="border-b py-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-[0.5rem] font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium w-96">{recurso.recurso_id.nombre}</p>
                  <p className="text-xs text-gray-500">{recurso.obra_bodega_id.nombre}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={recurso.cantidad}
                  value={cantidad}
                  onChange={(e) => onUpdateCantidad(id, Number(e.target.value))}
                  className="w-18 p-1 text-xs border rounded-xl pl-3 "
                />
                <button
                  onClick={() => onRemoveRecurso(id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(selectedRecursos).length > 0 && (
        <button
          onClick={onProcesar}
          disabled={isProcessing}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Procesar
        </button>
      )}
    </div>
  );
};
