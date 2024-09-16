import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button'; // Import the custom Button component

// Definimos el esquema de validación
const cargoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
});

type CargoFormData = z.infer<typeof cargoSchema>;

interface FormComponentProps {
  initialValues?: CargoFormData;
  onSubmit: (data: CargoFormData) => void;
}

const CargoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<CargoFormData>({
    defaultValues: initialValues || { nombre: '', descripcion: '' },
    onSubmit: async (values) => {
      onSubmit(values);
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
          validate={(value) => {
            const result = cargoSchema.shape.nombre.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del cargo"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {field.state.meta.touchedErrors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.touchedErrors}</p>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <div className="mb-4">
        <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">
          Descripción:
        </label>
        <form.Field
          name="descripcion"
          validate={(value) => {
            const result = cargoSchema.shape.descripcion.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <textarea
                id="descripcion"
                placeholder="Descripción del cargo"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
              {field.state.meta.touchedErrors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.touchedErrors}</p>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues ? 'Actualizar Cargo' : 'Crear Cargo'}
          onClick={() => form.handleSubmit()}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default CargoFormComponent;