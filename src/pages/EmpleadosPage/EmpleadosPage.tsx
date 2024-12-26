import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import { fetchEmpleados, addEmpleado, updateEmpleado } from '../../slices/empleadoSlice';
import { fetchCargos } from '../../slices/cargoSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit } from 'react-icons/fi';
import { RootState, AppDispatch } from '../../store/store';
import NewEmpleadoForm from './NewEmpleadoForm';

// Importar interfaces del slice
import type { Empleado } from '../../slices/empleadoSlice';

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

interface UpdateEmpleadoParams {
  id: string;
  dni?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  telefono_secundario?: string;
  cargo_id?: string;
}

interface AddEmpleadoParams {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  cargo_id: string;
}

interface EmpleadoFormData {
  id?: string;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  telefono_secundario?: string;
  cargo_id: string;
}

const empleadoInicial: EmpleadoFormData = {
  dni: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  telefono_secundario: '',
  cargo_id: '',
};

const EmpleadosPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { empleados, loading, error } = useSelector((state: RootState) => state.empleado);
  const { cargos } = useSelector((state: RootState) => state.cargo);
  const [isModalOpenNewEmpleado, setIsModalOpenNewEmpleado] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<EmpleadoFormData>(empleadoInicial);

  useEffect(() => {
    dispatch(fetchEmpleados());
    dispatch(fetchCargos());
  }, [dispatch]);

  const handleSubmit = async (formData: EmpleadoFormData) => {
    try {
      let result;
      if (formData.id) {
        const updateParams: UpdateEmpleadoParams = {
          id: formData.id,
          dni: formData.dni,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          telefono_secundario: formData.telefono_secundario,
          cargo_id: formData.cargo_id
        };
        result = await dispatch(updateEmpleado(updateParams)).unwrap();
      } else {
        const addParams: AddEmpleadoParams = {
          dni: formData.dni,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          cargo_id: formData.cargo_id
        };
        result = await dispatch(addEmpleado(addParams)).unwrap();
      }
      setIsModalOpenNewEmpleado(false);
      return result;
    } catch (error) {
      console.error('Error:', error);
      return undefined;
    }
  };

  const handleEdit = (empleado: Empleado) => {
    const empleadoForm: EmpleadoFormData = {
      id: empleado.id,
      dni: empleado.dni,
      nombres: empleado.nombres,
      apellidos: empleado.apellidos,
      telefono: empleado.telefono,
      telefono_secundario: empleado.telefono_secundario,
      cargo_id: empleado.cargo_id.id  // Ahora accedemos a cargo.id
    };
    setEditingEmpleado(empleadoForm);
    setIsModalOpenNewEmpleado(true);
  };

  const handleNew = () => {
    setEditingEmpleado(empleadoInicial);
    setIsModalOpenNewEmpleado(true);
  };

  const handleCloseModal = () => {
    setIsModalOpenNewEmpleado(false);
    setEditingEmpleado(empleadoInicial);
  };

  const tableData = useMemo(() => {
    if (!empleados) return { headers: [], rows: [] };

    return {
      filter: [true, true, true, true, true, true, false],
      headers: ["id", "nombres", "apellidos", "telefono", "telefono_secundario", "cargo", "opciones"],
      rows: empleados.map((empleado) => ({
        id: empleado.id,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        telefono: empleado.telefono,
        telefono_secundario: empleado.telefono_secundario || 'No registrado',
        cargo: empleado.cargo_id.nombre,  // Ahora accedemos directamente al nombre del cargo
        opciones: (
          <Button 
            icon={<FiEdit />} 
            text="" 
            color='transp' 
            className='text-blue-500' 
            onClick={() => handleEdit(empleado)}
          />
        )
      }))
    };
  }, [empleados]);

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      className="flex flex-col h-full"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div className="text-white pb-4 px-0 md:px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empleados</h1>
        <div className="flex items-center space-x-2">
          <Button 
            text='Nuevo Empleado' 
            color='verde' 
            onClick={handleNew} 
            className="rounded w-full"
          />
        </div>
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div className="flex-grow border rounded-lg overflow-hidden">
            <div className="h-full overflow-auto">
              <TableComponent tableData={tableData} />
            </div>
          </motion.div>
        </main>
      </motion.div>

      <AnimatePresence>
        {isModalOpenNewEmpleado && (
          <Modal 
            title='Empleado' 
            isOpen={isModalOpenNewEmpleado} 
            onClose={handleCloseModal}
          >
            <NewEmpleadoForm
              initialValues={editingEmpleado}
              onSubmit={handleSubmit}
              cargos={cargos}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmpleadosPage;
