import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import RecursoFormComponent from './RecursoFormComponent';
import { LIST_RECURSOS_QUERY, ADD_RECURSO_MUTATION, UPDATE_RECURSO_MUTATION } from '../../services/recursoService';
import LoaderPage from '../../components/Loader/LoaderPage';

// Definición de interfaces
interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
  presupuesto: boolean;
}

interface Unidad {
  id: string;
  nombre: string;
}

interface TipoRecurso {
  id: string;
  nombre: string;
}

interface ClasificacionRecurso {
  id: string;
  nombre: string;
  childs?: ClasificacionRecurso[];
  parent?: ClasificacionRecurso;
}

interface QueryData {
  listRecurso: Recurso[];
  listUnidad: Unidad[];
  listTipoRecurso: TipoRecurso[];
  listClasificacionRecurso: ClasificacionRecurso[];
}

interface RecursoFormData {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
  presupuesto?: boolean;
}

interface RecursoFormOptions {
  unidades: Unidad[];
  tiposRecurso: TipoRecurso[];
  clasificaciones: ClasificacionRecurso[];
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

const RecursosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null);

  const { loading, error, data, refetch } = useQuery<QueryData>(LIST_RECURSOS_QUERY);
  const [addRecurso] = useMutation(ADD_RECURSO_MUTATION);
  const [updateRecurso] = useMutation(UPDATE_RECURSO_MUTATION);

  const handleSubmit = async (formData: RecursoFormData) => {
    if (editingRecurso) {
      await updateRecurso({
        variables: {
          updateRecursoId: editingRecurso.id,
          ...formData
        }
      });
    } else {
      await addRecurso({ variables: formData });
    }
    setIsModalOpen(false);
    setEditingRecurso(null);
    refetch();
  };

  const handleEdit = (recurso: Recurso) => {
    setEditingRecurso(recurso);
    setIsModalOpen(true);
  };

  const handleButtonClick = () => {
    setEditingRecurso(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecurso(null);
  };

  const tableData = useMemo(() => {
    if (!data) return { headers: [], rows: [] };

    const getNameById = (list: { id: string; nombre: string }[], id: string) => {
      const item = list.find(item => item.id === id);
      return item ? item.nombre : 'N/A';
    };

    const getClasificacionNombre = (id: string) => {
      const findClasificacion = (clasificaciones: ClasificacionRecurso[], targetId: string): ClasificacionRecurso | null => {
        for (const clasificacion of clasificaciones) {
          if (clasificacion.id === targetId) {
            return clasificacion;
          }
          if (clasificacion.childs && clasificacion.childs.length > 0) {
            const childResult = findClasificacion(clasificacion.childs, targetId);
            if (childResult) {
              return { ...childResult, parent: clasificacion };
            }
          }
        }
        return null;
      };

      const clasificacion = findClasificacion(data.listClasificacionRecurso, id);
      if (clasificacion) {
        if (clasificacion.parent) {
          return `${clasificacion.parent.nombre} > ${clasificacion.nombre}`;
        }
        return clasificacion.nombre;
      }
      return 'N/A';
    };

    return {
      headers: ["codigo", "nombre", "descripcion", "cantidad", "unidad_id", "precio_actual", "tipo_recurso_id", "clasificacion_recurso_id", "presupuesto", "opciones"],
      rows: data.listRecurso.map((recurso: Recurso) => ({
        ...recurso,
        unidad_id: getNameById(data.listUnidad, recurso.unidad_id),
        tipo_recurso_id: getNameById(data.listTipoRecurso, recurso.tipo_recurso_id),
        clasificacion_recurso_id: getClasificacionNombre(recurso.clasificacion_recurso_id),
        presupuesto: recurso.presupuesto ? 'Sí' : 'No',
        opciones: (
          <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(recurso)}></Button>
        )
      }))
    };
  }, [data]);

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error.message}</motion.div>;

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
        <h1 className="text-2xl font-bold">Recursos ☺</h1>
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
            <h2 className="text-xl font-bold">Tabla de Recursos</h2>
            <div className="flex items-center space-x-2">
              <Button text='+ Crear Recurso' color='verde' onClick={handleButtonClick} className="rounded" />
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
          <Modal title={editingRecurso ? 'Actualizar Recurso' : 'Crear Recurso'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RecursoFormComponent
                initialValues={editingRecurso || undefined}
                onSubmit={handleSubmit}
                options={{
                  unidades: data?.listUnidad || [],
                  tiposRecurso: data?.listTipoRecurso || [],
                  clasificaciones: data?.listClasificacionRecurso || []
                } as RecursoFormOptions}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecursosPage;