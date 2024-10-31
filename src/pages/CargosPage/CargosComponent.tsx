import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './CargoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchCargos, addCargo, updateCargo } from '../../slices/cargoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit } from 'react-icons/fi';

// Definimos la interfaz Cargo
interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: number;
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

const CargosComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { cargos, loading, error } = useSelector((state: RootState) => state.cargo);

  useEffect(() => {
    dispatch(fetchCargos());
  }, [dispatch]);

  const handleSubmit = (data: { nombre: string; descripcion: string; gerarquia?: number }) => {
    if (editingCargo) {
      dispatch(updateCargo({ id: editingCargo.id, gerarquia: editingCargo.gerarquia, ...data }));
    } else {
      dispatch(addCargo({ ...data, gerarquia: data.gerarquia || 1 }));
    }
    setIsModalOpen(false);
    setEditingCargo(null);
  };

  const handleEdit = (cargo: Cargo) => {
    setEditingCargo(cargo);
    setIsModalOpen(true);
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingCargo(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCargo(null);
  };

  const tableData = {
    filter: [true, true, false],
    headers: ["nombre", "descripcion", "jerarquia", "opciones"],
    rows: cargos.map(cargo => ({
      ...cargo,
      jerarquia: cargo.gerarquia === 4 ? "Gerencia" :
                 cargo.gerarquia === 3 ? "Supervisor" :
                 cargo.gerarquia === 2 ? "Administrativo" :
                 cargo.gerarquia === 1 ? "Staff" : cargo.gerarquia,
      opciones: (
        <Button text={<FiEdit size={18} className='text-blue-500'/>} color='transp' className='text-black' onClick={() => handleEdit(cargo)}></Button>
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
        className="x text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold">Cargos ☺</h1>


        <div className="flex items-center space-x-2">
          <Button text='Nuevo Cargo' color='verde' onClick={handleButtonClick} className="rounded w-full" />
          {/* <Button
            text={<HiRefresh className={` text-green-500 ${window.innerWidth < 768 ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            color='blanco'
            onClick={() => { }}
            className="rounded w-full"
          /> */}
        </div>

      </motion.div>

      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Seccion C */}
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

      <AnimatePresence>
        {isModalOpen && (
          <Modal title={editingCargo ? 'Actualizar Cargo' : 'Crear Cargo'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <FormComponent
                initialValues={editingCargo || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CargosComponent;