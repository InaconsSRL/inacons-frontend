import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

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
    >
      <div>
        <label htmlFor="nombre">Nombre:</label>
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
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <div>
        <label htmlFor="descripcion">Descripción:</label>
        <form.Field
          name="descripcion"
          validate={(value) => {
            const result = cargoSchema.shape.descripcion.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="descripcion"
                placeholder="Descripción del cargo"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <button type="submit">
        {initialValues ? 'Actualizar Cargo' : 'Crear Cargo'}
      </button>
    </form>
  );
};

export default CargoFormComponent;