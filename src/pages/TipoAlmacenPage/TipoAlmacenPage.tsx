import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import TipoAlmacenFormComponent from './TipoAlmacenFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTipoAlmacenes, addTipoAlmacen, updateTipoAlmacen, deleteTipoAlmacen } from '../../slices/tipoAlmacenSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface TipoAlmacen {
  id: string;
  nombre: string;
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

const TipoAlmacenPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipoAlmacen, setEditingTipoAlmacen] = useState<TipoAlmacen | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { tipoAlmacenes, loading, error } = useSelector((state: RootState) => state.tipoAlmacen);

  useEffect(() => {
    dispatch(fetchTipoAlmacenes());
  }, [dispatch]);

  const handleSubmit = (data: { nombre: string }) => {
    if (editingTipoAlmacen) {
      dispatch(updateTipoAlmacen({ id: editingTipoAlmacen.id, nombre: data.nombre }));
    } else {
      dispatch(addTipoAlmacen(data.nombre));
    }
    setIsModalOpen(false);
    setEditingTipoAlmacen(null);
  };

  const handleEdit = (tipoAlmacen: TipoAlmacen) => {
    setEditingTipoAlmacen(tipoAlmacen);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este tipo de almacén?')) {
      dispatch(deleteTipoAlmacen(id));
    }
  };

  const handleButtonClick = () => {
    setEditingTipoAlmacen(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTipoAlmacen(null);
  };

  const tableData = {
    filter: [true, true],
    headers: ["nombre", "opciones"],
    rows: tipoAlmacenes.map(tipoAlmacen => ({
      ...tipoAlmacen,
      opciones: (
        <div className="flex space-x-2">
          <button
            className='text-black'
            onClick={() => handleEdit(tipoAlmacen)}
          >
            <FiEdit size={18} className='text-blue-500' />
          </button>
          <button
            className='text-black'
            onClick={() => handleDelete(tipoAlmacen.id)}
          >
            <FiTrash2 size={18} className='text-red-500' />
          </button>
        </div>
      )
    }))
  };

  if (loading) return <LoaderPage />;
  if (error) return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      Error: {error}
    </motion.div>
  );

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
        <h1 className="text-2xl font-bold">Tipos de Almacén</h1>

        <div className="flex items-center space-x-2">
          <Button text='Nuevo Tipo de Almacén' color='verde' onClick={handleButtonClick} className="rounded w-full" />
        </div>
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
              <TableComponent tableData={tableData} />
            </div>
          </motion.div>
        </main>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal title={editingTipoAlmacen ? 'Actualizar Tipo de Almacén' : 'Crear Tipo de Almacén'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <TipoAlmacenFormComponent
                initialValues={editingTipoAlmacen || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TipoAlmacenPage;
