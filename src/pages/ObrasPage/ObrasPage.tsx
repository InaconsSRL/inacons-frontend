import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './ObrasFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchObras, addObra, updateObra } from '../../slices/obrasSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';

// Definimos la interfaz Obra
interface Obra {
  id: string;
  titulo: string;
  nombre: string;
  descripcion: string;
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

const ObrasComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObra, setEditingObra] = useState<Obra | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { obras, loading, error } = useSelector((state: RootState) => state.obra);
  console.log(obras)
  useEffect(() => {
    dispatch(fetchObras());
  }, [dispatch]);

  const handleSubmit = (data: { titulo: string; nombre: string; descripcion: string }) => {
    if (editingObra) {
      dispatch(updateObra({ id: editingObra.id, ...data }));
    } else {
      dispatch(addObra(data));
    }
    setIsModalOpen(false);
    setEditingObra(null);
  };

  const handleEdit = (obra: Obra) => {
    setEditingObra(obra);
    setIsModalOpen(true);
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingObra(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingObra(null);
  };

  const tableData = {
    headers: ["titulo", "nombre", "descripcion", "opciones"],
    rows: obras.map(obra => ({
      ...obra,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(obra)}></Button>
      )
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
        className="x text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-blue-800">Obras ☺</h1>

        <div className="flex items-center space-x-2">
          <Button text='Nueva Obra' color='verde' onClick={handleButtonClick} className="rounded w-full" />
          <motion.button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Actualizar
          </motion.button>
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
          <Modal title={editingObra ? 'Actualizar Obra' : 'Crear Obra'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <FormComponent
                initialValues={editingObra || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ObrasComponent;