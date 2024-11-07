import React from 'react';
import { Column } from './types/kanban';

interface CardProps {
  task: Column['tasks'][0];
}

interface KanbanColumnProps {
  column: Column;
  CardComponent: React.ComponentType<CardProps>; // Agregamos el prop para el componente Card
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, CardComponent }) => {
    return (
      <div className="flex-shrink-0 w-[250px] bg-white/10 rounded-lg shadow-lg scale-90 lg:scale-100 min-h-[65vh] max-h-[calc(100vh-400px)] ">
        <div className="p-4 rounded-t-lg " style={{ backgroundColor: column.color }}>
          <h2 className="text-sm font-semibold flex justify-between items-center text-white">
            {column.title}
            <span className="text-sm font-normal bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
              {column.tasks.length}
            </span>
          </h2>
        </div>
        <div className="p-4 space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto">
          {column.tasks.map((task) => (
            <CardComponent key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

export default KanbanColumn;