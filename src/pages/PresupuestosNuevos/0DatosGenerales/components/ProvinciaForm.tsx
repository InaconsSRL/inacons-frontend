import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { Provincia } from '../../../../slices/provinciaSlice';

interface ProvinciaFormProps {
  onSubmit: (data: Omit<Provincia, 'id_provincia'>) => void;
}

const ProvinciaForm: React.FC<ProvinciaFormProps> = ({ onSubmit }) => {
  const { departamentos } = useSelector((state: RootState) => state.departamento);
  const [formData, setFormData] = useState({
    nombre_provincia: '',
    id_departamento: ''
  });

  useEffect(() => {
    if (departamentos.length > 0) {
      setFormData(prev => ({
        ...prev,
        id_departamento: departamentos[0].id_departamento
      }));
    }
  }, [departamentos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Nombre de la Provincia
        </label>
        <input
          type="text"
          value={formData.nombre_provincia}
          onChange={(e) => setFormData({...formData, nombre_provincia: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Departamento
        </label>
        <select
          value={formData.id_departamento}
          onChange={(e) => setFormData({...formData, id_departamento: e.target.value})}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
          required
        >
          {departamentos.map(dep => (
            <option key={dep.id_departamento} value={dep.id_departamento}>
              {dep.nombre_departamento}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          Crear Provincia
        </button>
      </div>
    </form>
  );
};

export default ProvinciaForm;
