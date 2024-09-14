import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import RecursoFormComponent from './RecursoFormComponent';
import { LIST_RECURSOS_QUERY, ADD_RECURSO_MUTATION, UPDATE_RECURSO_MUTATION } from '../../services/recursoService';

const RecursosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<any | null>(null);

  const { loading, error, data, refetch } = useQuery(LIST_RECURSOS_QUERY);
  const [addRecurso] = useMutation(ADD_RECURSO_MUTATION);
  const [updateRecurso] = useMutation(UPDATE_RECURSO_MUTATION);

  const handleSubmit = async (formData: any) => {
    if (editingRecurso) {
      await updateRecurso({
        variables: {
          updateRecursoId: editingRecurso.id,
          ...formData
        }
      });
    } else {
      await addRecurso({ variables: formData });
    }
    setIsModalOpen(false);
    setEditingRecurso(null);
    refetch();
  };

  const handleEdit = (recurso: any) => {
    setEditingRecurso(recurso);
    setIsModalOpen(true);
  };

  const handleButtonClick = () => {
    setEditingRecurso(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecurso(null);
  };

  const tableData = useMemo(() => {
    if (!data) return { headers: [], rows: [] };

    const getNameById = (list: any[], id: string) => {
      const item = list.find(item => item.id === id);
      return item ? item.nombre : 'N/A';
    };

    const getClasificacionNombre = (id: string) => {
      const findClasificacion = (clasificaciones: any[], targetId: string): any => {
        for (const clasificacion of clasificaciones) {
          if (clasificacion.id === targetId) {
            return clasificacion;
          }
          if (clasificacion.childs && clasificacion.childs.length > 0) {
            const childResult = findClasificacion(clasificacion.childs, targetId);
            if (childResult) {
              return { ...childResult, parent: clasificacion };
            }
          }
        }
        return null;
      };

      const clasificacion = findClasificacion(data.listClasificacionRecurso, id);
      if (clasificacion) {
        if (clasificacion.parent) {
          return `${clasificacion.parent.nombre} > ${clasificacion.nombre}`;
        }
        return clasificacion.nombre;
      }
      return 'N/A';
    };

    return {
      headers: ["codigo", "nombre", "descripcion", "cantidad", "unidad_id", "precio_actual", "tipo_recurso_id", "clasificacion_recurso_id", "presupuesto", "opciones"],
      rows: data.listRecurso.map((recurso: any) => ({
        ...recurso,
        unidad_id: getNameById(data.listUnidad, recurso.unidad_id),
        tipo_recurso_id: getNameById(data.listTipoRecurso, recurso.tipo_recurso_id),
        clasificacion_recurso_id: getClasificacionNombre(recurso.clasificacion_recurso_id),
        presupuesto: recurso.presupuesto ? 'Sí' : 'No',
        opciones: (
          <Button text='Editar' color='transp' className='text-black' onClick={() => handleEdit(recurso)}></Button>
        )
      }))
    };
  }, [data]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
          options={{
            unidades: data.listUnidad,
            tiposRecurso: data.listTipoRecurso,
            clasificaciones: data.listClasificacionRecurso
          }}
        />
      </Modal>
    </div>
  );
};

export default RecursosPage;