import React from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

const tipoCostoRecursoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
});

type TipoCostoRecursoFormData = z.infer<typeof tipoCostoRecursoSchema>;

interface FormComponentProps {
  initialValues?: TipoCostoRecursoFormData;
  onSubmit: (data: TipoCostoRecursoFormData) => void;
}

const TipoCostoRecursoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<TipoCostoRecursoFormData>({
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
      className="bg-gradient-to-b from-white to-gray-100 shadow-lg rounded-lg px-6 sm:px-8 py-8 mb-4 max-w-md mx-auto border border-gray-200"
    >
      <div className="mb-6">
        <label htmlFor="nombre" className="block text-blue-700 text-sm font-semibold mb-2">
          Nombre:
        </label>
        <form.Field
          name="nombre"
          children={(field: FieldApi<TipoCostoRecursoFormData, 'nombre'>) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del tipo de costo"
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
      <div className="flex items-center justify-center mt-8">
        <Button
          text={initialValues ? 'Actualizar Tipo de Costo' : 'Crear Tipo de Costo'}
          color="verde"
          className="w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-md shadow-sm hover:shadow-md transition duration-150 ease-in-out"
        />
      </div>
    </form>
  );
};

export default TipoCostoRecursoFormComponent;