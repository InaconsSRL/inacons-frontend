import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import RoleFormComponent from './RoleFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchRolesAndMenus, addRole, updateRole } from '../../slices/roleSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';

interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  menusPermissions: MenuPermission[];
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface Menu {
  id: string;
  nombre: string;
  slug: string;
  posicion: number;
}

interface MenuPermission {
  menuID: Menu;
  permissions: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
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

const RolesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { roles, menus, loading, error } = useSelector((state: RootState) => state.role);

  useEffect(() => {
    dispatch(fetchRolesAndMenus());
  }, [dispatch]);

  const handleSubmit = (data: { nombre: string; descripcion: string; menusPermissions: MenuPermission[] }) => {
    if (editingRole) {
      dispatch(updateRole({ id: editingRole.id, ...data }));
    } else {
      dispatch(addRole(data));
    }
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const tableData = {
    headers: ["nombre", "descripcion", "opciones"],
    rows: roles.map(role => ({
      ...role,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(role)}></Button>
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
        className="text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-blue-800">Roles y Permisos</h1>

        <div className="flex items-center space-x-2">
          <Button text='Nuevo Rol' color='verde' onClick={handleButtonClick} className="rounded w-full" />
          <motion.button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Actualizar
          </motion.button>
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
          <Modal title={editingRole ? 'Actualizar Rol' : 'Crear Rol'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RoleFormComponent
                initialValues={editingRole || undefined}
                onSubmit={handleSubmit}
                menus={menus}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RolesComponent;