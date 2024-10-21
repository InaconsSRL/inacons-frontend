import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { FiX } from 'react-icons/fi';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import LoaderPage from '../../../components/Loader/LoaderPage';
import Modal from '../../../components/Modal/Modal';

// Definimos la interfaz Obra
// const pageVariants = {
//   initial: { opacity: 0, y: 20 },
//   in: { opacity: 1, y: 0 },
//   out: { opacity: 0, y: -20 }
// };

// const pageTransition = {
//   type: 'tween',
//   ease: 'anticipate',
//   duration: 0.5
// };

const ADD_REQUERIMIENTO_MUTATION = gql`
  mutation AddRequerimientoConRecursos($usuario_id: String!, $recursos: [RecursosInput!]!, $sustento: String, $obra_id: String) {
  addRequerimientoConRecursos(usuario_id: $usuario_id, recursos: $recursos, sustento: $sustento, obra_id: $obra_id) {
    id
    usuario_id
    presupuesto_id
    fecha_solicitud
    estado
    sustento
    obra_id
  }
}
`;

const UPDATE_REQUERIMIENTO_MUTATION = gql`
mutation UpdateMasiveRequerimientoConRecursos($requerimiento_id: ID!, $recursos: [RecursosUpdateMasive]) {
  updateMasiveRequerimientoConRecursos(requerimiento_id: $requerimiento_id, recursos: $recursos) {
    id
    requerimiento_id
    recurso_id
    nombre
    codigo
    cantidad
    cantidad_aprobada
    estado
    tipo_solicitud
    presupuestado
  }
}
`;

const DELETE_REQUERIMIENTO_RECURSO_MUTATION = gql`
mutation DeleteRequerimientoRecurso($deleteRequerimientoRecursoId: ID!) {
  deleteRequerimientoRecurso(id: $deleteRequerimientoRecursoId) {
    id
  }
}
`




interface Recurso {
  id?: string;
  recurso_id: string;
  codigo: string;
  nombre: string;
  cantidad: number;
  // Añade las propiedades faltantes
  cantidad_aprobada?: number;
  estado?: string;
  presupuestado?: string;
  tipo_solicitud?: string;
  requerimiento_id?: string;
  __typename?: string;
}

interface FormData {
  obra_id: string;
  usuario_id: string;
  sustento: string;
  recursos: Recurso[];
}

interface RecursoListItem {
  id: string;
  codigo: string;
  nombre: string;
}

interface Obras{
  id: string;
  nombre: string;
  titulo: string;
  descripcion: string
}

interface RequerimientoFormProps {
  recursosList: RecursoListItem[];
  obras: Obras[];
  onClose: () => void;
  requerimiento?: FormData & { id?: string };
}

interface FocusedResource {
  index: number;
  field: 'codigo' | 'nombre';
  value: string;
}

const RequerimientoForm: React.FC<RequerimientoFormProps> = ({ recursosList, onClose, obras, requerimiento }) => {
  console.log("Requerimiento:", requerimiento)
  const [addRequerimiento, { loading: loadingAdd, error: errorAdd }] = useMutation(ADD_REQUERIMIENTO_MUTATION);
  const [updateRequerimiento, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_REQUERIMIENTO_MUTATION);
  const [deleteRequerimientoRecurso, { loading: loadingDelete, error: errorDelete }] = useMutation(DELETE_REQUERIMIENTO_RECURSO_MUTATION);
  
  const [filteredResources, setFilteredResources] = useState<RecursoListItem[]>([]);
  const [focusedResource, setFocusedResource] = useState<FocusedResource | null>(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<FormData>(() => {
    if (requerimiento && requerimiento.id) {
      return {
        ...requerimiento,
        recursos: [...requerimiento.recursos, { recurso_id: '', codigo: '', nombre: '', cantidad: 0 }]
      };
    } else {
      return {
        obra_id: '',
        usuario_id: user.id ?? '',
        sustento: '',
        recursos: [{ recurso_id: '', codigo: '', nombre: '', cantidad: 0 }]
      };
    }
  });

  useEffect(() => {
    if (focusedResource) {
      const { field, value } = focusedResource;
      if (value.length >= 2) {
        const filtered = recursosList.filter(recurso =>
          recurso[field].toLowerCase().includes(value.toLowerCase()) &&
          !formData.recursos.some(selected => selected.recurso_id === recurso.id)
        );
        setFilteredResources(filtered);
      } else {
        setFilteredResources([]);
      }
    }
  }, [focusedResource, recursosList, formData.recursos]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number | null = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newRecursos = [...formData.recursos];
      newRecursos[index] = { ...newRecursos[index], [name]: name === 'cantidad' ? Number(value) : value };
      setFormData({ ...formData, recursos: newRecursos });
      if (name === 'codigo' || name === 'nombre') {
        setFocusedResource({ index, field: name, value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleResourceSelection = (index: number, selectedResource: RecursoListItem) => {
    const newRecursos = [...formData.recursos];
    newRecursos[index] = {
      ...newRecursos[index],
      recurso_id: selectedResource.id,
      codigo: selectedResource.codigo,
      nombre: selectedResource.nombre
    };
    newRecursos.push({ recurso_id: '', codigo: '', nombre: '', cantidad: 0 });
    setFormData({ ...formData, recursos: newRecursos });
    setFilteredResources([]);
    setFocusedResource(null);
  };

  const removeRow = async (index: number) => {

    const newRecursos = formData.recursos.filter((_, i) => i !== index);
       setFormData({
         ...formData,
         recursos: newRecursos
       });
       console.log(formData)
   
       if (requerimiento && requerimiento.id) {
         try {
           const recursoToDelete = formData.recursos[index];
           if (recursoToDelete.id) {
             await deleteRequerimientoRecurso({
               variables: { deleteRequerimientoRecursoId: recursoToDelete.id }
             });
           }
         } catch (error) {
           console.error('Error al eliminar el recurso:', error);
           setModalMessage(`Error al eliminar el recurso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
           setModalIsOpen(true);
           return;
         }
       }
   };

  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Filtrar recursos vacíos o con cantidad 0
    const validRecursos = formData.recursos.filter(
      recurso => recurso.recurso_id && recurso.cantidad > 0
    );
    if (validRecursos.length === 0) {
      setModalMessage("Por favor, añade al menos un recurso con cantidad mayor a 0.");
      setModalIsOpen(true);
      return;
    }

    try {
      console.log(validRecursos)
      const recursosModificados = validRecursos.map(({ nombre, codigo, ...rest }) => ({
        ...rest,
        presupuestado: "",
        tipo_solicitud: "",
      }));

      const recursosModificadosUpdate = validRecursos.map(({ nombre, codigo, cantidad_aprobada, estado, presupuestado, id, tipo_solicitud, requerimiento_id, __typename, ...rest }) => ({
        ...rest,
      }));

      console.log("RecursosModificados", recursosModificados)

      let result;

      if (requerimiento && requerimiento.id) {
        // Si hay un requerimiento con ID, actualizamos el requerimiento existente
        result = await updateRequerimiento({
          variables: {
            requerimiento_id: requerimiento.id,
            recursos: recursosModificadosUpdate,
            // Aquí podrías incluir más campos si son necesarios para la actualización
          },
        });
        console.log('Requerimiento actualizado:', result.data.updateRequerimiento);
      } else {
        // Si no hay requerimiento con ID, creamos uno nuevo
        result = await addRequerimiento({
          variables: {
            usuario_id: formData.usuario_id,
            sustento: formData.sustento,
            obra_id: formData.obra_id,
            recursos: recursosModificados,
          },
        });
        console.log('Requerimiento agregado:', result.data.addRequerimientoConRecursos);
      }

      // Resetear el formulario
      setFormData({
        obra_id: "",
        usuario_id: "",
        sustento: "",
        recursos: [{ recurso_id: '', codigo: '', nombre: '', cantidad: 0 }],
      });

      // Mostrar un mensaje de éxito
      setModalMessage(requerimiento && requerimiento.id ? "Requerimiento actualizado con éxito" : "Requerimiento agregado con éxito");
      setModalIsOpen(true);

      // Cerrar el formulario
      onClose();
    } catch (error) {
      console.error('Error al procesar el requerimiento:', error);
      setModalMessage(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setModalIsOpen(true);
    }
  };


  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  useEffect(() => {
    console.log(formData)
  }, [formData]);

  if (loadingAdd || loadingUpdate || loadingDelete) return <LoaderPage />;
  if (errorAdd) return <div>Error al crear un nuevo requerimiento: {errorAdd.message}</div>;
  if (errorUpdate) return <div>Error al actualizar el requerimiento: {errorUpdate.message}</div>;
  if (errorDelete) return <div>Error al eliminar el recurso del requerimiento: {errorDelete.message}</div>;


  return (
    <motion.div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-800">
      <motion.div className="text-white p-4 flex items-center justify-between border-b border-blue-700">
        <motion.h1 className="text-xl font-bold">
          Requerimiento
        </motion.h1>
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-md m-4">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/95 overflow-hidden rounded-lg shadow-lg">
          <h3 className='text-xs text-gray-500 mb-2'>Userid: {formData.usuario_id.slice(0, 5)}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              <select
                name="obra_id"
                value={formData.obra_id}
                onChange={handleSelectChange}
                className="px-2 py-1 border border-gray-300 rounded text-sm col-span-4 md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione una obra</option>
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.nombre}
                  </option>
                ))}
              </select>
              <textarea
                name="sustento"
                value={formData.sustento}
                onChange={handleInputChange}
                placeholder="Sustento"
                className="w-full p-2 border border-gray-300 rounded text-sm col-span-8 md:col-span-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={1}
                required
                autoComplete="off"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-blue-900">Recursos</h3>
            <div className='overflow-x-auto max-h-80'>
              {formData.recursos.map((recurso, index) => (
                <div key={recurso.recurso_id || index} className="grid mb-2 grid-cols-12 gap-2">
                  <input
                    type="text"
                    name="codigo"
                    value={recurso.codigo}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Código"
                    autoComplete="off"
                    className="px-2 py-1 border border-gray-300 rounded text-sm col-span-2 md:col-span-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="nombre"
                    value={recurso.nombre}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Nombre"
                    autoComplete="off"
                    className="px-2 py-1 border border-gray-300 rounded text-sm col-span-7 md:col-span-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    name="cantidad"
                    value={recurso.cantidad}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Cantidad"
                    className="px-2 py-1 border border-gray-300 rounded text-sm col-span-2 md:col-span-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="px-2 bg-red-500 text-white flex justify-center items-center rounded col-span-1"
                  >
                    <FiX className='h-4 w-4' />
                  </button>
                </div>
              ))}

              {focusedResource && filteredResources.length > 0 && (
                <div
                  className="border rounded max-h-40 overflow-y-auto bg-white shadow-lg"
                  style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 150,
                    zIndex: 50,
                  }}
                >
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleResourceSelection(focusedResource.index, resource)}
                    >
                      {resource.codigo} - {resource.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='flex justify-between mt-4'>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition duration-300"
              >
                Enviar Requerimiento
              </button>
            </div>
          </form>
        </main>
        <Modal
        isOpen={modalIsOpen}
        title="◈ ATENCION ◈"
        onClose={() => setModalIsOpen(false)}
        children={modalMessage}
      />
      </motion.div>
    </motion.div>
  );
};

export default RequerimientoForm;
