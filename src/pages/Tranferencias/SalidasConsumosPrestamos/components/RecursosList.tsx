import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import RecursoCard from './RecursoCard';
import { RecursosListProps } from './bodega.types';

export const RecursosList: React.FC<RecursosListProps> = ({
  recursos,
  selectedRecursos,
  onAddRecurso
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecursos = recursos.filter(recurso =>
    recurso.recurso_id.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recurso.recurso_id.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)]">
      <div className="mb-4 sticky top-0 bg-white/80 p-4 shadow-md rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecursos.map((recurso) => (
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
