import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartamentos } from '../../../slices/departamentoSlice';
import { fetchProvinciasByDepartamento,  } from '../../../slices/provinciaSlice';
import { getDistritosByProvincia } from '../../../slices/distritoSlice';
import type { ILocalidad } from '../../../types/PresupuestosTypes';
import { RootState, AppDispatch } from '../../../store/store';

interface LocalidadFormProps {
  initialValues?: ILocalidad;
  onSubmit: (data: Omit<ILocalidad, 'id_localidad'>) => void;
}

const LocalidadForm: React.FC<LocalidadFormProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { departamentos } = useSelector((state: RootState) => state.departamento);
  const { provincias } = useSelector((state: RootState) => state.provincia);
  const { distritos } = useSelector((state: RootState) => state.distrito);
  
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  
  const [formData, setFormData] = React.useState<Omit<ILocalidad, 'id_localidad'>>({
    nombre_localidad: initialValues?.nombre_localidad || '',
    id_distrito: initialValues?.id_distrito || ''
  });

  useEffect(() => {
    dispatch(fetchDepartamentos());
    
    if (initialValues) {
      const currentDistrito = distritos.find(d => d.id_distrito === initialValues.id_distrito);
      if (currentDistrito) {
        const currentProvincia = provincias.find(p => p.id_provincia === currentDistrito.id_provincia);
        if (currentProvincia) {
          setSelectedProvincia(currentProvincia.id_provincia);
          dispatch(getDistritosByProvincia(currentProvincia.id_provincia));
          
          const currentDepartamento = departamentos.find(d => d.id_departamento === currentProvincia.id_departamento);
          if (currentDepartamento) {
            setSelectedDepartamento(currentDepartamento.id_departamento);
            dispatch(fetchProvinciasByDepartamento(currentDepartamento.id_departamento));
          }
        }
      }
    }
  }, [dispatch]);

  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departamentoId = e.target.value;
    setSelectedDepartamento(departamentoId);
    setSelectedProvincia('');
    setFormData(prev => ({ ...prev, id_distrito: '' }));
    if (departamentoId) {
      dispatch(fetchProvinciasByDepartamento(departamentoId));
    }
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinciaId = e.target.value;
    setSelectedProvincia(provinciaId);
    setFormData(prev => ({ ...prev, id_distrito: '' }));
    if (provinciaId) {
      dispatch(getDistritosByProvincia(provinciaId));
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
        <label htmlFor="provincia" className="text-sm font-medium text-gray-700">
          Provincia
        </label>
        <select
          id="provincia"
          name="provincia"
          value={selectedProvincia}
          onChange={handleProvinciaChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={!!initialValues}
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
        <label htmlFor="id_distrito" className="text-sm font-medium text-gray-700">
          Distrito
        </label>
        <select
          id="id_distrito"
          name="id_distrito"
          value={formData.id_distrito}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione un distrito</option>
          {distritos.map((distrito) => (
            <option key={distrito.id_distrito} value={distrito.id_distrito}>
              {distrito.nombre_distrito}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="nombre_localidad" className="text-sm font-medium text-gray-700">
          Nombre de la Localidad
        </label>
        <input
          type="text"
          id="nombre_localidad"
          name="nombre_localidad"
          value={formData.nombre_localidad}
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
          {initialValues ? 'Actualizar' : 'Crear'} Localidad
        </button>
      </div>
    </form>
  );
};

export default LocalidadForm;
