import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface FormValues {
  obra_id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: string;
}

interface Props {
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
}

const BodegaFormComponent: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState<FormValues>({
    obra_id: '',
    codigo: '',
    nombre: '',
    descripcion: '',
    estado: 'true'
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const obras = useSelector((state: RootState) => state.obra.obras);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};

    if (!formData.obra_id) {
      newErrors.obra_id = 'La obra es requerida';
    }
    if (!formData.codigo?.trim()) {
      newErrors.codigo = 'El código es requerido';
    }
    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.estado) {
      newErrors.estado = 'El estado es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormValues]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Obra Select */}
      <div className="space-y-2">
        <label htmlFor="obra_id" className="block text-sm font-medium text-gray-700">
          Obra
        </label>
        <select
          id="obra_id"
          name="obra_id"
          value={formData.obra_id}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${errors.obra_id ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Seleccione una obra</option>
          {obras.map(obra => (
            <option key={obra.id} value={obra.id}>
              {obra.nombre}
            </option>
          ))}
        </select>
        {errors.obra_id && (
          <p className="text-red-500 text-xs mt-1">{errors.obra_id}</p>
        )}
      </div>

      {/* Código */}
      <div className="space-y-2">
        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
          Código
        </label>
        <input
          type="text"
          id="codigo"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${errors.codigo ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ingrese el código"
        />
        {errors.codigo && (
          <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>
        )}
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ingrese el nombre"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
          placeholder="Ingrese la descripción"
          rows={3}
        />
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      {/* Botón Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialValues ? 'Actualizar' : 'Crear'} Bodega
        </button>
      </div>
    </form>
  );
};

export default BodegaFormComponent;
