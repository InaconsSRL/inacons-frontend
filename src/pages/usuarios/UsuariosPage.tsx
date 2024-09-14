import React, { useState, useEffect } from 'react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import UsuarioFormComponent from './UsuarioFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUsuariosAndCargos, addUsuario, updateUsuario } from '../../slices/usuarioSlice';
import { RootState, AppDispatch } from '../../store/store';

const UsuariosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<any | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { usuarios, cargos, loading, error } = useSelector((state: RootState) => state.usuario);

  useEffect(() => {
    dispatch(fetchUsuariosAndCargos());
  }, [dispatch]);

  const handleSubmit = (data: any) => {
    if (editingUsuario) {
      dispatch(updateUsuario({ id: editingUsuario.id, ...data.value }));
    } else {
      dispatch(addUsuario(data.value));
    }
    setIsModalOpen(false);
    setEditingUsuario(null);
  };

  const handleEdit = (usuario: any) => {
    setEditingUsuario(usuario);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleButtonClick = () => {
    setEditingUsuario(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(null);
  };

  const getCargoNombre = (cargo_id: string) => {
    const cargo = cargos.find(c => c.id === cargo_id);
    return cargo ? cargo.nombre : 'Desconocido';
  };

  const tableData = {
    headers: ["nombres", "apellidos", "dni", "usuario", "cargo", "rol_id", "opciones"],
    rows: usuarios.map(usuario => ({
      ...usuario,
      cargo: getCargoNombre(usuario.cargo_id),
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(usuario)}></Button>
      )
    }))
  };

  return (
    <div className="flex flex-col h-full">
      <div className="x text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tabla de Usuarios</h2>
            <div className="flex items-center space-x-2">
              <Button text='+ Crear Usuario' color='verde' onClick={handleButtonClick} className="rounded">
              </Button>
            </div>
          </div>
          <div className="flex-grow border rounded-lg overflow-hidden">
            <div className="h-full overflow-auto">
              <TableComponent tableData={tableData} />
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UsuarioFormComponent
          initialValues={editingUsuario || undefined}
          onSubmit={handleSubmit}
          cargos={cargos}
        />
      </Modal>
    </div>
  );
};

export default UsuariosPage;