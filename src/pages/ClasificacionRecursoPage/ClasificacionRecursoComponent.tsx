import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './ClasificacionRecursoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchClasificacionesRecurso, addClasificacionRecurso, updateClasificacionRecurso } from '../../slices/clasificacionRecursoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';

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

interface ClasificacionRecurso {
  id: string;
  nombre: string;
  parent_id: string | null;
  childs?: ClasificacionRecurso[];
}

interface HomogenizedClasificacion {
  id: string;
  nombre: string;
  parent_id: string | null;
  nivel: number;
}

function homogenizeClasificaciones(clasificaciones: ClasificacionRecurso[]): HomogenizedClasificacion[] {
  const result: HomogenizedClasificacion[] = [];

  function processClasificacion(clasificacion: ClasificacionRecurso, parent_id: string | null = null, nivel: number = 0) {
    const prefix = nivel === 0 ? '' : '> '.repeat(nivel);
    result.push({
      id: clasificacion.id,
      nombre: `${prefix}${clasificacion.nombre}`,
      parent_id: parent_id,
      nivel: nivel
    });

    if (clasificacion.childs && clasificacion.childs.length > 0) {
      clasificacion.childs.forEach(child => processClasificacion(child, clasificacion.id, nivel + 1));
    }
  }

  clasificaciones.forEach(clasificacion => processClasificacion(clasificacion));

  return result;
}

const ClasificacionRecursoComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClasificacionRecurso, setEditingClasificacionRecurso] = useState<HomogenizedClasificacion | null>(null);
  const [homogenizedClasificaciones, setHomogenizedClasificaciones] = useState<HomogenizedClasificacion[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { clasificacionesRecurso, loading, error } = useSelector((state: RootState) => state.clasificacionRecurso);

  console.log(clasificacionesRecurso)
  useEffect(() => {
    dispatch(fetchClasificacionesRecurso());
  }, [dispatch]);

  useEffect(() => {
    if (clasificacionesRecurso.length > 0) {
      const homogenized = homogenizeClasificaciones(clasificacionesRecurso);
      setHomogenizedClasificaciones(homogenized);
      console.log(homogenized);
    }
  }, [clasificacionesRecurso]);

  const handleSubmit = (data: { nombre: string; parent_id: string | null }) => {
    if (editingClasificacionRecurso) {
      dispatch(updateClasificacionRecurso({ id: editingClasificacionRecurso.id, ...data }));
    } else {
      dispatch(addClasificacionRecurso(data));
    }
    setIsModalOpen(false);
    setEditingClasificacionRecurso(null);
  };

  const handleEdit = (clasificacionRecurso: HomogenizedClasificacion) => {
    setEditingClasificacionRecurso(clasificacionRecurso);
    setIsModalOpen(true);
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingClasificacionRecurso(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClasificacionRecurso(null);
  };

  const tableData = {
    headers: ["nombre", "opciones"],
    rows: homogenizedClasificaciones.map(clasificacion => ({
      ...clasificacion,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(clasificacion)}></Button>
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
        <h1 className="text-2xl font-bold">Clasificaciones de Recurso ☺</h1>
      </motion.div>

      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div
            className="flex justify-between items-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold">Tabla de Clasificaciones de Recurso</h2>
            <div className="flex items-center space-x-2">
              <Button text='+ Crear' color='verde' onClick={handleButtonClick} className="rounded" />
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
          <Modal title={editingClasificacionRecurso ? 'Actualizar Clasificación de Recurso' : 'Crear Clasificación de Recurso'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <FormComponent
                initialValues={editingClasificacionRecurso || undefined}
                onSubmit={handleSubmit}
                clasificaciones={homogenizedClasificaciones}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClasificacionRecursoComponent;