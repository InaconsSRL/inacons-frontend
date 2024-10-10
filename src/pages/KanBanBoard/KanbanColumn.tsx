import React from 'react';
import { Column } from './types/kanban';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
    return (
      <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg overflow-hidden scale-90 lg:scale-100">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold flex justify-between items-center">
            {column.title}
            <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {column.tasks.length}/{column.limit || '∞'}
            </span>
          </h2>
        </div>
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {column.tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

export default KanbanColumn;