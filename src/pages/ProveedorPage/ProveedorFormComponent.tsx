import React from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const proveedorSchema = z.object({
  razon_social: z.string().min(1, 'La razón social es requerida'),
  ruc: z.string().min(11, 'El RUC debe tener al menos 11 caracteres').max(11, 'El RUC no debe exceder 11 caracteres'),
});

type ProveedorFormData = z.infer<typeof proveedorSchema>;

interface FormComponentProps {
  initialValues?: ProveedorFormData;
  onSubmit: (data: ProveedorFormData) => void;
}

const ProveedorFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<ProveedorFormData>({
    defaultValues: initialValues || { razon_social: '', ruc: '' },
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
        <label htmlFor="ruc" className="block text-gray-700 text-sm font-bold mb-2">
          RUC:
        </label>
        <form.Field
          name="ruc"
          children={(field: FieldApi<ProveedorFormData, 'ruc'>) => (
            <>
              <input
                type='number'
                id="ruc"
                placeholder="RUC del Proveedor"
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
        <label htmlFor="razon_social" className="block text-gray-700 text-sm font-bold mb-2">
          Razón Social:
        </label>
        <form.Field
          name="razon_social"
          children={(field: FieldApi<ProveedorFormData, 'razon_social'>) => (
            <>
              <input
                id="razon_social"
                placeholder="Razón Social del Proveedor"
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
          text={initialValues ? 'Actualizar Proveedor' : 'Crear Proveedor'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default ProveedorFormComponent;