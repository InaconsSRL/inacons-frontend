import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Tables/TableComponent';
import PresupuestosForm from './PresupuestosForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPresupuestos, addPresupuesto, updatePresupuesto } from '../../../slices/presupuestosSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchProyectos } from '../../../slices/proyectosSlice';
import { IPresupuesto } from '../../../types/PresupuestosTypes';

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

const PresupuestosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState<IPresupuesto | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { presupuestos } = useSelector((state: RootState) => state.presupuestos);
  const { proyectos } = useSelector((state: RootState) => state.proyectos);

  useEffect(() => {
    dispatch(fetchPresupuestos());
    dispatch(fetchProyectos());
  }, [dispatch]);

  const handleSubmit = (data: Omit<IPresupuesto, 'id_presupuesto'>) => {
    if (editingPresupuesto) {
      dispatch(updatePresupuesto({ ...data, id_presupuesto: editingPresupuesto.id_presupuesto }));
    } else {
      dispatch(addPresupuesto(data));
    }
    setIsModalOpen(false);
    setEditingPresupuesto(null);
  };

  const tableData = {
    filterSelect: [false, true, true, true, true, true], // Añadido un nuevo filtro para proyecto
    filter: [true, false, false, false, false,false], // Añadido un nuevo filtro para proyecto
    headers: ["nombre_presupuesto", "fecha_creacion", "plazo", "ppto_base", "ppto_oferta", "proyecto", "opciones"],
    rows: presupuestos.map(presupuesto => ({
      nombre_presupuesto: presupuesto.nombre_presupuesto,
      fecha_creacion: presupuesto.fecha_creacion,
      plazo: `${presupuesto.plazo} días`,
      ppto_base: presupuesto.ppto_base.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }),
      ppto_oferta: presupuesto.ppto_oferta.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }),
      proyecto: proyectos.find(proyecto => proyecto.id_proyecto === presupuesto.id_proyecto)?.nombre_proyecto || 'Sin proyecto',
      opciones: (
        <Button 
          text='Editar' 
          color='transp' 
          className='text-black' 
          onClick={() => {
            setEditingPresupuesto(presupuesto);
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
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <Button 
          text='Nuevo Presupuesto' 
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
            title={editingPresupuesto ? 'Editar Presupuesto' : 'Nuevo Presupuesto'} 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingPresupuesto(null);
            }}
          >
            <PresupuestosForm
              initialValues={editingPresupuesto || undefined}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PresupuestosPage;
