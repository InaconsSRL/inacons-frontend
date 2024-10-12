import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import RequerimientoFormComponent from './RequerimientoFormComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequerimientos, addRequerimiento, updateRequerimiento } from '../../slices/requerimientoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';

interface Requerimiento {
  id: string;
  usuario_id: string;
  usuario: string;
  presupuesto_id: string;
  fecha_solicitud: string;
  estado: string;
  sustento: string;
  obra_id: string;
  codigo: string;
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
  const [editingRequerimiento, setEditingRequerimiento] = useState<Requerimiento | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { requerimientos, loading, error } = useSelector((state: RootState) => state.requerimiento);

  useEffect(() => {
    dispatch(fetchRequerimientos());
  }, [dispatch]);

  const handleSubmit = (data: { usuario_id: string; obra_id: string; sustento: string }) => {
    if (editingRequerimiento) {
      dispatch(updateRequerimiento({ id: editingRequerimiento.id, ...data }));
    } else {
      dispatch(addRequerimiento(data));
    }
    setIsModalOpen(false);
    setEditingRequerimiento(null);
  };

  const handleEdit = (requerimiento: Requerimiento) => {
    setEditingRequerimiento(requerimiento);
    setIsModalOpen(true);
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingRequerimiento(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRequerimiento(null);
  };

  const tableData = {
    headers: ["codigo", "usuario", "fecha_solicitud", "estado", "sustento", "opciones"],
    rows: requerimientos.map(req => ({
      ...req,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(req)}></Button>
      )
    }))
  };

  console.log(editingRequerimiento)
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
        <h1 className="text-2xl font-bold text-blue-800">Requerimientos</h1>
        <Button text='Nuevo Requerimiento' color='verde' onClick={handleButtonClick} className="rounded w-auto" />
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
          <Modal title={editingRequerimiento ? 'Actualizar Requerimiento' : 'Crear Requerimiento'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RequerimientoFormComponent
                initialValues={editingRequerimiento || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequerimientosComponent;