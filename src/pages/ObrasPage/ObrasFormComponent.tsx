import React from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const obraSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
});

type ObraFormData = z.infer<typeof obraSchema>;

interface FormComponentProps {
  initialValues?: ObraFormData;
  onSubmit: (data: ObraFormData) => void;
}

const ObraFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<ObraFormData>({
    defaultValues: initialValues || { titulo: '', nombre: '', descripcion: '' },
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
        <label htmlFor="titulo" className="block text-gray-700 text-sm font-bold mb-2">
          Título:
        </label>
        <form.Field
          name="titulo"
          children={(field: FieldApi<ObraFormData, 'titulo'>) => (
            <>
              <input
                id="titulo"
                placeholder="Título de la obra"
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
        <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
          Nombre:
        </label>
        <form.Field
          name="nombre"
          children={(field: FieldApi<ObraFormData, 'nombre'>) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre de la obra"
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
          Descripcion:
        </label>
        <form.Field
          name="descripcion"
          children={(field: FieldApi<ObraFormData, 'descripcion'>) => (
            <>
              <input
                id="descripcion"
                placeholder="Descripcion de la obra"
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
      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues ? 'Actualizar Obra' : 'Crear Obra'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default ObraFormComponent