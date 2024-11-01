// DetalleRequerimiento.tsx
import React, { useState, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { updateRequerimiento } from '../../../slices/requerimientoSlice';
import Button from '../../../components/Buttons/Button';
import LoaderPage from '../../../components/Loader/LoaderPage';

// Definir la interfaz para el objeto requerimiento
interface Requerimiento {
  id: string;
  usuario_id: string;
  obra_id: string;
  fecha_final: string;
  sustento: string;
  codigo: string;
  usuario: string;
  estado_atencion: string;
}

interface DetalleRequerimientoProps {
  requerimiento: Requerimiento;
  obras: {
    obras: { id: string; nombre: string }[];
  };
  setGuardado: (value: boolean) => void;
}

// Interfaz para el estado del formulario
interface FormData {
  usuario_id: string;
  obra_id: string;
  fecha_final: string;
  sustento: string;
  codigo: string;
}

//Todo Bien Hasta Aqui
// Reafirmado

// Función auxiliar para formatear la fecha
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10); // Obtiene YYYY-MM-DD
};

interface ReadOnlyViewProps {
  formData: FormData;
  requerimiento: Requerimiento;
  obras: { obras: { id: string; nombre: string }[] };
  onEdit: () => void;
  onSubmit: () => void;  // Nueva prop
}

const ReadOnlyView = memo(({ formData, requerimiento, obras, onEdit, onSubmit }: ReadOnlyViewProps) => (
  <div className="grid grid-cols-4 gap-1 bg-white/50 p-2 rounded-lg">
    <div>
      <span className="block text-xs text-gray-700">Código:</span>
      <p className="text-sm border-b p-1">{formData.codigo || '-'}</p>
    </div>

    <div>
      <span className="block text-xs text-gray-700">Usuario:</span>
      <p className="text-sm border-b p-1">{requerimiento.usuario || '-'}</p>
    </div>

    <div>
      <span className="block text-xs text-gray-700">Obra:</span>
      <p className="text-sm border-b p-1">
        {obras.obras.find(obra => obra.id === formData.obra_id)?.nombre || '-'}
      </p>
    </div>

    <div>
      <span className="block text-xs text-gray-700">Fecha Final:</span>
      <p className="text-sm border-b p-1">
          {formatDateForInput(formData.fecha_final).split("-").reverse().join("-") || '-'}
      </p>
    </div>

    <div className="col-span-3">
      <span className="block text-xs text-gray-700">Sustento:</span>
      <p className="text-sm border-b p-1">{formData.sustento || '-'}</p>
    </div>

    <div className="flex items-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="w-full bg-blue-500 text-white rounded text-xs p-2"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="w-full bg-green-500 text-white rounded text-xs p-2"
      >
        Enviar
      </button>
    </div>
  </div>
));

interface EditViewProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsEditing: (value: boolean) => void;
  requerimiento: Requerimiento;
  obras: { obras: { id: string; nombre: string }[] };
}

const EditView = memo(({ formData, handleInputChange, handleSubmit, setIsEditing, requerimiento, obras }: EditViewProps) => (
  <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-1">
    <div>
      <span className="block text-xs text-gray-700">Código:</span>
      <p className="text-xs border rounded p-1">{formData.codigo || '-'}</p>
    </div>

    <div>
      <label className="block text-xs text-gray-700">Usuario:</label>
      <p className="w-full border rounded text-xs p-1">
      {requerimiento.usuario}
      </p>
    </div>

    <div>
      <label className="block text-xs text-gray-700">Obra:</label>
      <select
        name="obra_id"
        value={formData.obra_id}
        onChange={handleInputChange}
        className="w-full border rounded text-xs p-1"
      >
        <option value="">Seleccionar</option>
        {obras.obras.map((obra) => (
          <option key={obra.id} value={obra.id}>{obra.nombre}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-xs text-gray-700">Fecha Final:</label>
      <input
        name="fecha_final"
        type="date"
        value={formData.fecha_final}
        onChange={handleInputChange}
        className="w-full border rounded text-xs p-1"
      />
    </div>
        
    <div className="col-span-3">
      <label className="block text-xs text-gray-700">Sustento:</label>
      <textarea
        name="sustento"
        value={formData.sustento}
        onChange={handleInputChange}
        className="w-full border rounded text-xs p-1 h-8"
      />
    </div>

    <div className="flex items-end pb-2 gap-3">
      <button
        type='submit'
        className="w-full bg-green-500 text-white rounded text-xs p-2.5"
      >
        Guardar
      </button>
      <Button
        onClick={() => setIsEditing(false)}
        text="Cancelar"
        color='rojo'
        className="w-full bg-red-500 text-white rounded text-xs"
      />
    </div>
  </form>
));

const RequerimientoHeader: React.FC<DetalleRequerimientoProps> = memo(({ requerimiento, obras, setGuardado }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => ({
    usuario_id: requerimiento.usuario_id || '',
    obra_id: requerimiento.obra_id || '',
    fecha_final: formatDateForInput(requerimiento.fecha_final || ''),
    sustento: requerimiento.sustento || '',
    codigo: requerimiento.codigo || ''
  }));

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(updateRequerimiento({
        id: requerimiento.id,
        ...formData,
        fecha_final: new Date(formData.fecha_final),
        estado_atencion: requerimiento.estado_atencion || 'pendiente'
      })).unwrap();
      setFormData(prev => ({...prev, codigo: response.codigo}));
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, formData, requerimiento.id, requerimiento.estado_atencion]);

  const handleSubmitRequerimiento = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await dispatch(updateRequerimiento({
        id: requerimiento.id,
        ...formData,
        fecha_final: new Date(formData.fecha_final),
        estado_atencion: 'pendiente'
      })).unwrap();

      setLoading(false);
      setGuardado(true);

    } catch (error) {
      console.error('Error al enviar:', error);
      setLoading(false);
    }
  }, [dispatch, formData, requerimiento.id]);

  if (loading) {
    return <LoaderPage />;
  }

  return (
    <div className="w-full">
      {isEditing ? (
        <EditView 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setIsEditing={setIsEditing}
          requerimiento={requerimiento}
          obras={obras}
        />
      ) : (
        <ReadOnlyView 
          formData={formData}
          requerimiento={requerimiento}
          obras={obras}
          onEdit={() => setIsEditing(true)}
          onSubmit={handleSubmitRequerimiento}
        />
      )}
    </div>
  );
});

export default memo(RequerimientoHeader);