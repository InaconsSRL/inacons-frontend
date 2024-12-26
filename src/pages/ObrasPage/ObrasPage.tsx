import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './ObrasFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { addObra, updateObra } from '../../slices/obrasSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit } from 'react-icons/fi';

// Definimos las interfaces
interface TipoObra {
  id: string;
  nombre: string;
}

interface ObraBase {
  titulo: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  direccion: string;
  estado: string;
}

interface ObraInput extends ObraBase {
  tipoId: string;
}

interface Obra extends ObraBase {
  id: string;
  tipo_id: TipoObra;
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

  const handleSubmit = (data: ObraInput) => {
    if (editingObra) {
      // Asegurarse de que todos los campos necesarios estén presentes
      const updateData = {
        id: editingObra.id,
        titulo: data.titulo,
        nombre: data.nombre,
        descripcion: data.descripcion,
        ubicacion: data.ubicacion,
        direccion: data.direccion,
        estado: data.estado,
        tipoId: data.tipoId
      };
      dispatch(updateObra(updateData));
    } else {
      dispatch(addObra(data));
    }
    setIsModalOpen(false);
    setEditingObra(null);
  };

  const handleEdit = (obra: Obra) => {
    setEditingObra({ ...obra });
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

    filter: [true, true, true, true, true, true, false],
    headers: ["titulo", "nombre", "descripcion", "ubicacion", "direccion", "estado", "opciones"],
    rows: obras.map(obra => ({
      titulo: obra.titulo || '',
      nombre: obra.nombre || '',
      descripcion: obra.descripcion || '',
      ubicacion: obra.ubicacion || '',
      direccion: obra.direccion || '',
      estado: obra.estado || '',
      opciones: (
        <Button 
          text={<FiEdit size={18} className='text-blue-500'/>} 
          color='transp' 
          className='text-black' 
          onClick={() => handleEdit(obra)}
        />
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
                initialValues={editingObra ? {
                  titulo: editingObra.titulo || '',
                  nombre: editingObra.nombre || '',
                  descripcion: editingObra.descripcion || '',
                  ubicacion: editingObra.ubicacion || '',
                  direccion: editingObra.direccion || '',
                  estado: editingObra.estado || '',
                  tipoId: editingObra.tipo_id?.id || ''
                } : undefined}
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