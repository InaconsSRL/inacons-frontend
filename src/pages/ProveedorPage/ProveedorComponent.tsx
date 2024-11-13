import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import ProveedorFormComponent from './ProveedorFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProveedores, addProveedor, updateProveedor } from '../../slices/proveedorSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit } from 'react-icons/fi';

interface Proveedor {
  id: string;
  razon_social: string;
  ruc: string;
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

const ProveedorComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { proveedores, loading, error } = useSelector((state: RootState) => state.proveedor);
  console.log(proveedores)

  useEffect(() => {
    dispatch(fetchProveedores());
  }, [dispatch]);

  const handleSubmit = (data: { razon_social: string; ruc: string }) => {
    if (editingProveedor) {
      dispatch(updateProveedor({ id: editingProveedor.id, ...data }));
    } else {
      dispatch(addProveedor(data));
    }
    setIsModalOpen(false);
    setEditingProveedor(null);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setIsModalOpen(true);
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingProveedor(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProveedor(null);
  };

  const tableData = {
    filter: [true, true, false],
    headers: ["razon_social", "ruc", "opciones"],
    rows: proveedores.map(proveedor => ({
      ...proveedor,
      opciones: (
        <Button text={<FiEdit size={18} className='text-blue-500'/>} color='transp' className='text-black' onClick={() => handleEdit(proveedor)}></Button>
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
        className="text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-white">Proveedores</h1>

        <div className="flex items-center space-x-2">
          <Button text='Nuevo Proveedor' color='verde' onClick={handleButtonClick} className="rounded w-full" />
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
          <Modal title={editingProveedor ? 'Actualizar Proveedor' : 'Crear Proveedor'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProveedorFormComponent
                initialValues={editingProveedor || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProveedorComponent;