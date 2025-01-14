import React, { useState } from 'react';
import { FiTrash2, FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SelectedRecursosProps } from './bodega.types';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

interface RecursoObservaciones {
  [key: string]: string;
}

export const SelectedRecursos: React.FC<SelectedRecursosProps> = ({
  selectedRecursos,
  onUpdateCantidad,
  onRemoveRecurso,
  onProcesar,
  isProcessing,
  error
}) => {
  const [observaciones, setObservaciones] = useState<RecursoObservaciones>({});
  const [showObservaciones, setShowObservaciones] = useState<{[key: string]: boolean}>({});

  const unidades = useSelector((state: RootState) => state.unidad.unidades);

  const tiposRecurso = useSelector((state: RootState) => state.tipoRecurso.tiposRecurso);

  const obtenerTipoConId = (id: string) => {
    return tiposRecurso.find((tipo) => tipo.id === id);
  }

  const obtenerNombreUnidad = (id: string) => {
    const unidad = unidades.find((unidad) => unidad.id === id);
    return unidad ? unidad.nombre : 'Unidad no encontrada';
  };

  const toggleObservaciones = (id: string) => {
    setShowObservaciones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleObservacionChange = (id: string, value: string) => {
    setObservaciones(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
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
                <div className="flex flex-col">
                  <p className="text-sm font-medium w-full min-w-56">{recurso.recurso_id.nombre}</p>
                  <p className="text-xs text-gray-500">Tipo: {obtenerTipoConId(recurso.recurso_id.tipo_recurso_id?? '')?.nombre ?? 'No especificado'}</p>
                  <p className="text-xs text-green-600">Disponible: {recurso.cantidad} {obtenerNombreUnidad(recurso.recurso_id.unidad_id)}{recurso.cantidad > 1 ? "s" : "" }</p>
                  <button
                    onClick={() => toggleObservaciones(id)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    <FiMessageSquare size={12} />
                    {showObservaciones[id] ? 'Ocultar observaciones' : 'Agregar observaciones'}
                    {showObservaciones[id] ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="number"
                  min="1"
                  max={recurso.cantidad}
                  value={cantidad}
                  onChange={(e) => onUpdateCantidad(id, Number(e.target.value))}
                  className="w-18 p-1 text-xs border rounded-xl pl-3 "
                />
                <select className="w-24 p-1 text-xs border rounded-xl">
                  <option value="partida1">Partida 1</option>
                  <option value="partida2">Partida 2</option>
                  <option value="partida3">Partida 3</option>
                  <option value="partida4">Partida 4</option>
                  <option value="partida5">Partida 5</option>
                </select>
                <button
                  onClick={() => onRemoveRecurso(id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            {showObservaciones[id] && (
              <div className="mt-2 pl-9">
                <textarea
                  value={observaciones[id] || ''}
                  onChange={(e) => handleObservacionChange(id, e.target.value)}
                  placeholder="Agregar observaciones..."
                  className="w-full text-xs p-2 border rounded-lg resize-none h-20 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            )}
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
