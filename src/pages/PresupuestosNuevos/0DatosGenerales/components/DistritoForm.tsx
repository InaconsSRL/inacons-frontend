import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { Distrito } from '../../../../slices/distritoSlice';

interface DistritoFormProps {
  onSubmit: (data: Omit<Distrito, 'id_distrito'>) => void;
}

const DistritoForm: React.FC<DistritoFormProps> = ({ onSubmit }) => {
  const { provincias } = useSelector((state: RootState) => state.provincia);
  const [formData, setFormData] = useState({
    nombre_distrito: '',
    id_provincia: provincias[0]?.id_provincia || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Nombre del Distrito
        </label>
        <input
          type="text"
          value={formData.nombre_distrito}
          onChange={(e) => setFormData({...formData, nombre_distrito: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Provincia
        </label>
        <select
          value={formData.id_provincia}
          onChange={(e) => setFormData({...formData, id_provincia: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        >
          {provincias.map(prov => (
            <option key={prov.id_provincia} value={prov.id_provincia}>
              {prov.nombre_provincia}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          Crear Distrito
        </button>
      </div>
    </form>
  );
};

export default DistritoForm;
