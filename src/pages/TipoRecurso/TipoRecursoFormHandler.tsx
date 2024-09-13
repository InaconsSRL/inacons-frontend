import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import GenericFormComponent from '../../components/FormComponent/FormComponent';

const tipoRecursoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
});

type TipoRecursoFormData = z.infer<typeof tipoRecursoSchema>;

interface TipoRecursoFormHandlerProps {
  initialValues?: TipoRecursoFormData;
  onSubmit: (data: TipoRecursoFormData) => void;
}

const TipoRecursoFormHandler: React.FC<TipoRecursoFormHandlerProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<TipoRecursoFormData>({
    defaultValues: initialValues || { nombre: '' },
    onSubmit: async (values) => {
      onSubmit(values);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  return (
    <GenericFormComponent
      form={form}
      onSubmit={handleSubmit}
      submitButtonText={initialValues ? 'Actualizar Tipo de Recurso' : 'Crear Tipo de Recurso'}
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
    </GenericFormComponent>
  );
};

export default TipoRecursoFormHandler;