import React, { useState, useEffect } from 'react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import FormComponent from '../../components/FormComponent/FormComponent'; // Asegúrate de importar el nuevo componente

import { useDispatch, useSelector } from 'react-redux';
import { fetchCargos, createCargo, updateCargo } from '../../slices/cargoSlice';
import { RootState, AppDispatch } from '../../store/store';

const CargosComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState<{ id: string; nombre: string; descripcion: string } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { cargos, loading, error } = useSelector((state: RootState) => state.cargo);

  useEffect(() => {
    dispatch(fetchCargos());
  }, [dispatch]);

  const handleSubmit = (data: { nombre: string; descripcion: string }) => {
    const { nombre, descripcion } = data.value;
    if (editingCargo) {
      dispatch(updateCargo({ updateCargoId: editingCargo.id, nombre, descripcion }));
    } else {
      dispatch(createCargo({ nombre, descripcion }));
    }
    setIsModalOpen(false);
    setEditingCargo(null);
  };
  

  const handleEdit = (cargo: { id: string; nombre: string; descripcion: string }) => {
    setEditingCargo(cargo);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleButtonClick = () => {
    setEditingCargo(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCargo(null);
  };

  const tableData = {
    headers: ["id", "descripcion", "nombre", "opciones"],
    rows: cargos.map(cargo => ({
      ...cargo,
      opciones: (
        <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(cargo)}></Button>
      )
    }))
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="x text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cargos ☺</h1>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tabla de Cargos</h2>
            <div className="flex items-center space-x-2">
              <Button text='+ Crear Cargo' color='verde' onClick={handleButtonClick} className="rounded">
                
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
          initialValues={editingCargo || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default CargosComponent;