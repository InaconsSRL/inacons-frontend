import React from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

const roleSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  menusPermissions: z.array(z.object({
    menuID: z.string(),
    permissions: z.object({
      ver: z.boolean(),
      crear: z.boolean(),
      editar: z.boolean(),
      eliminar: z.boolean(),
    }),
  })),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Menu {
  id: string;
  nombre: string;
  slug: string;
  posicion: number;
}

interface FormComponentProps {
  initialValues?: RoleFormData;
  onSubmit: (data: RoleFormData) => void;
  menus: Menu[];
}

const RoleFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit, menus }) => {
  console.log(useForm<RoleFormData>({
    defaultValues: initialValues || { 
      nombre: '', 
      descripcion: '', 
      menusPermissions: menus.map(menu => ({
        menuID: menu.id,
        permissions: { ver: false, crear: false, editar: false, eliminar: false }
      }))
    },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
    
  }
  
))
  const form = useForm<RoleFormData>({
    defaultValues: initialValues || { 
      nombre: '', 
      descripcion: '', 
      menusPermissions: menus.map(menu => ({
        menuID: menu.id,
        permissions: { ver: false, crear: false, editar: false, eliminar: false }
      }))
    },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
    
  }
  
);

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
          children={(field: FieldApi<RoleFormData, 'nombre'>) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del rol"
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
          Descripción:
        </label>
        <form.Field
          name="descripcion"
          children={(field: FieldApi<RoleFormData, 'descripcion'>) => (
            <>
              <input
                id="descripcion"
                placeholder="Descripción del rol"
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
        <h3 className="block text-gray-700 text-sm font-bold mb-2">Permisos de Menús:</h3>
        {menus.map((menu, index) => (
          <div key={menu.id} className="mb-2">
            <h4 className="text-sm font-semibold">{menu.nombre}</h4>
            <form.Field
              name={`menusPermissions.${index}.permissions.ver`}
              children={(field: FieldApi<RoleFormData, `menusPermissions.${number}.permissions.ver`>) => (
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Ver</span>
                </label>
              )}
            />
            <form.Field
              name={`menusPermissions.${index}.permissions.crear`}
              children={(field: FieldApi<RoleFormData, `menusPermissions.${number}.permissions.crear`>) => (
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">crear</span>
                </label>
              )}
            />
            <form.Field
              name={`menusPermissions.${index}.permissions.editar`}
              children={(field: FieldApi<RoleFormData, `menusPermissions.${number}.permissions.editar`>) => (
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">editar</span>
                </label>
              )}
            />
            <form.Field
              name={`menusPermissions.${index}.permissions.eliminar`}
              children={(field: FieldApi<RoleFormData, `menusPermissions.${number}.permissions.eliminar`>) => (
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">eliminar</span>
                </label>
              )}
            />
            {/* Repite para crear, editar y eliminar */}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues ? 'Actualizar Rol' : 'Crear Rol'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default RoleFormComponent;