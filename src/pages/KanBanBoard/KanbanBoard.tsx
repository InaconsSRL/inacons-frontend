import { useState, useEffect, useRef } from 'react'; // Añadir useRef
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRequerimientos } from '../../slices/requerimientoSlice';
import { motion } from 'framer-motion';
import Modal from '../../components/Modal/Modal';
import RequerimientoRecursos from '../RequerimientosPage/CrearRequerimientoYRecursos/RequerimientoRecursos';
import KanbanColumn from './KanbanColumn';
import KanbanCardAprobacion from './KanbanCardAprobacion';
import KanbanCardLogistica from './KanbanCardLogistica';
import { Column, Requerimiento } from './types/kanban'; // Añadir esta línea
import Button from '../../components/Buttons/Button';
import { FiRefreshCcw } from 'react-icons/fi';
import KanbanCardAlmacen from './KanbanCardAlmacen';
import KanbanCardOrdenCompra from './KanbanCardOrdenCompra';
import KanbanColumnCotizacion from './KanbanColumnCotizacion';

const KanbanBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const requerimientos: Requerimiento[] = useSelector((state: RootState) => state.requerimiento.requerimientos);
  const cotizaciones = useSelector((state: RootState) => state.cotizacion.cotizaciones);
  const cotizacionesAdjudicadas = cotizaciones.filter(cot => cot.estado === 'adjudicada');
  const [modalNuevoRequerimiento, setModalNuevoRequerimiento] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showButtons, setShowButtons] = useState(false);

  const user = useSelector((state: RootState) => state.user);

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
  
  // Columnas de requerimientos según estado
  const aprobacionSupervisor: Column = {
    id: 'aprobacion_supervisor',
    title: 'Aprobación del Supervisor',
    color: "#d86827",
    requerimiento: filteredRequerimientos
      .filter(req => req.estado_atencion === "pendiente")
      .sort((a, b) => {
        const aHasUser = a.aprobacion?.some(aprob => aprob.id_usuario === user.id) || false;
        const bHasUser = b.aprobacion?.some(aprob => aprob.id_usuario === user.id) || false;
        return aHasUser === bHasUser ? 0 : aHasUser ? -1 : 1;
      })
  };

  const aprobacionGerencia: Column = {
    id: 'aprobacion_gerencia',
    title: 'Aprobación de Gerencia',
    color: "#e2524a",
    requerimiento: filteredRequerimientos
    .filter(req => req.estado_atencion === "aprobado_supervisor")
    .sort((a, b) => {
      const aHasUser = a.aprobacion?.some(aprob => aprob.id_usuario === user.id) || false;
      const bHasUser = b.aprobacion?.some(aprob => aprob.id_usuario === user.id) || false;
      return aHasUser === bHasUser ? 0 : aHasUser ? -1 : 1;
    })
  };

  const gestionLogisticaUno: Column = {
    id: 'gestion_logistica',
    title: 'Logística a Almacén',
    color: "#C84630",
    requerimiento: filteredRequerimientos.filter(req => req.estado_atencion === "aprobado_gerencia")
  };

  const gestionAlmacen: Column = {
    id: 'gestion_almacen',
    title: 'Almacén y traslados',
    color: "#a2122f",
    requerimiento: filteredRequerimientos.filter(req => req.estado_atencion === "aprobado_logistica")
  };

  const gestionTransferencias: Column = {
    id: 'gestion_trasnsferencias',
    title: 'Despacho y Transferencias',
    color: "#68AD22",
    requerimiento: filteredRequerimientos.filter(req => req.estado_atencion === "estado de transferencia")
  };

  const gestionOrdenDeCompra: Column = {
    id: 'gestion_orden_compra',
    title: 'Aprobar Orden de Compra',
    color: "#F7AA01",
    cotizacion: cotizacionesAdjudicadas,
  };
  console.log(cotizaciones);

  const gestionatencionParcial: Column = {
    id: 'gestion_atencion_parcial',
    title: 'Requerimiento en Atención',
    color: "#332e3c",
    requerimiento: filteredRequerimientos.filter(req => req.estado_atencion === "aprobado_almacen")
  };

  const gestionCompletados: Column = {
    id: 'atencion_completados',
    title: 'Requerimientos Terminados',
    color: "#0B132B",
    requerimiento: filteredRequerimientos.filter(req => req.estado_atencion === "terminados")
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

  const handleRefresh = () => {
    dispatch(fetchRequerimientos());
  };

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
        <Button  text='Actualizar' color='blanco' onClick={handleRefresh} className="rounded w-auto" 
          icon={<FiRefreshCcw className="text-green-500 text-center h-3 w-3" />} />
        <button onClick={() => setModalNuevoRequerimiento(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
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
          className="flex overflow-x-auto space-x-4 max-h-[calc(100vh-14rem)] h-full scroll-smooth snap-x snap-mandatory"
        >
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] ">
            <KanbanColumn key={aprobacionSupervisor.id} column={aprobacionSupervisor} CardComponent={KanbanCardAprobacion} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] " >
            <KanbanColumn key={aprobacionGerencia.id} column={aprobacionGerencia} CardComponent={KanbanCardAprobacion} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] ">
            <KanbanColumn key={gestionLogisticaUno.id} column={gestionLogisticaUno} CardComponent={KanbanCardLogistica} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] ">
            <KanbanColumn key={gestionAlmacen.id} column={gestionAlmacen} CardComponent={KanbanCardAlmacen} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] ">
            <KanbanColumn key={gestionTransferencias.id} column={gestionTransferencias} CardComponent={KanbanCardAprobacion} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] ">
            <KanbanColumnCotizacion key={gestionOrdenDeCompra.id} column={gestionOrdenDeCompra} CardComponent={KanbanCardOrdenCompra} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] ">
            <KanbanColumn key={gestionatencionParcial.id} column={gestionatencionParcial} CardComponent={KanbanCardAprobacion} />
          </div>
          <div className="snap-center min-w-[240px] min-h-[calc(100vh-15rem)] ">
            <KanbanColumn key={gestionCompletados.id} column={gestionCompletados} CardComponent={KanbanCardAprobacion} />
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
