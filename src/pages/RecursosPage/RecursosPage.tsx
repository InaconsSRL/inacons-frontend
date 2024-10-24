import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import { fetchRecursos, fetchListData, addRecurso, updateRecurso } from '../../slices/recursoSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit } from 'react-icons/fi';
import ImageCarousel from '../../components/IMG/ImageCarousel';
import BulkUploadComponent from './BulkUploadComponent';
import NewRecursosPage from './NewRecursosForm';
import { RootState, AppDispatch } from '../../store/store';

// Definición de interfaces
interface Recurso {
  id?: string;
  codigo: string;
  nombre: string;
  clasificacion_recurso_id: string;
  tipo_recurso_id: string;
  tipo_costo_recurso_id: string;
  vigente: boolean;
  unidad_id: string;
  descripcion: string;
  imagenes: { id: string; file: string }[];
  precio_actual: number,
}

interface RecursoAdd {
  codigo: string;
  nombre: string;
  descripcion: string;
  unidad_id: string;
  precio_actual: number,  
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
  tipo_costo_recurso_id: string;
  vigente: boolean;
  imagenes: { id: string; file: string }[];
}

interface RecursoUpdate {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  unidad_id: string;
  precio_actual: number,  
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
  tipo_costo_recurso_id: string;
  vigente: boolean;
  imagenes: { id: string; file: string }[];
}

interface Unidad {
  id: string;
  nombre: string;
}

interface TipoRecurso {
  id: string;
  nombre: string;
}

interface TipoCostoRecurso {
  id: string;
  nombre: string;
}

interface ClasificacionRecurso {
  id: string;
  nombre: string;
  childs?: ClasificacionRecurso[];
  parent?: ClasificacionRecurso;
}

interface RecursoFormOptions {
  unidades: Unidad[];
  tiposRecurso: TipoRecurso[];
  clasificaciones: ClasificacionRecurso[];
  tipoCostoRecursos: TipoCostoRecurso[];
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
  tipo_costo_recurso_id: '',
  vigente: false,
  unidad_id: '',
  descripcion: '',
  imagenes: [],
  precio_actual: 0,
}

const RecursosPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { recursos, listData, loading, error } = useSelector((state: RootState) => state.recurso);
  const [carouselImages, setCarouselImages] = useState<{ id: string; file: string }[] | null>(null);
  const [isModalOpenBulkResources, setIsModalOpenBulkResources] = useState(false);
  const [isModalOpenNewRecursos, setIsModalOpenNewRecursos] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<Recurso>(recursoInicial);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchRecursos());
    dispatch(fetchListData());
  }, [dispatch]);

  useEffect(() => {
    setIsEditing(editingRecurso !== recursoInicial);
  }, [editingRecurso]);

  console.log("isEditing", isEditing)

  const handleSubmit = async (formData: RecursoAdd | RecursoUpdate): Promise<(Recurso & { id: string; codigo: string }) | undefined> => {
    try {
      let result: Recurso | undefined;
      if ('id' in formData) {
        const action = await dispatch(updateRecurso(formData as RecursoUpdate));
        if (updateRecurso.fulfilled.match(action)) {
          result = action.payload as Recurso;
        }
        setIsModalOpenNewRecursos(false);
      } else {
        const action = await dispatch(addRecurso(formData as RecursoAdd));
        if (addRecurso.fulfilled.match(action)) {
          result = action.payload as Recurso;
        }
      }
      setEditingRecurso(recursoInicial);
      return result && result.id && result.codigo
        ? { ...result, id: result.id, codigo: result.codigo }
        : undefined;
    } catch (error) {
      console.error('Error al guardar el recurso:', error);
      return undefined;
    }
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
    if (!recursos || !listData) return { headers: [], rows: [] };

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

      const clasificacion = findClasificacion(listData.listClasificacionRecurso, id);
      if (clasificacion) {
        if (clasificacion.parent) {
          return `${clasificacion.parent.nombre} > ${clasificacion.nombre}`;
        }
        return clasificacion.nombre;
      }
      return 'N/A';
    };

    console.log(recursos[0])

    return {
      filter: [true, true, true, true, true, true, true, true, true,true, true, false, false],
      headers: ["fecha", "vigente", "codigo", "nombre", "descripcion", "cantidad", "unidad_id", "precio_actual", "tipo_recurso_id", "tipo_costo_recurso_id","clasificacion_recurso_id",  "imagenes", "opcion"],
      rows: recursos.map((recurso: any) => ({
        ...recurso,
        fecha: new Date(recurso.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) === 'Invalid Date' ? new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date(recurso.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        unidad_id: getNameById(listData.listUnidad, recurso.unidad_id),
        tipo_recurso_id: getNameById(listData.listTipoRecurso, recurso.tipo_recurso_id),
        tipo_costo_recurso_id: getNameById(listData.listTipoCostoRecurso, recurso.tipo_costo_recurso_id),
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
  }, [recursos, listData]);

  const handleOpenCarousel = (images: { id: string; file: string }[]) => {
    setCarouselImages(images);
  };

  const handleCloseCarousel = () => {
    setCarouselImages(null);
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
                unidades: listData?.listUnidad || [],
                tiposRecurso: listData?.listTipoRecurso || [],
                clasificaciones: listData?.listClasificacionRecurso || [],
                tipoCostoRecursos: listData?.listTipoCostoRecurso || []
              } as RecursoFormOptions}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecursosPage;
