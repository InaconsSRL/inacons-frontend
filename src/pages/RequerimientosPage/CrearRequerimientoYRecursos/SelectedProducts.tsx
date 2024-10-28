import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { SelectedProductsProps } from './types/interfaces';

export const SelectedProducts: React.FC<SelectedProductsProps> = ({ requerimientoId }) => {
  const { requerimientoRecursos } = useSelector((state: RootState) => state.requerimientoRecurso);
  const { recursos } = useSelector((state: RootState) => state.recurso);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Productos Seleccionados</h2>
      <ul>
        {requerimientoRecursos.map((reqRecurso) => {
          const recurso = recursos.find((r) => r.id === reqRecurso.recurso_id);
          if (recurso) {
            return (
              <li key={reqRecurso.id} className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-md font-medium">{recurso.nombre}</h3>
                  <p className="text-gray-500">Cantidad: {reqRecurso.cantidad}</p>
                </div>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};