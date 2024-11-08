import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import UsuarioFormComponent from './UsuarioFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUsuariosAndCargos, addUsuario, updateUsuario } from '../../slices/usuarioSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';

// Definición de interfaces
interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: string;
}

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  contrasenna: string;
  cargo_id: string | Cargo;
  rol_id: string;
}

interface UsuarioFormData {
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  contrasenna: string;
  cargo_id: string;
  rol_id: string;
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

const UsuariosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { usuarios, cargos, loading, error } = useSelector((state: RootState) => state.usuario);

  useEffect(() => {
    dispatch(fetchUsuariosAndCargos());
  }, [dispatch]);

  const handleSubmit = (data: UsuarioFormData) => {
    if (editingUsuario) {
      dispatch(updateUsuario({ id: editingUsuario.id, ...data }));
    } else {
      dispatch(addUsuario(data));
    }
    setIsModalOpen(false);
    setEditingUsuario(null);
  };

  const handleEdit = (usuario: Usuario) => {
    const usuarioConCargoIdString = {
      ...usuario,
      cargo_id: typeof usuario.cargo_id === 'object' ? usuario.cargo_id.id : usuario.cargo_id,
    };
    setEditingUsuario(usuarioConCargoIdString);
    setIsModalOpen(true);
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingUsuario(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(null);
  };

  const tableData = {
    headers: ["nombres", "apellidos", "dni", "usuario", "cargo", "rol_id", "opciones"],
    rows: usuarios.map(usuario => ({
      cargo: typeof usuario.cargo_id === 'object' ? usuario.cargo_id.nombre : '', // Obtener nombre si cargo_id es objeto
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      dni: usuario.dni,
      usuario: usuario.usuario,
      rol_id: usuario.rol_id,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(usuario)}></Button>
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
        <h1 className="text-2xl font-bold">Usuarios</h1>

        <div className="flex items-center space-x-2">
          <Button text='Nuevo Usuario' color='verde' onClick={handleButtonClick} className="rounded w-full" />
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

      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUsuario ? 'Actualizar Usuario' : 'Crear Usuario'}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <UsuarioFormComponent
                initialValues={editingUsuario ? {
                  ...editingUsuario,
                  cargo_id: typeof editingUsuario.cargo_id === 'object' ? editingUsuario.cargo_id.id : editingUsuario.cargo_id
                } : undefined}
                onSubmit={handleSubmit}
                cargos={cargos}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsuariosPage;