import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequerimientos } from '../../slices/requerimientoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit, FiEye, FiRefreshCw } from 'react-icons/fi';
import RequerimientoRecursos from './CrearRequerimientoYRecursos/RequerimientoRecursos';
import RequerimientoResumen from './RequerimientoResumen/RequerimientoResumen';

interface Requerimiento {
  id: string;
  usuario_id: string;
  usuario: string;
  presupuesto_id: string;
  fecha_solicitud: string;
  estado_atencion: string;
  sustento: string;
  obra_id: string;
  codigo: string;
  fecha_final: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const RequerimientosComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalResumenOpen, setIsModalResumenOpen] = useState(false);
  const [editingRequerimiento, setEditingRequerimiento] = useState<Requerimiento | null>(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const userId = useSelector((state: RootState) => state.user.id);

  const dispatch = useDispatch<AppDispatch>();
  const { requerimientos, loading, error } = useSelector((state: RootState) => state.requerimiento);

  useEffect(() => {
    dispatch(fetchRequerimientos());
  }, []);

  const handleEdit = (requerimiento: Requerimiento) => {
    setEditingRequerimiento(requerimiento);
    setIsModalOpen(true);
  };

  const handleResumen = (requerimiento: Requerimiento) => {
    setEditingRequerimiento(requerimiento);
    setIsModalResumenOpen(true);
    console.log('resumen');
  }

  const getFilteredRequerimientos = () => {
    switch (activeFilter) {
      case 'mis_requerimientos':
        return requerimientos.filter(req => req.usuario_id === userId);
      case 'pendientes':
        return requerimientos.filter(req =>
          ['pendiente', 'aprobado_supervisor'].includes(req.estado_atencion)
        );
      case 'atencion_parcial':
        return requerimientos.filter(req =>
          req.estado_atencion === 'aprobado_gerencia'
        );
      case 'completados':
        return requerimientos.filter(req =>
          ['completado', 'completado_parcial'].includes(req.estado_atencion)
        );
      case 'rechazados':
        return requerimientos.filter(req =>
          req.estado_atencion.includes('rechazado')
        );
      default:
        return requerimientos;
    }
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingRequerimiento(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalResumenOpen(false);
    setEditingRequerimiento(null);
  };

  const handleRefresh = () => {
    dispatch(fetchRequerimientos());
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const calculateExpiryDate = (req: Requerimiento) => {
    if (req.fecha_final) {
      return formatDate(req.fecha_final);
    }
    const expiryDate = new Date(req.fecha_solicitud);
    expiryDate.setDate(expiryDate.getDate() + 2);
    return formatDate(expiryDate.toISOString());
  };

  const renderOptions = (req: Requerimiento) => {
    const viewButton = (
      <button
        className='text-yellow-500'
        onClick={() => handleResumen(req)}
      >
        <FiEye />
      </button>
    );

    if (req.estado_atencion === "Pendiente de envio") {
      return (
        <div className='flex flex-row gap-2'>
          {viewButton}
          <button
            className='text-blue-500'
            onClick={() => handleEdit(req)}
          >
            <FiEdit />
          </button>
        </div>
      );
    }
    return viewButton;
  };

  const tableData = {
    headers: ["obra", "fecha emision", "vence", "estado", "codigo", "descripcion", "solicita", "opciones"],
    rows: getFilteredRequerimientos().map(req => ({
      codigo: req.codigo,
      solicita: req.usuario,
      obra: req.codigo.split('-')[1],
      descripcion: req.sustento,
      estado: req.estado_atencion,
      "fecha emision": formatDate(req.fecha_solicitud),
      "vence": calculateExpiryDate(req),
      opciones: renderOptions(req)
    }))
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div
        className="text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-50">Requerimientos</h1>
          
        </div>
        <Button  text='Actualizar' color='blanco' onClick={handleRefresh} className="rounded w-auto" 
          icon={<FiRefreshCw className="text-green-500 text-center h-3 w-3" />} />
        <Button text='+ Nuevo Requerimiento' color='verde' onClick={handleButtonClick} className="rounded w-auto" />
      </motion.div>

      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div
            className="flex-grow border rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="h-full overflow-auto">
              <div className="mb-4 space-x-2">
                <button
                  className={`px-3 py-1 ${activeFilter === 'mis_requerimientos' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md text-xs hover:bg-blue-600 transition-colors`}
                  onClick={() => setActiveFilter('mis_requerimientos')}
                >
                  Mis requerimientos
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'pendientes' ? 'bg-gray-600' : 'bg-gray-500'} text-white rounded-md text-xs hover:bg-gray-600 transition-colors`}
                  onClick={() => setActiveFilter('pendientes')}
                >
                  Pendientes de Aprobación
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'atencion_parcial' ? 'bg-green-600' : 'bg-green-500'} text-white rounded-md text-xs hover:bg-green-600 transition-colors`}
                  onClick={() => setActiveFilter('atencion_parcial')}
                >
                  Atención Parcial
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'completados' ? 'bg-purple-600' : 'bg-purple-500'} text-white rounded-md text-xs hover:bg-purple-600 transition-colors`}
                  onClick={() => setActiveFilter('completados')}
                >
                  Completados
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'rechazados' ? 'bg-red-600' : 'bg-red-500'} text-white rounded-md text-xs hover:bg-red-600 transition-colors`}
                  onClick={() => setActiveFilter('rechazados')}
                >
                  Rechazados
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'todos' ? 'bg-indigo-600' : 'bg-indigo-500'} text-white rounded-md text-xs hover:bg-indigo-600 transition-colors`}
                  onClick={() => setActiveFilter('todos')}
                >
                  Todos
                </button>
              </div>
              <TableComponent tableData={tableData} />
            </div>
          </motion.div>
        </main>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            title={editingRequerimiento ? 'Actualizar Requerimiento' : 'Crear Requerimiento'}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RequerimientoRecursos
                initialValues={editingRequerimiento || {
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
        {isModalResumenOpen && (
          <Modal
            title='Resumen Requerimiento'
            isOpen={isModalResumenOpen}
            onClose={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RequerimientoResumen
                id={editingRequerimiento?.id || ''}                  
                onClose={handleCloseModal}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequerimientosComponent;