import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './TipoRecursoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTiposRecurso, addTipoRecurso, updateTipoRecurso } from '../../slices/tipoRecursoSlice';
import { RootState, AppDispatch } from '../../store/store';

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

const TipoRecursoComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipoRecurso, setEditingTipoRecurso] = useState<{ id: string; nombre: string } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { tiposRecurso, loading, error } = useSelector((state: RootState) => state.tipoRecurso);

  useEffect(() => {
    dispatch(fetchTiposRecurso());
  }, [dispatch]);

  const handleSubmit = (data: { nombre: string }) => {
    if (editingTipoRecurso) {
      dispatch(updateTipoRecurso({ id: editingTipoRecurso.id, ...data.value }));
    } else {
      dispatch(addTipoRecurso(data.value));
    }
    setIsModalOpen(false);
    setEditingTipoRecurso(null);
  };

  const handleEdit = (tipoRecurso: { id: string; nombre: string }) => {
    setEditingTipoRecurso(tipoRecurso);
    setIsModalOpen(true);
  };

  if (loading) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Cargando...</motion.div>;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingTipoRecurso(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTipoRecurso(null);
  };

  const tableData = {
    headers: ["nombre", "opciones"],
    rows: tiposRecurso.map(tipoRecurso => ({
      ...tipoRecurso,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(tipoRecurso)}></Button>
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
        className="x text-white p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold">Tipos de Recurso ☺</h1>
      </motion.div>

      <motion.div 
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
          <motion.div 
            className="flex justify-between items-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold">Tabla de Tipos de Recurso</h2>
            <div className="flex items-center space-x-2">
              <Button text='+ Crear Tipo de Recurso' color='verde' onClick={handleButtonClick} className="rounded" />
            </div>
          </motion.div>
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
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <FormComponent
                initialValues={editingTipoRecurso || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TipoRecursoComponent;