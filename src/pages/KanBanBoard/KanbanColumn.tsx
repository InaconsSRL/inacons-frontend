import React from 'react';
import { Column, Requerimiento } from './types/kanban';

// Definir un tipo común para las props de las tarjetas
export interface KanbanCardBaseProps {
  column: Omit<Column, 'requerimiento'> & {
    requerimiento: Requerimiento;
  };
}

interface KanbanColumnProps {
  column: Column;
  CardComponent: React.ComponentType<KanbanCardBaseProps>;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, CardComponent }) => {
  return (
    <div className="flex-shrink-0 w-[250px] bg-white/10 rounded-lg shadow-lg scale-90 lg:scale-100 min-h-[65vh] max-h-[calc(100vh-400px)] ">
      <div className="p-4 rounded-t-lg" style={{ backgroundColor: column.color }}>
        <h2 className="text-sm font-semibold flex justify-between items-center text-white">
          {column.title}
          <span className="text-sm font-normal bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
            {column.requerimiento.length}
          </span>
        </h2>
      </div>
      <div className="p-4 space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto">
        {column.requerimiento.map((req) => (
          <CardComponent 
            key={req.id} 
            column={{
              id: column.id,
              title: column.title,
              color: column.color,
              requerimiento: req
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;