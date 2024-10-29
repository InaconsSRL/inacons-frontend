import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KanbanColumn from './KanbanColumn';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRequerimientos } from '../../slices/requerimientoSlice';

const KanbanBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const requerimientos = useSelector((state: RootState) => state.requerimiento.requerimientos);

  useEffect(() => {
    dispatch(fetchRequerimientos());
  }, [dispatch]);

  // Función para filtrar requerimientos basados en el término de búsqueda y estado
  const filteredRequerimientos = requerimientos.filter(requerimiento =>
    (requerimiento.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    requerimiento.sustento.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  console.log(filteredRequerimientos);
  // Columnas de requerimientos según estado
  const requerimientosPendientes = {
    id: 'requerimientos_pendientes',
    title: 'Requerimientos Pendientes',
    color: "#E06C75",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "pendiente")
      .map(req => ({
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

  const aprobacionGerencia = {
    id: 'aprobacion_gerencia',
    title: 'Aprobación Gerencia',
    color: "#98C379",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "aprobado_supervisor")
      .map(req => ({
        id: req.id,
        title: req.codigo,
        description: req.sustento,
        projectCode: req.codigo.split('-')[0],
        requestType: 'REQUERIMIENTO',
        deliveryDate: new Date(req.fecha_solicitud).toLocaleDateString('es-ES'),
        assignees: [req.usuario],
        purchaseType: 'N/A',
        approvedBy: 'Supervisor'
      }))
  };

  const gestionAlmacen = {
    id: 'gestion_almacen',
    title: 'Gestión Almacén',
    color: "#61AFEF",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "aprovado_gerencia")
      .map(req => ({
        id: req.id,
        title: req.codigo,
        description: req.sustento,
        projectCode: req.codigo.split('-')[0],
        requestType: 'REQUERIMIENTO',
        deliveryDate: new Date(req.fecha_solicitud).toLocaleDateString('es-ES'),
        assignees: [req.usuario],
        purchaseType: 'N/A',
        approvedBy: 'Gerencia'
      }))
  };

  return (
    <div className="p-4 ">
      <div className="mb-4 flex justify-between items-center ">
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
      <div className="flex overflow-x-auto space-x-4 max-h-[70vh]">
        <KanbanColumn key={requerimientosPendientes.id} column={requerimientosPendientes} />
        <KanbanColumn key={aprobacionGerencia.id} column={aprobacionGerencia} />
        <KanbanColumn key={gestionAlmacen.id} column={gestionAlmacen} />
        
      </div>
    </div>
  );
};

export default KanbanBoard;
