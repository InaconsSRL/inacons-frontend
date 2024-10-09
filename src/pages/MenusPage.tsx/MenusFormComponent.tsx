import React from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const menuSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  posicion: z.number().int().min(0, 'La posición debe ser un número entero positivo'),
});

type MenuFormData = z.infer<typeof menuSchema>;

interface FormComponentProps {
  initialValues?: MenuFormData;
  onSubmit: (data: MenuFormData) => void;
}

const MenuFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<MenuFormData>({
    defaultValues: initialValues || { nombre: '', slug: '', posicion: 0 },
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
          children={(field: FieldApi<MenuFormData, 'nombre'>) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del menú"
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
        <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">
          Slug:
        </label>
        <form.Field
          name="slug"
          children={(field: FieldApi<MenuFormData, 'slug'>) => (
            <>
              <input
                id="slug"
                placeholder="Slug del menú"
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
        <label htmlFor="posicion" className="block text-gray-700 text-sm font-bold mb-2">
          Posición:
        </label>
        <form.Field
          name="posicion"
          children={(field: FieldApi<MenuFormData, 'posicion'>) => (
            <>
              <input
                id="posicion"
                type="number"
                placeholder="Posición del menú"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
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
          text={initialValues ? 'Actualizar Menú' : 'Crear Menú'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default MenuFormComponent;