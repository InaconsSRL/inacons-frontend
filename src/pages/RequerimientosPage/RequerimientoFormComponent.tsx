import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2, FiSave, FiX, FiPlus } from 'react-icons/fi';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRecursos } from '../../slices/recursoSlice';
import { fetchObras } from '../../slices/obrasSlice';
import { addRequerimientoRecurso, deleteRequerimientoRecurso, fetchRequerimientoRecursos } from '../../slices/requerimientoRecursoSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import Modal from '../../components/Modal/Modal';

interface RequerimientoFormProps {
  initialValues?: {
    id?: string;
    usuario_id: string;
    obra_id: string;
    sustento: string;
    codigo?: string;
  };
  onSubmit: (data: { usuario_id: string; obra_id: string; sustento: string }) => void;
}

interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  unidad_id: string;
  cantidad: number;
}

// interface RequerimientoRecurso {
//   id: string;
//   requerimiento_id: string;
//   recurso_id: string;
//   codigo: string;
//   nombre: string;
//   cantidad: number;
//   unidad_id: string;
// }

const RequerimientoFormComponent: React.FC<RequerimientoFormProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { recursos, loading: loadingRecursos } = useSelector((state: RootState) => state.recurso);
  const { obras, loading: loadingObras } = useSelector((state: RootState) => state.obra);
  const { requerimientoRecursos, loading: loadingReqRecursos } = useSelector((state: RootState) => state.requerimientoRecurso);
  const user = useSelector((state: RootState) => state.user);

  console.log(obras)

  // Estados para el formulario de requerimiento
  const [isEditingRequerimiento, setIsEditingRequerimiento] = useState(!initialValues?.codigo);
  const [requerimientoForm, setRequerimientoForm] = useState({
    usuario_id: initialValues?.usuario_id || user.id || '',
    obra_id: initialValues?.obra_id || '',
    sustento: initialValues?.sustento || ''
  });

  // Estados para la gestión de recursos
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecursos, setFilteredRecursos] = useState<Recurso[]>([]);
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
  const [cantidad, setCantidad] = useState(1);

  // Estados para el modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (recursos.length === 0) dispatch(fetchRecursos());
    if (obras.length === 0) dispatch(fetchObras());
    if (initialValues?.id) dispatch(fetchRequerimientoRecursos(initialValues.id));
  }, []);

  // Manejadores para el formulario de requerimiento
  const handleRequerimientoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(requerimientoForm);
      setIsEditingRequerimiento(false);
    } catch (error) {
      console.log(error);
      setModalMessage('Error al guardar el requerimiento');
      setModalIsOpen(true);
    }
  };

  const handleRequerimientoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setRequerimientoForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Manejadores para la gestión de recursos
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = recursos.filter(recurso => 
      recurso.codigo.includes(term) ||
      recurso.nombre.toLowerCase().includes(term)
    );
    setFilteredRecursos(filtered);
  };

  const handleAddRecurso = async () => {
    if (!selectedRecurso || !initialValues?.id) return;

    try {
      await dispatch(addRequerimientoRecurso({
        requerimiento_id: initialValues.id,
        recurso_id: selectedRecurso.id,
        cantidad
      })).unwrap();

      setSelectedRecurso(null);
      setCantidad(1);
      setSearchTerm('');
    } catch (error) {
      console.log(error);
      setModalMessage('Error al agregar el recurso');
      setModalIsOpen(true);
    }
  };

  const handleDeleteRecurso = async (recursoId: string) => {
    try {
      await dispatch(deleteRequerimientoRecurso(recursoId)).unwrap();
    } catch (error) {
      console.log(error);
      setModalMessage('Error al eliminar el recurso');
      setModalIsOpen(true);
    }
  };

  if (loadingRecursos || loadingObras || loadingReqRecursos) {
    return <LoaderPage />;
  }

  return (
    <motion.div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-800">
      {/* Sección del Requerimiento */}
      <motion.div className="bg-white rounded-lg shadow-lg m-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-blue-900">Datos del Requerimiento</h2>
            {initialValues?.codigo && (
              <div className="text-sm text-gray-600">
                ID: {initialValues.id} | Código: {initialValues.codigo}
              </div>
            )}
          </div>
          {initialValues?.codigo && (
            <button
              onClick={() => setIsEditingRequerimiento(!isEditingRequerimiento)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isEditingRequerimiento ? <FiSave size={20} /> : <FiEdit2 size={20} />}
            </button>
          )}
        </div>

        <form onSubmit={handleRequerimientoSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="obra_id"
              value={requerimientoForm.obra_id}
              onChange={handleRequerimientoInputChange}
              disabled={!isEditingRequerimiento}
              className="p-2 border rounded"
              required
            >
              <option value="">Seleccione Obra</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>{obra.nombre}</option>
              ))}
            </select>

            <textarea
              name="sustento"
              value={requerimientoForm.sustento}
              onChange={handleRequerimientoInputChange}
              disabled={!isEditingRequerimiento}
              placeholder="Sustento del requerimiento"
              className="p-2 border rounded"
              required
            />
          </div>

          {isEditingRequerimiento && (
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialValues?.codigo ? 'Actualizar Requerimiento' : 'Crear Requerimiento'}
            </button>
          )}
        </form>
      </motion.div>

      {/* Sección de Recursos */}
      {initialValues?.codigo && (
        <motion.div className="bg-white rounded-lg shadow-lg m-4 p-4">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Gestión de Recursos</h2>
          
          {/* Buscador de recursos */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar recursos por código o nombre..."
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Lista de recursos encontrados */}
          {searchTerm && (
            <div className="mb-4 max-h-60 overflow-y-auto">
              {filteredRecursos.map(recurso => (
                <div key={recurso.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                  <div>
                    <span className="font-medium">{recurso.codigo}</span> - {recurso.nombre}
                    <span className="text-sm text-gray-500"> ({recurso.unidad_id})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={selectedRecurso?.id === recurso.id ? cantidad : 1}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                    <button
                      onClick={() => {
                        setSelectedRecurso(recurso);
                        handleAddRecurso();
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tabla de recursos del requerimiento */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Código</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Unidad</th>
                  <th className="p-2 text-right">Cantidad</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requerimientoRecursos.map(recurso => (
                  <tr key={recurso.id} className="border-t">
                    <td className="p-2">{recurso.codigo}</td>
                    <td className="p-2">{recurso.nombre}</td>
                    <td className="p-2">{recurso.unidad_id}</td>
                    <td className="p-2 text-right">{recurso.cantidad}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteRecurso(recurso.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiX size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        title="Atención"
        onClose={() => setModalIsOpen(false)}
      >
        <div className="p-4">
          <p>{modalMessage}</p>
          <button
            onClick={() => setModalIsOpen(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default RequerimientoFormComponent;