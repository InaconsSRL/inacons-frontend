import React from 'react';
import { Column } from './types/kanban';

// Definir un tipo común para las props de las tarjetas
export interface KanbanCardBaseProps {
  column: Omit<Column, 'cotizacion'> & {
    cotizacion: any;
  };
}

interface KanbanColumnProps {
  column: any;
  CardComponent: React.ComponentType<KanbanCardBaseProps>;
}

const KanbanColumnCotizacion: React.FC<KanbanColumnProps> = ({ column, CardComponent }) => {
  return (
    <div className="flex-shrink-0 w-[250px] bg-white/10 rounded-lg shadow-lg scale-90 lg:scale-100 min-h-[69vh] max-h-[calc(100vh-300px)] ">
      <div className="p-4 rounded-t-lg" style={{ backgroundColor: column.color }}>
        <h2 className="text-sm font-semibold flex justify-between items-center text-white">
          {column.title}
          <span className="text-sm font-normal bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
            {column.cotizacion.length}
          </span>
        </h2>
      </div>
      <div className="p-4 space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto">
        {column.cotizacion.map((req) => (
          <CardComponent 
            key={req.id} 
            column={{
              id: column.id,
              title: column.title,
              color: column.color,
              cotizacion: req
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumnCotizacion;