import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { Localidad } from '../../../../slices/localidadSlice';

interface LocalidadFormProps {
  onSubmit: (data: Omit<Localidad, 'id_localidad'>) => void;
}

const LocalidadForm: React.FC<LocalidadFormProps> = ({ onSubmit }) => {
  const { distritos } = useSelector((state: RootState) => state.distrito);
  const [formData, setFormData] = useState({
    nombre_localidad: '',
    id_distrito: distritos[0]?.id_distrito || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Nombre de la Localidad
        </label>
        <input
          type="text"
          value={formData.nombre_localidad}
          onChange={(e) => setFormData({...formData, nombre_localidad: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Distrito
        </label>
        <select
          value={formData.id_distrito}
          onChange={(e) => setFormData({...formData, id_distrito: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        >
          {distritos.map(dist => (
            <option key={dist.id_distrito} value={dist.id_distrito}>
              {dist.nombre_distrito}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          Crear Localidad
        </button>
      </div>
    </form>
  );
};

export default LocalidadForm;
