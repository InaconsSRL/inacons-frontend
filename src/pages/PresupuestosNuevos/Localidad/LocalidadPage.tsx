import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Tables/TableComponent';
import LocalidadForm from './LocalidadForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchLocalidades, addLocalidad, updateLocalidad } from '../../../slices/localidadSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import type { ILocalidad } from '../../../types/PresupuestosTypes';
import { fetchDepartamentos } from '../../../slices/departamentoSlice';
import { fetchProvincias } from '../../../slices/provinciaSlice';
import { fetchDistritos } from '../../../slices/distritoSlice';

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

const LocalidadPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocalidad, setEditingLocalidad] = useState<ILocalidad | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { localidades, status, error } = useSelector((state: RootState) => state.localidades);
  const { departamentos } = useSelector((state: RootState) => state.departamentos);
  const { provincias } = useSelector((state: RootState) => state.provincias);
  const { distritos } = useSelector((state: RootState) => state.distritos);

  useEffect(() => {
    dispatch(fetchLocalidades());
    dispatch(fetchDepartamentos());
    dispatch(fetchProvincias());
    dispatch(fetchDistritos());
  }, [dispatch]);

  const handleSubmit = async (data: Omit<ILocalidad, 'id_localidad'>) => {
    if (editingLocalidad) {
      await dispatch(updateLocalidad({
        ...data,
        id_localidad: editingLocalidad.id_localidad
      }));
    } else {
      await dispatch(addLocalidad(data));
    }
    
    // Recargar todos los datos necesarios
    await Promise.all([
      dispatch(fetchLocalidades()),
      dispatch(fetchDepartamentos()),
      dispatch(fetchProvincias()),
      dispatch(fetchDistritos())
    ]);
    
    setIsModalOpen(false);
    setEditingLocalidad(null);
  };

  if (status === 'loading') return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const tableData = {
    filterSelect: [true, false, false, false, false, false, false, false],
    filter: [false, true, true, true, true, false, false, false],
    headers: [
      "id_localidad",
      "nombre_localidad", 
      "distrito",
      "provincia",
      "departamento",
      // "id_departamento",
      // "id_provincia",
      // "id_distrito",
      "opciones"
    ],
    rows: localidades.map(localidad => {
      const distrito = distritos.find(d => d.id_distrito === localidad.id_distrito);
      const provincia = provincias.find(p => p.id_provincia === distrito?.id_provincia);
      const departamento = departamentos.find(d => d.id_departamento === provincia?.id_departamento);

      return {
        departamento: departamento?.nombre_departamento || 'N/A',
        provincia: provincia?.nombre_provincia || 'N/A',
        distrito: distrito?.nombre_distrito || 'N/A',
        nombre_localidad: localidad.nombre_localidad,
        id_localidad: localidad.id_localidad,
        // id_departamento: departamento?.id_departamento || 'N/A',
        // id_provincia: provincia?.id_provincia || 'N/A',
        // id_distrito: localidad.id_distrito,
        opciones: (
          <Button 
            text='Editar' 
            color='transp' 
            className='text-black' 
            onClick={() => {
              setEditingLocalidad(localidad);
              setIsModalOpen(true);
            }}
          />
        )
      };
    })
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
      <motion.div className="text-white pb-4 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Localidades</h1>
        <Button 
          text='Nueva Localidad' 
          color='verde' 
          onClick={() => setIsModalOpen(true)} 
          className="rounded w-full" 
        />
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <div className="flex-grow border rounded-lg overflow-hidden">
            <TableComponent tableData={tableData} />
          </div>
        </main>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal 
            title={editingLocalidad ? 'Editar Localidad' : 'Nueva Localidad'} 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingLocalidad(null);
            }}
          >
            <LocalidadForm
              initialValues={editingLocalidad || undefined}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LocalidadPage;
