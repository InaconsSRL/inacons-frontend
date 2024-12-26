import React from 'react';
import RecursoCard from './RecursoCard';
import { RecursosListProps } from './bodega.types';

export const RecursosList: React.FC<RecursosListProps> = ({
  recursos,
  selectedRecursos,
  onAddRecurso
}) => {
  return (
    <div className="flex flex-col xl:h-[calc(100vh-20rem)] h-[calc(100vh-30rem)] ">
      <div className="flex-1 overflow-y-auto pr-4">
        <div className="grid grid-cols-1 2xl:grid-cols-2 text- gap-4">
          {recursos.map((recurso) => (
            <RecursoCard
              key={recurso.id}
              recurso={recurso}
              isSelected={!!selectedRecursos[recurso.id]}
              onAdd={onAddRecurso}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
