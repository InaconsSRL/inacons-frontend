import { useState, useEffect, useRef } from 'react'; // Añadir useRef
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRequerimientos } from '../../slices/requerimientoSlice';
import { motion } from 'framer-motion';
import Modal from '../../components/Modal/Modal';
import RequerimientoRecursos from '../RequerimientosPage/CrearRequerimientoYRecursos/RequerimientoRecursos';
import KanbanColumn from './KanbanColumn';
import KanbanCardAprobacionSupervisor from './0KanbanCardAprobacionSupervisor';
import KanbanCardAprobacionGerencia from './1KanbanCardAprobacionGerencia';
import KanbanCardLogisticaUno from './2KanbanCardLogisticaUno';
import KanbanCard from './KanbanCard';

const KanbanBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const requerimientos = useSelector((state: RootState) => state.requerimiento.requerimientos);
  const [modalNuevoRequerimiento, setModalNuevoRequerimiento] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    dispatch(fetchRequerimientos());
  }, [dispatch]);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const hasOverflow = scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth;
        setShowButtons(hasOverflow);
      }
    };

    // Comprobar overflow inicial
    checkOverflow();

    // Observar cambios en el tamaño
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

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
        deliveryDate: new Date(req.fecha_final).toLocaleDateString('es-ES'),
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
    id: 'gestion_logistica',
    title: 'Gestión de Logística a Almacén',
    color: "#20AFEF",
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

  const gestionAlmacen = {
    id: 'gestion_almacen',
    title: 'Gestión de Almacén y traslados',
    color: "#6130EF",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "aprobado_logistica")
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

  const gestionLogisticaDos = {
    id: 'gestion_traslado',
    title: 'Cotización y Compra de Materiales',
    color: "#61AF40",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "aprobado_almacen")
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

  const gestionatencionParcial = {
    id: 'gestion_atencion_parcial',
    title: 'Atencion Parcial de Requerimientos',
    color: "#AAAFEF",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "atencion_parcial")
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

  const gestionCompletados = {
    id: 'atencion_completados',
    title: 'Requerimientos Terminados',
    color: "#61BBEF",
    tasks: filteredRequerimientos
      .filter(req => req.estado_atencion === "terminados")
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Ajustar según necesidad
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleCloseModal = () => {
    setModalNuevoRequerimiento(false);
  }

  return (
    <div className="p-4 relative"> {/* Añadir relative */}
      <div className="mb-4 flex justify-between items-center">
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
      
      <div className="relative"> {/* Contenedor para los botones y el scroll */}
        {/* Botón izquierdo */}
        {showButtons && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/30 text-white p-3 rounded-r-lg backdrop-blur-sm transition-all"
          >
            ◀
          </button>
        )}

        {/* Contenedor scrolleable */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 max-h-[70vh] scroll-smooth snap-x snap-mandatory"
        >
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-285px)] ">
            <KanbanColumn key={aprobacionSupervisor.id} column={aprobacionSupervisor} CardComponent={KanbanCardAprobacionSupervisor} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-285px)] " >
            <KanbanColumn key={aprobacionGerencia.id} column={aprobacionGerencia} CardComponent={KanbanCardAprobacionGerencia} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-285px)] ">
            <KanbanColumn key={gestionLogisticaUno.id} column={gestionLogisticaUno} CardComponent={KanbanCardLogisticaUno} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-285px)] ">
            <KanbanColumn key={gestionAlmacen.id} column={gestionAlmacen} CardComponent={KanbanCard} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-285px)] ">
            <KanbanColumn key={gestionLogisticaDos.id} column={gestionLogisticaDos} CardComponent={KanbanCard} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-285px)] ">
            <KanbanColumn key={gestionatencionParcial.id} column={gestionatencionParcial} CardComponent={KanbanCard} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-285px)] ">
            <KanbanColumn key={gestionCompletados.id} column={gestionCompletados} CardComponent={KanbanCard} />
          </div>
        </div>

        {/* Botón derecho */}
        {showButtons && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/30 text-white p-3 rounded-l-lg backdrop-blur-sm transition-all"
          >
            ▶
          </button>
        )}
      </div>

      {/* Modal sin cambios */}
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
