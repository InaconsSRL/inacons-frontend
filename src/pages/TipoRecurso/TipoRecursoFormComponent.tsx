import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

// Definimos el esquema de validación
const tipoRecursoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
});

type TipoRecursoFormData = z.infer<typeof tipoRecursoSchema>;

interface FormComponentProps {
  initialValues?: TipoRecursoFormData;
  onSubmit: (data: TipoRecursoFormData) => void;
}

const TipoRecursoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<TipoRecursoFormData>({
    defaultValues: initialValues || { nombre: '' },
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
            const result = tipoRecursoSchema.shape.nombre.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del tipo de recurso"
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
        {initialValues ? 'Actualizar Tipo de Recurso' : 'Crear Tipo de Recurso'}
      </button>
    </form>
  );
};

export default TipoRecursoFormComponent;