import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './TipoClasificacionRecursoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchClasificacionesRecurso, addClasificacionRecurso, updateClasificacionRecurso } from '../../slices/tipoClasificacionRecursoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';

interface ClasificacionRecurso {
  __typename: string;
  id: string;
  nombre: string;
  parent_id: string | null;
  childs: ClasificacionRecurso[];
  parent?: ClasificacionRecurso;
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

const TipoClasificacionRecursoComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClasificacionRecurso, setEditingClasificacionRecurso] = useState<ClasificacionRecurso | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { clasificacionesRecurso, loading, error } = useSelector((state: RootState) => state.tipoClasificacionRecurso);

  useEffect(() => {
    dispatch(fetchClasificacionesRecurso());
  }, [dispatch]);

  const handleSubmit = (data: { nombre: string; parentId: string | null }) => {
    if (editingClasificacionRecurso) {
      dispatch(updateClasificacionRecurso({ id: editingClasificacionRecurso.id, ...data }));
    } else {
      dispatch(addClasificacionRecurso(data));
    }
    setIsModalOpen(false);
    setEditingClasificacionRecurso(null);
  };

  const handleEdit = (clasificacionRecurso: ClasificacionRecurso) => {
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

  const getClasificacionNombre = (clasificacion: ClasificacionRecurso): string => {
    let nombre = clasificacion.nombre;
    if (clasificacion.parent) {
      nombre = `${getClasificacionNombre(clasificacion.parent)} > ${nombre}`;
    }
    return nombre;
  };

  const flattenClasificaciones = (clasificaciones: ClasificacionRecurso[], parent?: ClasificacionRecurso): ClasificacionRecurso[] => {
    return clasificaciones.reduce((acc: ClasificacionRecurso[], clasificacion) => {
      const newClasificacion = { ...clasificacion, parent };
      return [
        ...acc,
        newClasificacion,
        ...flattenClasificaciones(clasificacion.childs, newClasificacion)
      ];
    }, []);
  };

  const flatClasificaciones = flattenClasificaciones(clasificacionesRecurso);

  const tableData = {
    headers: ["nombre", "opciones"],
    rows: flatClasificaciones.map(clasificacionRecurso => ({
      ...clasificacionRecurso,
      nombre: getClasificacionNombre(clasificacionRecurso),
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(clasificacionRecurso)}></Button>
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
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TipoClasificacionRecursoComponent;