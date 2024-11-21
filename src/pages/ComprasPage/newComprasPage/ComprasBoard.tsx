import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Table/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompras } from '../../../slices/comprasSlice';
import { RootState, AppDispatch } from '../../../store/store';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { FiEdit, FiEye, FiRefreshCw } from 'react-icons/fi';
import ComprasSelectSources from './ComprasSelectSources';

interface Compra {
  id: string;
  proveedor_id: string;
  usuario_id: string;
  orden_compra_id: string;
  fecha: string;
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

const ComprasBoard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalResumenOpen, setIsModalResumenOpen] = useState(false);
  const [editingCompra, setEditingCompra] = useState<Compra | null>(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const userId = useSelector((state: RootState) => state.user.id);

  const dispatch = useDispatch<AppDispatch>();
  const { compras, loading, error } = useSelector((state: RootState) => state.compra);

  useEffect(() => {
    dispatch(fetchCompras());
  }, []);

  const handleEdit = (compra: Compra) => {
    setEditingCompra(compra);
    setIsModalOpen(true);
  };

  const handleResumen = (compra: Compra) => {
    setEditingCompra(compra);
    setIsModalResumenOpen(true);
  };

  const getFilteredCompras = () => {
    switch (activeFilter) {
      case 'mis_compras':
        return compras.filter(comp => comp.usuario_id === userId);
      default:
        return compras;
    }
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingCompra(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalResumenOpen(false);
    setEditingCompra(null);
  };

  const handleRefresh = () => {
    dispatch(fetchCompras());
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const renderOptions = (comp: Compra) => (
    <div className='flex flex-row gap-2'>
      <button
        className='text-yellow-500'
        onClick={() => handleResumen(comp)}
      >
        <FiEye />
      </button>
      <button
        className='text-blue-500'
        onClick={() => handleEdit(comp)}
      >
        <FiEdit />
      </button>
    </div>
  );

  const tableData = {
    headers: ["ID", "Proveedor", "Fecha", "Orden de Compra", "opciones"],
    rows: getFilteredCompras().map(comp => ({
      ID: comp.id,
      Proveedor: comp.proveedor_id,
      Fecha: formatDate(comp.fecha),
      "Orden de Compra": comp.orden_compra_id,
      opciones: renderOptions(comp)
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
          <h1 className="text-2xl font-bold text-blue-50">Compras</h1>
        </div>
        <Button text='Actualizar' color='blanco' onClick={handleRefresh} className="rounded w-auto" 
          icon={<FiRefreshCw className="text-green-500 text-center h-3 w-3" />} />
        <Button text='+ Nueva Cotización' color='verde' onClick={handleButtonClick} className="rounded w-auto" />
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
                  className={`px-3 py-1 ${activeFilter === 'mis_compras' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md text-xs hover:bg-blue-600 transition-colors`}
                  onClick={() => setActiveFilter('mis_compras')}
                >
                  Cotizaciones
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'mis_compras2' ? 'bg-sky-600' : 'bg-sky-500'} text-white rounded-md text-xs hover:bg-blue-600 transition-colors`}
                  onClick={() => setActiveFilter('mis_compras2')}
                >
                  Orden de Cotizacion
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'mis_compras3' ? 'bg-indigo-600' : 'bg-indigo-500'} text-white rounded-md text-xs hover:bg-blue-600 transition-colors`}
                  onClick={() => setActiveFilter('mis_compras3')}
                >
                  Completados
                </button>
                <button
                  className={`px-3 py-1 ${activeFilter === 'todos' ? 'bg-cyan-600' : 'bg-cyan-500'} text-white rounded-md text-xs hover:bg-indigo-600 transition-colors`}
                  onClick={() => setActiveFilter('todos')}
                >
                  Pendiente de Aprobación
                </button>
              </div>
              <TableComponent tableData={tableData} />
            </div>
          </motion.div>
        </main>
      </motion.div>

      {/* Aquí irían los modales para crear/editar y ver resumen de compras */}
      {isModalOpen && (
        <Modal title='Selecciona Recursos a Cotizar' isOpen={isModalOpen} onClose={handleCloseModal}>
          <ComprasSelectSources />
        </Modal>
      )}
    </motion.div>
  );
};

export default ComprasBoard;
