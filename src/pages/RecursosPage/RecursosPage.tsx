import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import { LIST_RECURSOS_QUERY, ADD_RECURSO_MUTATION, UPDATE_RECURSO_MUTATION } from '../../services/recursoService';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit } from 'react-icons/fi';
import ImageCarousel from '../../components/IMG/ImageCarousel';
import BulkUploadComponent from './BulkUploadComponent';
import NewRecursosPage from './NewRecursosForm';
// Definición de interfaces
interface Recurso {
  id?: string;
  codigo: string;
  nombre: string;
  clasificacion_recurso_id: string;
  tipo_recurso_id: string;
  tipo_costo_id: string;
  vigente: boolean;
  unidad_id: string;
  descripcion: string;
  imagenes: { id: string; file: string }[]; 
  costo_promedio: string;
  valor_ultima_compra: string;
  precio_actual: number,
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

const recursoInicial = {
  codigo: '',
  nombre: '',
  clasificacion_recurso_id: '',
  tipo_recurso_id: '',
  tipo_costo_id: '',
  vigente: false,
  unidad_id: '',
  descripcion: '',
  imagenes: [],
  costo_promedio: '',
  valor_ultima_compra: '',
  precio_actual: 0,
}
const RecursosPage: React.FC = () => {
  const [carouselImages, setCarouselImages] = useState<{ id: string; file: string }[] | null>(null);
  const [isModalOpenBulkResources, setIsModalOpenBulkResources] = useState(false);
  const [isModalOpenNewRecursos, setIsModalOpenNewRecursos] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<Recurso>(recursoInicial);

  const { loading, error, data, refetch } = useQuery<QueryData>(LIST_RECURSOS_QUERY);
  const [addRecurso] = useMutation(ADD_RECURSO_MUTATION);
  const [updateRecurso] = useMutation(UPDATE_RECURSO_MUTATION);

  const handleSubmit = async (formData: Recurso) => {
    if (editingRecurso) {
      await updateRecurso({
        variables: {
          updateRecursoId: editingRecurso.id,
          ...formData
        }
      });
    } else {
      console.log(formData)
      await addRecurso({
        variables: {
          precioActual: 0,
          ...formData
        }
      });
    }
    setEditingRecurso(recursoInicial);
    refetch();
  };

  const handleEditNewRecursos = (recurso: Recurso) => {
    setEditingRecurso(recurso);
    setIsModalOpenNewRecursos(true);
  };

  const handleButtonNewRecursoClick = () => {
    setEditingRecurso(recursoInicial);
    setIsModalOpenNewRecursos(true);
  };

  const handleButtonEnvioMasivoClick = () => {
    setIsModalOpenBulkResources(true);
  };

  const handleCloseModal = () => {
    setIsModalOpenBulkResources(false);
    setIsModalOpenNewRecursos(false)
    setEditingRecurso(recursoInicial);
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
      filter: [true, true, true, true, true, true, true, true, true, false],
      headers: ["codigo", "nombre", "descripcion", "cantidad", "unidad_id", "precio_actual", "clasificacion_recurso_id", "tipo_recurso_id", "imagenes", "opcion"],
      rows: data.listRecurso.map((recurso: Recurso) => ({
        ...recurso,
        unidad_id: getNameById(data.listUnidad, recurso.unidad_id),
        tipo_recurso_id: getNameById(data.listTipoRecurso, recurso.tipo_recurso_id),
        clasificacion_recurso_id: getClasificacionNombre(recurso.clasificacion_recurso_id),
        imagenes: recurso.imagenes && recurso.imagenes.length > 0 ? (
          <div className="flex items-center cursor-pointer" onClick={() => handleOpenCarousel(recurso.imagenes)}>
            <img
              src={recurso.imagenes[0].file}
              alt={recurso.nombre}
              className="object-cover w-8 h-8"
            />
            {recurso.imagenes.length > 1 && (
              <span className="ml-2 text-sm text-gray-400 underline"
              >
                +{recurso.imagenes.length - 1} más
              </span>
            )}
          </div>
        ) : 'Sin imagen',
        opcion: (
          <>
            <Button icon={<FiEdit />} text="" color='transp' className='text-blue-500' onClick={() => handleEditNewRecursos(recurso)}></Button>
          </>
        )
      }))
    };
  }, [data]);


  const handleOpenCarousel = (images: { id: string; file: string }[]) => {
    console.log(images)
    setCarouselImages(images);
  };

  const handleCloseCarousel = () => {
    setCarouselImages(null);
  };

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
        className="x text-white pb-4 px-0 md:px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold">Recursos</h1>



        <div className="flex items-center space-x-2">
          <Button text='EnvioMasivo' color='verde' onClick={handleButtonEnvioMasivoClick} className='rounded w-auto bg-emerald-500' />
        </div>
        <div className="flex items-center space-x-2">
        </div>
        <div className="flex items-center space-x-2">
          <Button text='Nuevo NewRecurso' color='verde' onClick={handleButtonNewRecursoClick} className="rounded w-full" />
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

      <AnimatePresence key="carouselImages">
        {carouselImages && (
          <Modal isOpen onClose={handleCloseCarousel}>
            <ImageCarousel images={carouselImages} alt="Recurso" />
          </Modal>
        )}
      </AnimatePresence>
      
      <AnimatePresence key="bulkResources">
        {isModalOpenBulkResources && (
          <Modal title='Carga Masiva de Recursos' isOpen={isModalOpenBulkResources} onClose={handleCloseModal}>
            <BulkUploadComponent />
          </Modal>
        )}
      </AnimatePresence>
      
      <AnimatePresence key="newRecursos">
        {isModalOpenNewRecursos && (
          <Modal title='Recursos' isOpen={isModalOpenNewRecursos} onClose={handleCloseModal}>
            <NewRecursosPage
              initialValues={editingRecurso}
              onSubmit={handleSubmit}
              options={{
                unidades: data?.listUnidad || [],
                tiposRecurso: data?.listTipoRecurso || [],
                clasificaciones: data?.listClasificacionRecurso || []
              } as RecursoFormOptions}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecursosPage;
