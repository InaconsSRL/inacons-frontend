import React, { useState } from 'react';
import { Departamento } from '../../../../slices/departamentoSlice';

interface DepartamentoFormProps {
  onSubmit: (data: Omit<Departamento, 'id_departamento'>) => void;
}

const DepartamentoForm: React.FC<DepartamentoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre_departamento: '',
    ubigeo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Nombre del Departamento
        </label>
        <input
          type="text"
          value={formData.nombre_departamento}
          onChange={(e) => setFormData({...formData, nombre_departamento: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Ubigeo
        </label>
        <input
          type="text"
          value={formData.ubigeo}
          onChange={(e) => setFormData({...formData, ubigeo: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          Crear Departamento
        </button>
      </div>
    </form>
  );
};

export default DepartamentoForm;
