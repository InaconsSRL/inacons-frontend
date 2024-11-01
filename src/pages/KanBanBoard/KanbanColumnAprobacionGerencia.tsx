import React from 'react';
import { Column } from './types/kanban';
import KanbanCardAprobacionGerencia from './KanbanCardAprobacionGerencia';

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumnAprobacionGerencia: React.FC<KanbanColumnProps> = ({ column }) => {
    return (
      <div className="flex-shrink-0 w-auto bg-white/10 rounded-lg shadow-lg scale-90 lg:scale-100 max-h-[80vh] ">
        <div className="p-4 bg-gray-50 border-b" style={{ backgroundColor: column.color }}>
          <h2 className="text-lg font-semibold flex justify-between items-center text-white">
            {column.title}
            <span className="text-sm font-normal bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
              {column.tasks.length}/{column.limit || '∞'}
            </span>
          </h2>
        </div>
        <div className="p-4 space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto">
          {column.tasks.map((task) => (
            <KanbanCardAprobacionGerencia key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

export default KanbanColumnAprobacionGerencia;