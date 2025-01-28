import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Tables/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchTitulos, deleteTitulo } from '../../../slices/tituloSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import type { ITitulo } from '../../../types/PresupuestosTypes';

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

const TitulosPage: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tituloToDelete, setTituloToDelete] = useState<ITitulo | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { titulos, status, error } = useSelector((state: RootState) => state.titulos);

  useEffect(() => {
    dispatch(fetchTitulos());
  }, [dispatch]);

  const handleDelete = async (titulo: ITitulo) => {
    setTituloToDelete(titulo);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (tituloToDelete) {
      await dispatch(deleteTitulo(tituloToDelete.id_titulo));
      await dispatch(fetchTitulos());
      setIsDeleteModalOpen(false);
      setTituloToDelete(null);
    }
  };

  if (status === 'loading') return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const tableData = {
    filterSelect: [true, false, false, false],
    filter: [false, true, true, false],
    headers: [
      "id_titulo",
      "nombre_titulo",
      "descripcion",
      "opciones"
    ],
    rows: titulos.map(titulo => ({
      id_titulo: titulo.id_titulo,
      nombre_titulo: titulo.descripcion,
      descripcion: titulo.descripcion,
      opciones: (
        <div className="flex gap-2">
          <Button 
            text='Eliminar' 
            color='rojo' 
            className='text-white' 
            onClick={() => handleDelete(titulo)}
          />
        </div>
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
        <h1 className="text-2xl font-bold">Títulos</h1>
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <div className="flex-grow border rounded-lg overflow-hidden">
            <TableComponent tableData={tableData} />
          </div>
        </main>
      </motion.div>

      <AnimatePresence>

        {isDeleteModalOpen && (
          <Modal
            title="Confirmar Eliminación"
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setTituloToDelete(null);
            }}
          >
            <div className="p-4">
              <p className="mb-4">¿Está seguro que desea eliminar este título?</p>
              <div className="flex justify-end gap-2">
                <Button
                  text="Cancelar"
                  color="rojo"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setTituloToDelete(null);
                  }}
                />
                <Button
                  text="Eliminar"
                  color="rojo"
                  onClick={confirmDelete}
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TitulosPage;