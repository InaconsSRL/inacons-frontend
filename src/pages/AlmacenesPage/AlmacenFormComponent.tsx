import React, { useState, useEffect } from 'react';

interface FormValues {
  nombre: string;
  ubicacion: string;
  direccion: string;
  tipo: boolean;
}

interface Props {
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
}

const AlmacenFormComponent: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState<FormValues>({
    nombre: '',
    ubicacion: '',
    direccion: '',
    tipo: true,
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormValues]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Nombre */}
      <div className="space-y-2">
        <label 
          htmlFor="nombre" 
          className="block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`
            w-full px-4 py-2 rounded-lg border 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition duration-150 ease-in-out
            ${errors.nombre ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Ingrese el nombre del almacén"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* Campo Ubicación */}
      <div className="space-y-2">
        <label 
          htmlFor="ubicacion" 
          className="block text-sm font-medium text-gray-700"
        >
          Ubicación
        </label>
        <input
          type="text"
          id="ubicacion"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          className={`
            w-full px-4 py-2 rounded-lg border 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition duration-150 ease-in-out
            ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Ingrese la ubicación"
        />
        {errors.ubicacion && (
          <p className="text-red-500 text-xs mt-1">{errors.ubicacion}</p>
        )}
      </div>

      {/* Campo Dirección */}
      <div className="space-y-2">
        <label 
          htmlFor="direccion" 
          className="block text-sm font-medium text-gray-700"
        >
          Dirección
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className={`
            w-full px-4 py-2 rounded-lg border 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition duration-150 ease-in-out
            ${errors.direccion ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Ingrese la dirección"
        />
        {errors.direccion && (
          <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
        )}
      </div>

      {/* Campo Tipo */}
      <div className="space-y-2">
        <label 
          htmlFor="tipo" 
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Almacén
        </label>
        <input
          type="checkbox"
          id="tipo"
          name="tipo"
          checked={formData.tipo}
          onChange={handleChange}
          className="
            h-4 w-4 rounded border-gray-300
            text-blue-600
            focus:ring-2 focus:ring-blue-500
            transition duration-150 ease-in-out
            cursor-pointer
          "
        />
        <span className="ml-2 text-sm text-gray-600">
          {formData.tipo ? 'Principal' : 'Secundario'}
        </span>
      </div>

      {/* Botones */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="
            w-full px-4 py-2 text-sm font-medium text-white
            bg-blue-600 rounded-lg hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition duration-150 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {initialValues ? 'Actualizar' : 'Crear'} Almacén
        </button>
      </div>
    </form>
  );
};

export default AlmacenFormComponent;