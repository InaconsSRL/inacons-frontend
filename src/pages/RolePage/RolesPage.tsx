import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import RolesFormComponent from './RolesFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchRolesAndMenus, addRole, updateRole } from '../../slices/rolesSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import MenusPage from '../MenusPage.tsx/MenusPage';

interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  menusPermissions: {
    menuID: string;
    permissions: {
      ver: boolean;
      crear: boolean;
      editar: boolean;
      eliminar: boolean;
    };
  }[];
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
  const [isModalMenusOpen, setIsModalMenusOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { menus, roles, loading, error } = useSelector((state: RootState) => state.role);

  console.log(roles)
  console.log(menus)

  useEffect(() => {
    dispatch(fetchRolesAndMenus());
  }, [dispatch]);

  const handleMenusView = () => {
    setIsModalMenusOpen(true);
  };

  const handleSubmit = (data: Role) => {
    if (editingRole) {
      dispatch(updateRole(data));
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

  if (loading ) return <LoaderPage />;
  if (error ) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  const handleButtonClick = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalMenusOpen(false);
    setIsModalOpen(false);
    setEditingRole(null);
  };


  const tableData = {
    headers: ["nombre", "descripcion", "opciones"],
    rows: roles.map((role ) => ({
      id: role.id,
      nombre: role.nombre,
      descripcion: role.descripcion,
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
        className="x text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-white">Roles y Permisos</h1>

        <div className="flex items-center space-x-2">
          <Button text='Nuevo Rol' color='verde' onClick={handleButtonClick} className="rounded w-full" />
          <Button
            className="rounded w-full"
            color='blanco'
            onClick={handleMenusView}
            text='Lista de Accesos' />          
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
              <TableComponent tableData={ tableData } />
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
              <RolesFormComponent
                menus = {menus}
                initialValues={editingRole || undefined}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Modal>
        )}
        {isModalMenusOpen && (
          <Modal title={'Todas Las Obras'} isOpen={isModalMenusOpen} onClose={handleCloseModal}>
            <MenusPage />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RolesComponent;