import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KanbanColumn from './KanbanColumn';
import { mockBoard as board } from './mockData/kanbanData';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRequerimientos } from '../../slices/requerimientoSlice';

const KanbanBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const requerimientos = useSelector((state: RootState) => state.requerimiento.requerimientos);

  // Función para generar un color aleatorio
  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  // Función para filtrar tareas basadas en el término de búsqueda
  const filteredBoard = {
    columns: board.columns.map(column => ({
      ...column,
      color: getRandomColor(), // Asignar un color aleatorio a cada columna
      tasks: column.tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
  };

  useEffect(() => {
    dispatch(fetchRequerimientos());
  }, [dispatch]);

  // Función para filtrar requerimientos basados en el término de búsqueda
  const filteredRequerimientos = requerimientos.filter(requerimiento =>
    requerimiento.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    requerimiento.sustento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requerimientosColumn = {
    id: 'requerimientos',
    title: 'Requerimientos',
    color: getRandomColor(), // Asignar un color aleatorio a la columna de requerimientos
    tasks: filteredRequerimientos.map(req => ({
      id: req.id,
      title: req.codigo,
      description: req.sustento,
      projectCode: req.codigo.split('-')[0],
      requestType: 'REQUERIMIENTO',
      deliveryDate: new Date(req.fecha_solicitud).toLocaleDateString('es-ES'),
      assignees: [req.usuario],
      purchaseType: 'N/A',
      approvedBy: 'Pendiente'
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
          Nuevo Requerimiento
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4 h-[calc(76vh)]">
        <KanbanColumn key={requerimientosColumn.id} column={requerimientosColumn} />
        {filteredBoard.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
