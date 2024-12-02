import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './AlmacenFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchAlmacenes, addAlmacen, updateAlmacen, deleteAlmacen } from '../../slices/almacenSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { fetchObras } from '../../slices/obrasSlice';
import { fetchTipoAlmacenes } from '../../slices/tipoAlmacenSlice';

interface Almacen {
  id: string;
  nombre: string;
  ubicacion: string;
  direccion: string;
  estado: boolean;
  obra_id: string;
  tipo_almacen_id: string;
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

const AlmacenesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlmacen, setEditingAlmacen] = useState<Almacen | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { almacenes, loading, error } = useSelector((state: RootState) => state.almacen);
  const { obras } = useSelector((state: RootState) => state.obra);
  const { tipoAlmacenes } = useSelector((state: RootState) => state.tipoAlmacen);

  useEffect(() => {
    const loadInitialData = async () => {
      if (almacenes.length === 0) {
        dispatch(fetchAlmacenes());
      }
      if (obras.length === 0) {
        dispatch(fetchObras());
      }
      if (tipoAlmacenes.length === 0) {
        dispatch(fetchTipoAlmacenes());
      }
    };

    loadInitialData();
  }, [dispatch, almacenes.length, obras.length, tipoAlmacenes.length]);

  const handleSubmit = (data: { 
    nombre: string; 
    ubicacion: string; 
    direccion: string; 
    estado: boolean; 
    obra_id: string; 
    tipo_almacen_id: string; 
  }) => {
    if (editingAlmacen) {
      dispatch(updateAlmacen({ id: editingAlmacen.id, ...data }));
    } else {
      dispatch(addAlmacen(data));
    }
    setIsModalOpen(false);
    setEditingAlmacen(null);
  };

  const handleEdit = (almacen: Almacen) => {
    setEditingAlmacen(almacen);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este almacén?')) {
      dispatch(deleteAlmacen(id));
    }
  };


  const handleButtonClick = () => {
    setEditingAlmacen(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAlmacen(null);
  };

  const tableData = {
    filter: [true, true, true, true, true, true, true, false],
    headers: ["nombre", "ubicacion", "direccion", "estado", "obra", "tipo almacén", "opciones"],
    rows: almacenes.map(almacen => ({
      ...almacen,
      estado: almacen.estado ? "Activo" : "Inactivo",
      obra: obras.find(obra => obra.id === almacen.obra_id)?.nombre || almacen.obra_id,
      "tipo almacén": tipoAlmacenes.find(tipo => tipo.id === almacen.tipo_almacen_id)?.nombre || almacen.tipo_almacen_id,
      opciones: (
        <div className="flex space-x-2">
          <button
            className='text-black'
            onClick={() => handleEdit(almacen)}
          >
            <FiEdit size={18} className='text-blue-500' />

          </button>
          <button
            className='text-black'
            onClick={() => handleDelete(almacen.id)}
          >
            <FiTrash2 size={18} className='text-red-500' />
          </button>
        </div>
      )
    }))
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

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
        <h1 className="text-2xl font-bold">Almacenes</h1>

        <div className="flex items-center space-x-2">
          <Button text='Nuevo Almacén' color='verde' onClick={handleButtonClick} className="rounded w-full" />
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
          <Modal title={editingAlmacen ? 'Actualizar Almacén' : 'Crear Almacén'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <FormComponent
                initialValues={editingAlmacen || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AlmacenesComponent;