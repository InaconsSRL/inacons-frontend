import React, { useState, useEffect } from 'react';

interface FormValues {
  nombre: string;
}

interface Props {
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
}

const TipoAlmacenFormComponent: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState<FormValues>({
    nombre: '',
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormValues]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
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
          placeholder="Ingrese el nombre del tipo de almacén"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* Botón */}
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
          {initialValues ? 'Actualizar' : 'Crear'} Tipo de Almacén
        </button>
      </div>
    </form>
  );
};

export default TipoAlmacenFormComponent;
