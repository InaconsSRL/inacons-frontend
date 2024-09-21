import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

const clasificacionRecursoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  parentId: z.string().optional(),
});

type ClasificacionRecursoFormData = z.infer<typeof clasificacionRecursoSchema>;

interface FormComponentProps {
  initialValues?: ClasificacionRecursoFormData;
  onSubmit: (data: ClasificacionRecursoFormData) => void;
}

const ClasificacionRecursoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<ClasificacionRecursoFormData>({
    defaultValues: initialValues || { nombre: '', parentId: null },
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
                placeholder="Nombre de la clasificación de recurso"
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
      <div className="mb-4">
        <label htmlFor="parentId" className="block text-gray-700 text-sm font-bold mb-2">
          Parent ID:
        </label>
        
        <form.Field
          name="parentId"
          children={(field) => (
            <>
              <input
                id="parentId"
                placeholder="ID del padre"
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
          text={initialValues ? 'Actualizar Clasificación de Recurso' : 'Crear Clasificación de Recurso'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default ClasificacionRecursoFormComponent;