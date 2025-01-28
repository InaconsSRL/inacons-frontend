import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartamentos } from '../../../slices/departamentoSlice';
import type { IProvincia } from '../../../types/PresupuestosTypes';
import { RootState, AppDispatch } from '../../../store/store';

interface ProvinciaFormProps {
  initialValues?: IProvincia;
  onSubmit: (data: Omit<IProvincia, 'id_provincia'>) => void;
}

const ProvinciaForm: React.FC<ProvinciaFormProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { departamentos } = useSelector((state: RootState) => state.departamentos);

  useEffect(() => {
    dispatch(fetchDepartamentos());
  }, [dispatch]);

  const [formData, setFormData] = React.useState<Omit<IProvincia, 'id_provincia'>>({
    nombre_provincia: initialValues?.nombre_provincia || '',
    id_departamento: initialValues?.id_departamento || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <label htmlFor="id_departamento" className="text-sm font-medium text-gray-700">
          Departamento
        </label>
        <select
          id="id_departamento"
          name="id_departamento"
          value={formData.id_departamento}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione un departamento</option>
          {departamentos.map((departamento) => (
            <option key={departamento.id_departamento} value={departamento.id_departamento}>
              {departamento.nombre_departamento}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="nombre_provincia" className="text-sm font-medium text-gray-700">
          Nombre de la Provincia
        </label>
        <input
          type="text"
          id="nombre_provincia"
          name="nombre_provincia"
          value={formData.nombre_provincia}
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
          {initialValues ? 'Actualizar' : 'Crear'} Provincia
        </button>
      </div>
    </form>
  );
};

export default ProvinciaForm;
