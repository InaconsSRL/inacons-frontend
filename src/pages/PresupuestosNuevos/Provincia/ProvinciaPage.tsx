import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Tables/TableComponent';
import ProvinciaForm from './ProvinciaForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProvincias, addProvincia, updateProvincia } from '../../../slices/provinciaSlice';
import { RootState, AppDispatch } from '../../../store/store';
import LoaderPage from '../../../components/Loader/LoaderPage';
import type { IProvincia } from '../../../types/PresupuestosTypes';
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

const ProvinciaPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvincia, setEditingProvincia] = useState<IProvincia | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { provincias, loading, error } = useSelector((state: RootState) => state.provincias);
  const { departamentos } = useSelector((state: RootState) => state.departamentos);

  useEffect(() => {
    dispatch(fetchProvincias());
    dispatch(fetchDepartamentos());  // Agregamos fetch de departamentos
  }, [dispatch]);

  const handleSubmit = async (data: Omit<IProvincia, 'id_provincia'>) => {
    if (editingProvincia) {
      dispatch(updateProvincia({ ...data, id_provincia: editingProvincia.id_provincia }));
    } else {
      dispatch(addProvincia(data));
    }

    // Recargar todos los datos necesarios
        await Promise.all([
          dispatch(fetchDepartamentos()),
          dispatch(fetchProvincias()),
        ]);

    setIsModalOpen(false);
    setEditingProvincia(null);
  };

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const tableData = {
    filterSelect: [true, false, false, false],
    filter: [false, true, true, false],  // Habilitamos filtro para departamento
    headers: ["id", "nombre_provincia", "departamento", "opciones"],
    rows: provincias.map(provincia => ({
      nombre_provincia: provincia.nombre_provincia,
      id: provincia.id_provincia,
      departamento: departamentos.find(d => d.id_departamento === provincia.id_departamento)?.nombre_departamento || 'N/A',
      opciones: (
        <Button 
          text='Editar' 
          color='transp' 
          className='text-black' 
          onClick={() => {
            setEditingProvincia(provincia);
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
        <h1 className="text-2xl font-bold">Provincias</h1>
        <Button 
          text='Nueva Provincia' 
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
            title={editingProvincia ? 'Editar Provincia' : 'Nueva Provincia'} 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingProvincia(null);
            }}
          >
            <ProvinciaForm
              initialValues={editingProvincia || undefined}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProvinciaPage;
