import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCotizaciones, addCotizacion, deleteCotizacion } from '../../slices/cotizacionSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import ComprasSelectSources from './ComprasSelectSources';
import Toast from '../../components/Toast/Toast';
import { ModalProvider } from './ContextoParaLosModales';
import { Provider } from 'react-redux';
import {store} from '../../store/store';

interface Cotizacion {
  id: string;
  codigo_cotizacion: string;
  usuario_id: {
    apellidos: string;
    nombres: string;
    id: string;
  };
  fecha: string;
  estado: string;
  aprobacion: boolean;
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
  console.log(isModalResumenOpen)
  const [editingCompra, setEditingCompra] = useState<Cotizacion | null>(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const userId = useSelector((state: RootState) => state.user.id);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: 'success' | 'danger' | 'warning' | 'info';
  }>({ show: false, message: '', variant: 'info' });

  const dispatch = useDispatch<AppDispatch>();
  const { cotizaciones, loading, error } = useSelector((state: RootState) => state.cotizacion);

  useEffect(() => {
    if (!cotizaciones.length) dispatch(fetchCotizaciones());
  }, []);

  const handleEdit = (cotizacion: Cotizacion) => {
    setEditingCompra(cotizacion);
    setIsModalOpen(true);
  };

  // const handleResumen = (cotizacion: Cotizacion) => {
  //   setEditingCompra(cotizacion);
  //   setIsModalResumenOpen(true);
  // };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCotizacion(id)).unwrap();
      setToast({
        show: true,
        message: 'Cotización eliminada exitosamente',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: `Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: 'danger'
      });
    }
  };

  const getFilteredCotizaciones = () => {
    switch (activeFilter) {
      case 'mis_cotizaciones':
        return cotizaciones.filter(cot => cot.usuario_id.id === userId);
      default:
        return cotizaciones;
    }
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = async () => {
    try {
      if (!userId) {
        throw new Error('No se encontró el ID del usuario');
      }

      const result = await dispatch(addCotizacion({
        usuario_id: userId,
        estado: 'vacio',
        fecha: new Date().toISOString(),
        codigo_cotizacion: `COT-${String(new Date().getHours()).padStart(2, '0') +
          String(new Date().getMinutes()).padStart(2, '0') +
          String(new Date().getDate()).padStart(2, '0') +
          String(new Date().getMonth() + 1).padStart(2, '0') +
          String(new Date().getFullYear()).slice(-2)
          }`,
        aprobacion: false,
      })).unwrap();

      setToast({
        show: true,
        message: 'Cotización creada exitosamente',
        variant: 'success'
      });

      setEditingCompra(result);
      setIsModalOpen(true);
    } catch (error) {
      setToast({
        show: true,
        message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: 'danger'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalResumenOpen(false);
    setEditingCompra(null);
  };

  const handleRefresh = () => {
    dispatch(fetchCotizaciones());
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const renderOptions = (cot: Cotizacion) => (
    <div className='flex flex-row gap-2'>
      {/* <button
        className='text-yellow-500'
        onClick={() => handleResumen(cot)}
      >
        <FiEye />
      </button> */}
      <button
        className='text-blue-500'
        onClick={() => handleEdit(cot)}
      >
        <FiEdit />
      </button>
      {cot.estado === 'vacio' && (
        <button
          className='text-red-500'
          onClick={() => handleDelete(cot.id)}
        >
          <FiTrash2 />
        </button>
      )}
    </div>
  );

  const tableData = {
    headers: ["ID", "Código Cotización", "Usuario", "Estado", "Fecha", "Opciones"],
    rows: getFilteredCotizaciones().map(cot => ({
      ID: cot.id,
      "Código Cotización": cot.codigo_cotizacion,
      Usuario: `${cot.usuario_id.nombres} ${cot.usuario_id.apellidos}`,
      Fecha: formatDate(cot.fecha),
      Opciones: renderOptions(cot),
      Estado: cot.estado
    }))
  };

  return (
    <Provider store={store} >
      <ModalProvider>
        <motion.div

          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="flex flex-row h-full text-white pb-4 px-4 items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Modificar esta sección del modal */}
        {isModalOpen && editingCompra && (
          <Modal title='Selecciona Recursos a Cotizar' isOpen={isModalOpen} onClose={handleCloseModal}>
            <ComprasSelectSources
              cotizacion={{
                id: editingCompra.id,
                codigo_cotizacion: editingCompra.codigo_cotizacion,
                usuario_id: {
                  id: editingCompra.usuario_id.id,
                  nombres: editingCompra.usuario_id.nombres,
                  apellidos: editingCompra.usuario_id.apellidos
                },
                estado: editingCompra.estado,
                fecha: editingCompra.fecha,
                aprobacion: editingCompra.aprobacion
              }}
            />
          </Modal>
        )}

        {toast.show && (
          <Toast
            message={toast.message}
            variant={toast.variant}
            isVisible={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            position="top-right"
            index={0}
          />
        )}
      
    </ModalProvider>
  </Provider>
  );
};

export default ComprasBoard;
