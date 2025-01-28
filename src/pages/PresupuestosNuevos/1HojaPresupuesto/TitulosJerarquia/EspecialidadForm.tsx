import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEspecialidad, Especialidad, CreateEspecialidadDto } from '../../../../slices/especialidadSlice';
import { AppDispatch } from '../../../../store/store';

interface EspecialidadFormProps {
  onSubmit: (especialidad: Especialidad) => void;
  onCancel: () => void;
}

const EspecialidadForm: React.FC<EspecialidadFormProps> = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Partial<Especialidad>>({
    nombre: '',
    descripcion: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevaEspecialidad: CreateEspecialidadDto = {
        nombre: formData.nombre || '',
        descripcion: formData.descripcion || '',
      };
      
      const resultAction = await dispatch(addEspecialidad(nuevaEspecialidad));
      const nuevaEspecialidadConId = resultAction.payload as Especialidad;
      onSubmit(nuevaEspecialidadConId);
    } catch (error) {
      console.error('Error al crear especialidad:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-blue-950/80 rounded-xl p-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Nombre
        </label>
        <input
          type="text"
          value={formData.nombre || ''}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Descripción
        </label>
        <textarea
          value={formData.descripcion || ''}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Crear Especialidad
        </button>
      </div>
    </form>
  );
};

export default EspecialidadForm;
