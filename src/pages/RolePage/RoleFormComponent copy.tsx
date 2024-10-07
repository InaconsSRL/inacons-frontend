import React from 'react';
  import { useForm, useFieldArray } from 'react-hook-form';
  import { z } from 'zod';
  import { zodResolver } from '@hookform/resolvers/zod';
  import Button from '../../components/Buttons/Button';
  
  const permissionSchema = z.object({
    ver: z.boolean(),
    crear: z.boolean(),
    editar: z.boolean(),
    eliminar: z.boolean(),
  });
  
  const menuPermissionSchema = z.object({
    menuID: z.string(),
    permissions: permissionSchema,
  });
  
  const roleSchema = z.object({
    id: z.string().optional(),
    nombre: z.string().min(1, 'El nombre es requerido'),
    descripcion: z.string().min(1, 'La descripción es requerida'),
    menusPermissions: z.array(menuPermissionSchema),
  });
  
  type RoleFormData = z.infer<typeof roleSchema>;
  
  interface RoleFormComponentProps {
    initialValues?: any; // Cambiado para aceptar el formato que recibes
    onSubmit: (data: RoleFormData) => void;
    menus: Array<{ id: string; nombre: string }>;
  }
  
  const RoleFormComponent: React.FC<RoleFormComponentProps> = ({ initialValues, onSubmit, menus }) => {
    const defaultValues = initialValues
      ? {
          ...initialValues,
          menusPermissions: menus.map(menu => {
            const existingPermission = initialValues.menusPermissions.find(
              (mp: any) => mp.menuID.id === menu.id
            );
            return {
              menuID: menu.id,
              permissions: existingPermission
                ? existingPermission.permissions
                : { ver: false, crear: false, editar: false, eliminar: false },
            };
          }),
        }
      : {
          nombre: '',
          descripcion: '',
          menusPermissions: menus.map(menu => ({
            menuID: menu.id,
            permissions: { ver: false, crear: false, editar: false, eliminar: false },
          })),
        };
  
    const { register, control, handleSubmit, formState: { errors } } = useForm<RoleFormData>({
      resolver: zodResolver(roleSchema),
      defaultValues,
    });
  
    const { fields } = useFieldArray({
      control,
      name: 'menusPermissions',
    });
  
    const handleFormSubmit = (data: RoleFormData) => {
    console.log('Datos del formulario:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
          Nombre
        </label>
        <input
          {...register('nombre')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="nombre"
          type="text"
          placeholder="Nombre del rol"
        />
        {errors.nombre && <p className="text-red-500 text-xs italic">{errors.nombre.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
          Descripción
        </label>
        <textarea
          {...register('descripcion')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="descripcion"
          placeholder="Descripción del rol"
        />
        {errors.descripcion && <p className="text-red-500 text-xs italic">{errors.descripcion.message}</p>}
      </div>
      <div className="mb-4">
        <h3 className="text-gray-700 font-bold mb-2">Permisos por Menú</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2 p-2 border rounded">
            <h4 className="font-bold">{field.menuID.nombre}</h4>
            <div className="flex space-x-4">
              {['ver', 'crear', 'editar', 'eliminar'].map((permission) => (
                <label key={permission} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register(`menusPermissions.${index}.permissions.${permission}` as const)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 capitalize">{permission}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Button
          text={initialValues ? 'Actualizar Rol' : 'Crear Rol'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
          type="submit"
        />
      </div>
    </form>
  );
};

export default RoleFormComponent;
