import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { FiX } from 'react-icons/fi';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { fetchObras } from '../../slices/obrasSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import Modal from '../../components/Modal/Modal';


// Definimos la interfaz Obra
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

const ADD_REQUERIMIENTO_MUTATION = gql`
  mutation AddRequerimientoConRecursos($usuarioId: String!, $recursos: [RecursosInput!]!, $sustento: String, $obraId: String) {
  addRequerimientoConRecursos(usuario_id: $usuarioId, recursos: $recursos, sustento: $sustento, obra_id: $obraId) {
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

// const UPDATE_REQUERIMIENTO_MUTATION = gql`
//   mutation UpdateRequerimiento($updateRequerimientoId: ID!, $usuarioId: String, $presupuestoId: String, $fechaSolicitud: String, $estado: String, $sustento: String, $obraId: String) {
//   updateRequerimiento(id: $updateRequerimientoId, usuario_id: $usuarioId, presupuesto_id: $presupuestoId, fecha_solicitud: $fechaSolicitud, estado: $estado, sustento: $sustento, obra_id: $obraId) {
//     id
//     usuario_id
//     presupuesto_id
//     fecha_solicitud
//     estado
//     sustento
//     obra_id
//   }
// }
// `;

interface Recurso {
  recurso_id: string;
  codigo: string;
  nombre: string;
  cantidad: number;
}

interface FormData {
  obraId: string;
  usuarioId: string;
  sustento: string;
  recursos: Recurso[];
}

interface RecursoListItem {
  id: string;
  codigo: string;
  nombre: string;
}

interface PedirRequerimientoProps {
  recursosList: RecursoListItem[];
  onClose: () => void;
}

interface FocusedResource {
  index: number;
  field: 'codigo' | 'nombre';
  value: string;
}

const RequerimientoForm: React.FC<PedirRequerimientoProps> = ({ recursosList, onClose }) => {
  const [addRequerimiento, { loading: loadingAdd, error: errorAdd }] = useMutation(ADD_REQUERIMIENTO_MUTATION);
  //const [updateRequerimiento, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_REQUERIMIENTO_MUTATION);
  const [filteredResources, setFilteredResources] = useState<RecursoListItem[]>([]);
  const [focusedResource, setFocusedResource] = useState<FocusedResource | null>(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { obras, loading, error } = useSelector((state: RootState) => state.obra);





  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<FormData>({
    obraId: '',
    usuarioId: user.id ?? '',
    sustento: '',
    recursos: [{ recurso_id: '', codigo: '', nombre: '', cantidad: 0 }]
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
  useEffect(() => {
    dispatch(fetchObras());
  }, [dispatch]);

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

  const removeRow = (index: number) => {
    const newRecursos = formData.recursos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      recursos: newRecursos
    });
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const recursosModificados = validRecursos.map(({ nombre, codigo, ...rest }) => ({
        ...rest,
        presupuestado: "",
        tipo_solicitud: "",
      }));

      const { data } = await addRequerimiento({
        variables: {
          usuarioId: formData.usuarioId,
          sustento: formData.sustento,
          obraId: formData.obraId,
          recursos: recursosModificados,
        },
      });

      setFormData({
        obraId: "",
        usuarioId: "",
        sustento: "",
        recursos: [{ recurso_id: '', codigo: '', nombre: '', cantidad: 0 }],
      });

      console.log('Requerimiento agregado:', data.addRequerimiento);
      onClose();
    } catch (error) {
      console.error('Error al agregar requerimiento:', error);
    }
  };


  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //if (loadingAdd || loadingUpdate) return <LoaderPage />;
  if (loadingAdd) return <LoaderPage />;
  if (errorAdd) return <div>Error en requerimientos: {errorAdd.message}</div>;
  //if (errorUpdate) return alert(`Error en recursos: {errorUpdate.message}`);
  if (loading) return <LoaderPage />;
  if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;




  return (
    <motion.div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-800">
      <motion.div className="text-white p-4 flex items-center justify-between border-b border-blue-700">
        <motion.h1 className="text-xl font-bold">
          Requerimiento
        </motion.h1>
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-md m-4">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/95 overflow-hidden rounded-lg shadow-lg">
          <h3 className='text-xs text-gray-500 mb-2'>Userid: {formData.usuarioId.slice(0, 5)}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              <select
                name="obraId"
                value={formData.obraId}
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