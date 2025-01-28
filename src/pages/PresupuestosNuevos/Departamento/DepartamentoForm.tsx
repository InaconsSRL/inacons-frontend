import React from 'react';
import type { IDepartamento } from '../../../types/PresupuestosTypes';

interface DepartamentoFormProps {
  initialValues?: IDepartamento;
  onSubmit: (data: Omit<IDepartamento, 'id_departamento'>) => void;
}

const DepartamentoForm: React.FC<DepartamentoFormProps> = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = React.useState<Omit<IDepartamento, 'id_departamento'>>({
    nombre_departamento: initialValues?.nombre_departamento || '',
    ubigeo: initialValues?.ubigeo || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="nombre_departamento" className="text-sm font-medium text-gray-700">
          Nombre del Departamento
        </label>
        <input
          type="text"
          id="nombre_departamento"
          name="nombre_departamento"
          value={formData.nombre_departamento}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="ubigeo" className="text-sm font-medium text-gray-700">
          Ubigeo
        </label>
        <input
          type="text"
          id="ubigeo"
          name="ubigeo"
          value={formData.ubigeo}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialValues ? 'Actualizar' : 'Crear'} Departamento
        </button>
      </div>
    </form>
  );
};

export default DepartamentoForm;
