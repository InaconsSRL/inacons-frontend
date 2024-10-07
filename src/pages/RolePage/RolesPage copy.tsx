import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import RoleFormComponent from './RoleFormComponent';
import { LIST_ROLES_AND_MENUS_QUERY, ADD_ROLE_MUTATION, UPDATE_ROLE_MUTATION } from '../../services/roleService';
import LoaderPage from '../../components/Loader/LoaderPage';

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

const RolesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const { loading, error, data, refetch } = useQuery(LIST_ROLES_AND_MENUS_QUERY);
  const [addRole] = useMutation(ADD_ROLE_MUTATION);
  const [updateRole] = useMutation(UPDATE_ROLE_MUTATION);

  const handleSubmit = async (formData) => {
    const { nombre, descripcion, menusPermissions } = formData;
    const menuPermissionInput = menusPermissions.map(mp => ({
      menuID: mp.menuID.id,
      permissions: mp.permissions
    }));

    if (editingRole) {
      await updateRole({
        variables: {
          updateRoleId: editingRole.id,
          nombre,
          descripcion,
          menusPermissions: menuPermissionInput
        }
      });
    } else {
      await addRole({
        variables: {
          nombre,
          descripcion,
          menusPermissions: menuPermissionInput
        }
      });
    }
    setIsModalOpen(false);
    setEditingRole(null);
    refetch();
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error.message}</div>;

  const tableData = {
    headers: ["Nombre", "Descripcion", "Creación", "Acciones"],
    rows: data.listRoles.map(role => ({
      "Nombre": role.nombre,
      "Descripcion": role.descripcion,
      "Creación": new Date(role.createdAt).toLocaleDateString(),
      "Acciones": (
        <Button
          icon={<span>✏️</span>}
          text="Editar"
          color="transp"
          onClick={() => handleEdit(role)}
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
      <motion.div
        className="text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold">Gestión de Roles</h1>
        <Button text='Nuevo Rol' color='verde' onClick={handleAddNew} className="rounded w-auto" />
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
          <Modal title={editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RoleFormComponent
                initialValues={editingRole}
                onSubmit={handleSubmit}
                menus={data.listMenus}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RolesPage;