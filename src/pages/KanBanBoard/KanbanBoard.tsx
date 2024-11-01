import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRequerimientos } from '../../slices/requerimientoSlice';
import { motion } from 'framer-motion';
import KanbanColumnAprobacionSupervisor from './KanbanColumnAprobacionSupervisor';
import KanbanColumnAprobacionGerencia from './KanbanColumnAprobacionGerencia';
import KanbanColumnLogisticaUno from './KanbanColumnLogisticaUno';
import Modal from '../../components/Modal/Modal';
import RequerimientoRecursos from '../RequerimientosPage/CrearRequerimientoYRecursos/RequerimientoRecursos';

const KanbanBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const requerimientos = useSelector((state: RootState) => state.requerimiento.requerimientos);
  const [modalNuevoRequerimiento, setModalNuevoRequerimiento] = useState(false);

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
  const aprobacionSupervisor = {
    id: 'requerimientos_pendientes',
    title: 'Aprobación del Supervisor',
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
    title: 'Aprobación de Gerencia',
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

  const gestionLogisticaUno = {
    id: 'gestion_almacen',
    title: 'Gestión de Logística a Almacén',
    color: "#61AFEF",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "aprobado_gerencia")
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

  const handleCloseModal = () => {
    setModalNuevoRequerimiento(false);
  }

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
        <button onClick={()=> setModalNuevoRequerimiento(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Nuevo Requerimiento
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4 max-h-[70vh]">
        <KanbanColumnAprobacionSupervisor key={aprobacionSupervisor.id} column={aprobacionSupervisor} />
        <KanbanColumnAprobacionGerencia key={aprobacionGerencia.id} column={aprobacionGerencia} />
        <KanbanColumnLogisticaUno key={gestionLogisticaUno.id} column={gestionLogisticaUno} />
        
      </div>
      {modalNuevoRequerimiento && (
          <Modal
            title='Crear Requerimiento'
            isOpen={modalNuevoRequerimiento}
            onClose={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RequerimientoRecursos
                initialValues={{
                  id: '',
                  usuario_id: '',
                  usuario: '',
                  presupuesto_id: '',
                  fecha_solicitud: '',
                  estado_atencion: '',
                  sustento: '',
                  obra_id: '',
                  fecha_final: '',
                  codigo: ''
                }}
                onClose={handleCloseModal}
              />
            </motion.div>
          </Modal>
        )}

    </div>
  );
};

export default KanbanBoard;
