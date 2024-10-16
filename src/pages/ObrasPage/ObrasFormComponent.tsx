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
      className="bg-gradient-to-b from-white to-gray-100 shadow-lg rounded-lg px-6 sm:px-8 py-8 mb-4 max-w-md mx-auto border border-gray-200"
    >
      <div className="mb-6">
        <label htmlFor="titulo" className="block text-blue-700 text-sm font-semibold mb-2">
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
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="nombre" className="block text-blue-700 text-sm font-semibold mb-2">
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
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="descripcion" className="block text-blue-700 text-sm font-semibold mb-2">
          Descripción:
        </label>
        <form.Field
          name="descripcion"
          children={(field: FieldApi<ObraFormData, 'descripcion'>) => (
            <>
              <textarea
                id="descripcion"
                placeholder="Descripción de la obra"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out h-32 resize-none"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="flex items-center justify-center mt-8">
        <Button
          text={initialValues ? 'Actualizar Obra' : 'Crear Obra'}
          color="verde"
          className="w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-md shadow-sm hover:shadow-md transition duration-150 ease-in-out"
        />
      </div>
    </form>
  );
};

export default ObraFormComponent