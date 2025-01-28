import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Tables/TableComponent';
import DepartamentoForm from './DepartamentoForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartamentos, addDepartamento, updateDepartamento } from '../../../slices/departamentoSlice';
import { RootState, AppDispatch } from '../../../store/store';
import LoaderPage from '../../../components/Loader/LoaderPage';
import type { IDepartamento } from '../../../types/PresupuestosTypes';

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

const DepartamentoPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState<IDepartamento | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { departamentos, loading, error } = useSelector((state: RootState) => state.departamentos);

  useEffect(() => {
    dispatch(fetchDepartamentos());
  }, [dispatch]);

  const handleSubmit = (data: Omit<IDepartamento, 'id_departamento'>) => {
    if (editingDepartamento) {
      dispatch(updateDepartamento({ ...data, id_departamento: editingDepartamento.id_departamento }));
    } else {
      dispatch(addDepartamento(data));
    }
    setIsModalOpen(false);
    setEditingDepartamento(null);
  };

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const tableData = {
    filterSelect: [true,false,false],
    filter: [false,true,false],
    headers: ["id","nombre_departamento", "opciones"],
    rows: departamentos.map(departamento => ({
      nombre_departamento: departamento.nombre_departamento,
      ubigeo: departamento.ubigeo,
      id: departamento.id_departamento,
      opciones: (
        <Button 
          text='Editar' 
          color='transp' 
          className='text-black' 
          onClick={() => {
            setEditingDepartamento(departamento);
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
        <h1 className="text-2xl font-bold">Departamentos</h1>
        <Button 
          text='Nuevo Departamento' 
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
            title={editingDepartamento ? 'Editar Departamento' : 'Nuevo Departamento'} 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingDepartamento(null);
            }}
          >
            <DepartamentoForm
              initialValues={editingDepartamento || undefined}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DepartamentoPage;
