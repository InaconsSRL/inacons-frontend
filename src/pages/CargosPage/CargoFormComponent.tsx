import React from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button'; // Import the custom Button component

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cargoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  gerarquia: z.number().min(1, 'La jerarquía debe ser al menos 1').max(4, 'La jerarquía no puede ser mayor a 4'),
});

type CargoFormData = z.infer<typeof cargoSchema>;

interface FormComponentProps {
  initialValues?: CargoFormData;
  onSubmit: (data: CargoFormData) => void;
}

const CargoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<CargoFormData>({
    defaultValues: initialValues || { nombre: '', descripcion: '', gerarquia: 1 },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
          Nombre:
        </label>
        <form.Field
          name="nombre"
          children={(field: FieldApi<CargoFormData, 'nombre'>) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del cargo"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">
          Descripción:
        </label>
        <form.Field
          name="descripcion"
          children={(field: FieldApi<CargoFormData, 'descripcion'>) => (
            <>
              <textarea
                id="descripcion"
                placeholder="Descripción del cargo"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="gerarquia" className="block text-gray-700 text-sm font-bold mb-2">
          Jerarquía:
        </label>
        <form.Field
          name="gerarquia"
          children={(field: FieldApi<CargoFormData, 'gerarquia'>) => (
            <>
              <input
                id="gerarquia"
                type="number"
                min="1"
                max="4"
                placeholder="Jerarquía del cargo"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues ? 'Actualizar Cargo' : 'Crear Cargo'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default CargoFormComponent;