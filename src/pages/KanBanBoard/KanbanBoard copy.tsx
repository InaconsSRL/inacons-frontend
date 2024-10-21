import { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { mockBoard as board } from './mockData/kanbanData';



const KanbanBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Función para filtrar tareas basadas en el término de búsqueda
  const filteredBoard = {
    columns: board.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar tareas..."
          className="p-2 border rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Nueva Tarea
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4 h-[calc(76vh)]">
        <KanbanColumn key={board.columns[0].id} column={board.columns[0]} />
        {filteredBoard.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;