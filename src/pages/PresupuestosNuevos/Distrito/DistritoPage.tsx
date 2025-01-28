import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Tables/TableComponent';
import DistritoForm from './DistritoForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDistritos, addDistrito, updateDistrito } from '../../../slices/distritoSlice';
import { RootState, AppDispatch } from '../../../store/store';
import LoaderPage from '../../../components/Loader/LoaderPage';
import type { IDistrito } from '../../../types/PresupuestosTypes';
import { fetchProvincias } from '../../../slices/provinciaSlice';
import { fetchDepartamentos } from '../../../slices/departamentoSlice';

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

const DistritoPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDistrito, setEditingDistrito] = useState<IDistrito | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { distritos, loading, error } = useSelector((state: RootState) => state.distritos);
  const { provincias } = useSelector((state: RootState) => state.provincias);
  const { departamentos } = useSelector((state: RootState) => state.departamentos);

  useEffect(() => {
    dispatch(fetchDistritos());
  }, [dispatch]);

  const handleSubmit = async (data: Omit<IDistrito, 'id_distrito'>) => {
    if (editingDistrito) {
      dispatch(updateDistrito({ ...data, id_distrito: editingDistrito.id_distrito }));
    } else {
      dispatch(addDistrito(data));
    }

    // Recargar todos los datos necesarios
        await Promise.all([
          dispatch(fetchDepartamentos()),
          dispatch(fetchProvincias()),
          dispatch(fetchDistritos())
        ]);

    setIsModalOpen(false);
    setEditingDistrito(null);
  };

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const getProvinciaName = (id_provincia: string) => {
    const provincia = provincias.find(p => p.id_provincia === id_provincia);
    return provincia?.nombre_provincia || 'No encontrado';
  };

  const getDepartamentoName = (id_provincia: string) => {
    const provincia = provincias.find(p => p.id_provincia === id_provincia);
    const departamento = departamentos.find(d => d.id_departamento === provincia?.id_departamento);
    return departamento?.nombre_departamento || 'No encontrado';
  };

  const tableData = {
    filterSelect: [true, false, false, false, false, false],
    filter: [false, true, true, true, false],
    headers: ["id", "nombre_distrito", "provincia", "departamento", "opciones"],
    rows: distritos.map(distrito => ({
      nombre_distrito: distrito.nombre_distrito,
      id: distrito.id_distrito,
      provincia: getProvinciaName(distrito.id_provincia),
      departamento: getDepartamentoName(distrito.id_provincia),
      opciones: (
        <Button 
          text='Editar' 
          color='transp' 
          className='text-black' 
          onClick={() => {
            setEditingDistrito(distrito);
            setIsModalOpen(true);
          }}
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
      <motion.div className="text-white pb-4 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Distritos</h1>
        <Button 
          text='Nuevo Distrito' 
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
            title={editingDistrito ? 'Editar Distrito' : 'Nuevo Distrito'} 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingDistrito(null);
            }}
          >
            <DistritoForm
              initialValues={editingDistrito || undefined}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DistritoPage;
