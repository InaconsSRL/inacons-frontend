import React from 'react';
import { Task } from './types/kanban';

interface KanbanCardProps {
  task: Task;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p><span className="font-semibold">Código:</span> {task.projectCode}</p>
          <p><span className="font-semibold">Tipo:</span> {task.requestType}</p>
          <p><span className="font-semibold">Entrega:</span> {task.deliveryDate}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-xs font-semibold text-white border-2 border-white"
                title={assignee}
              >
                {assignee.charAt(0)}
              </div>
            ))}
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-semibold">
            Editar
          </button>
        </div>
      </div>
    );
  };

export default KanbanCard;