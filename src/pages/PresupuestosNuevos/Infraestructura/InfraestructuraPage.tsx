import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Tables/TableComponent';
import InfraestructuraForm from './InfraestructuraForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInfraestructuras, addInfraestructura, updateInfraestructura } from '../../../slices/infraestructuraSlice';
import { RootState, AppDispatch } from '../../../store/store';
import LoaderPage from '../../../components/Loader/LoaderPage';
import type { IInfraestructura } from '../../../types/PresupuestosTypes';

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

const InfraestructuraPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfraestructura, setEditingInfraestructura] = useState<IInfraestructura | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { infraestructuras, status, error } = useSelector((state: RootState) => state.infraestructuras);

  useEffect(() => {
    dispatch(fetchInfraestructuras());
  }, [dispatch]);

  const handleSubmit = async (data: Omit<IInfraestructura, 'id_infraestructura'>) => {
    if (editingInfraestructura) {
      await dispatch(updateInfraestructura({
        ...data,
        id_infraestructura: editingInfraestructura.id_infraestructura
      }));
    } else {
      await dispatch(addInfraestructura(data));
    }
    
    await dispatch(fetchInfraestructuras());
    setIsModalOpen(false);
    setEditingInfraestructura(null);
  };

  if (status === 'loading') return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const tableData = {
    filterSelect: [true, false, false, false, false],
    filter: [false, true, true, true, false],
    headers: [
      "id_infraestructura",
      "nombre_infraestructura",
      "tipo_infraestructura",
      "descripcion",
      "opciones"
    ],
    rows: infraestructuras.map(infraestructura => ({
      id_infraestructura: infraestructura.id_infraestructura,
      nombre_infraestructura: infraestructura.nombre_infraestructura,
      tipo_infraestructura: infraestructura.tipo_infraestructura,
      descripcion: infraestructura.descripcion,
      opciones: (
        <Button 
          text='Editar' 
          color='transp' 
          className='text-black' 
          onClick={() => {
            setEditingInfraestructura(infraestructura);
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
        <h1 className="text-2xl font-bold">Infraestructuras</h1>
        <Button 
          text='Nueva Infraestructura' 
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
            title={editingInfraestructura ? 'Editar Infraestructura' : 'Nueva Infraestructura'} 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingInfraestructura(null);
            }}
          >
            <InfraestructuraForm
              initialValues={editingInfraestructura || undefined}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InfraestructuraPage;
