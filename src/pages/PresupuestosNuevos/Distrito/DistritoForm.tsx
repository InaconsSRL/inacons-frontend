import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartamentos } from '../../../slices/departamentoSlice';
import { fetchProvinciasByDepartamento } from '../../../slices/provinciaSlice';
import type { IDistrito } from '../../../types/PresupuestosTypes';
import { RootState, AppDispatch } from '../../../store/store';

interface DistritoFormProps {
  initialValues?: IDistrito;
  onSubmit: (data: Omit<IDistrito, 'id_distrito'>) => void;
}

const DistritoForm: React.FC<DistritoFormProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { departamentos } = useSelector((state: RootState) => state.departamentos);
  const { provincias } = useSelector((state: RootState) => state.provincias);
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');

  useEffect(() => {
    dispatch(fetchDepartamentos());
    if (initialValues) {
      const provincia = provincias.find(p => p.id_provincia === initialValues.id_provincia);
      if (provincia) {
        setSelectedDepartamento(provincia.id_departamento);
        dispatch(fetchProvinciasByDepartamento(provincia.id_departamento));
      }
    }
  }, [dispatch, initialValues]);

  const [formData, setFormData] = React.useState<Omit<IDistrito, 'id_distrito'>>({
    nombre_distrito: initialValues?.nombre_distrito || '',
    id_provincia: initialValues?.id_provincia || '',
  });

  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departamentoId = e.target.value;
    setSelectedDepartamento(departamentoId);
    setFormData(prev => ({ ...prev, id_provincia: '' }));
    if (departamentoId) {
      dispatch(fetchProvinciasByDepartamento(departamentoId));
    }
  };

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
        <label htmlFor="departamento" className="text-sm font-medium text-gray-700">
          Departamento
        </label>
        <select
          id="departamento"
          name="departamento"
          value={selectedDepartamento}
          onChange={handleDepartamentoChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={!!initialValues}
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
        <label htmlFor="id_provincia" className="text-sm font-medium text-gray-700">
          Provincia
        </label>
        <select
          id="id_provincia"
          name="id_provincia"
          value={formData.id_provincia}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione una provincia</option>
          {provincias.map((provincia) => (
            <option key={provincia.id_provincia} value={provincia.id_provincia}>
              {provincia.nombre_provincia}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="nombre_distrito" className="text-sm font-medium text-gray-700">
          Nombre del Distrito
        </label>
        <input
          type="text"
          id="nombre_distrito"
          name="nombre_distrito"
          value={formData.nombre_distrito}
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
          {initialValues ? 'Actualizar' : 'Crear'} Distrito
        </button>
      </div>
    </form>
  );
};

export default DistritoForm;
