import React, { useState, useEffect } from 'react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import RecursoFormComponent from './RecursoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchRecursos, addRecurso, updateRecurso } from '../../slices/recursoSlice';
import { RootState, AppDispatch } from '../../store/store';

const RecursosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { recursos, loading, error } = useSelector((state: RootState) => state.recurso);

  useEffect(() => {
    dispatch(fetchRecursos());
  }, [dispatch]);

  const handleSubmit = (data: RecursoFormData) => {
    if (editingRecurso) {
      dispatch(updateRecurso({ id: editingRecurso.id, ...data.value }));
    } else {
      dispatch(addRecurso(data.value));
    }
    setIsModalOpen(false);
    setEditingRecurso(null);
  };

  const handleEdit = (recurso: Recurso) => {
    setEditingRecurso(recurso);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleButtonClick = () => {
    setEditingRecurso(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecurso(null);
  };

  const tableData = {
    headers: ["codigo", "nombre", "descripcion", "cantidad", "unidad", "precio_actual", "tipo_recurso", "clasificacion_recurso", "opciones"],
    rows: recursos.map(recurso => ({
      ...recurso,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(recurso)}></Button>
      )
    }))
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="x text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recursos ☺</h1>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tabla de Recursos</h2>
            <div className="flex items-center space-x-2">
              <Button text='+ Crear Recurso' color='verde' onClick={handleButtonClick} className="rounded">
                
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
        <RecursoFormComponent
          initialValues={editingRecurso || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default RecursosPage;