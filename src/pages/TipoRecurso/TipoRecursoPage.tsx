import React, { useState, useEffect } from 'react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from './TipoRecursoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTiposRecurso, addTipoRecurso, updateTipoRecurso } from '../../slices/tipoRecursoSlice';
import { RootState, AppDispatch } from '../../store/store';

const TipoRecursoComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipoRecurso, setEditingTipoRecurso] = useState<{ id: string; nombre: string } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { tiposRecurso, loading, error } = useSelector((state: RootState) => state.tipoRecurso);

  useEffect(() => {
    dispatch(fetchTiposRecurso());
  }, [dispatch]);

  const handleSubmit = (data: { nombre: string }) => {

    if (editingTipoRecurso) {
      dispatch(updateTipoRecurso({ id: editingTipoRecurso.id, ...data.value }));
    } else {
      dispatch(addTipoRecurso(data.value));
    }
    setIsModalOpen(false);
    setEditingTipoRecurso(null);
  };

  const handleEdit = (tipoRecurso: { id: string; nombre: string }) => {
    setEditingTipoRecurso(tipoRecurso);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleButtonClick = () => {
    setEditingTipoRecurso(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTipoRecurso(null);
  };

  const tableData = {
    headers: ["nombre", "opciones"],
    rows: tiposRecurso.map(tipoRecurso => ({
      ...tipoRecurso,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(tipoRecurso)}></Button>
      )
    }))
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="x text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tipos de Recurso ☺</h1>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tabla de Tipos de Recurso</h2>
            <div className="flex items-center space-x-2">
              <Button text='+ Crear Tipo de Recurso' color='verde' onClick={handleButtonClick} className="rounded">
                
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
        <FormComponent
          initialValues={editingTipoRecurso || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default TipoRecursoComponent;