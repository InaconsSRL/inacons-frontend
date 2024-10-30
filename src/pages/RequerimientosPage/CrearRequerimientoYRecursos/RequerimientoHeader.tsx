// DetalleRequerimiento.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { updateRequerimiento } from '../../../slices/requerimientoSlice';

// Definir la interfaz para el objeto requerimiento
interface Requerimiento {
  id: string;
  usuario_id: string;
  obra_id: string;
  fecha_final: string;
  sustento: string;
  codigo: string;
  usuario: string;
}

interface DetalleRequerimientoProps {
  requerimiento: Requerimiento;
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
  return date.toISOString().slice(0, 16); // Obtiene YYYY-MM-DDTHH:mm
};

const RequerimientoHeader: React.FC<DetalleRequerimientoProps> = ({ requerimiento }) => {
  const dispatch = useDispatch<AppDispatch>();

  const obras = useSelector((state: RootState) => state.obra);
  const [isEditing, setIsEditing] = useState(false);


  // Inicializar formData con los valores del requerimiento
  const [formData, setFormData] = useState<FormData>({
    usuario_id: requerimiento.usuario_id || '',
    obra_id: requerimiento.obra_id || '',
    fecha_final: formatDateForInput(requerimiento.fecha_final || ''),
    sustento: requerimiento.sustento || '',
    codigo: requerimiento.codigo || ''
  });

  // Manejador genérico para cambios en inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Importante: prevenir el comportamiento por defecto

    try {
      const response = await dispatch(updateRequerimiento({
        id: requerimiento.id,
        ...formData,
        fecha_final: new Date(formData.fecha_final)
      }));
      setFormData({...formData, codigo: response.payload.codigo});
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  // Vista de solo lectura
  const ReadOnlyView = () => (
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
          {new Date(formData.fecha_final).toLocaleString() || '-'}
        </p>
      </div>

      <div className="col-span-3">
        <span className="block text-xs text-gray-700">Sustento:</span>
        <p className="text-sm border-b p-1">{formData.sustento || '-'}</p>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-full bg-blue-500 text-white rounded text-xs p-2"
        >
          Editar
        </button>
      </div>
    </div>
  );

  // Vista de edición (el formulario original)
  const EditView = () => (
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
          type="datetime-local"
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

      <div className="flex items-end">
        <button
          type="submit"
          className="w-full bg-green-500 text-white rounded text-xs p-2"
        >
          Guardar
        </button>
      </div>
    </form>
  );

  return (
    <div className="w-full">
      {isEditing ? <EditView /> : <ReadOnlyView />}
    </div>
  );
};

export default RequerimientoHeader;