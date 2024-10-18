import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          children={(field) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del tipo de recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues ? 'Actualizar Tipo de Recurso' : 'Crear Tipo de Recurso'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default TipoRecursoFormComponent;