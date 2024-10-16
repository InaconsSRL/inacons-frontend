import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

interface MenuPermission {
  menuID: string;
  permissions: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  __typename?: string; // Agregar __typename como opcional
}

interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  menusPermissions: MenuPermission[];
}

interface Menu {
  id: string;
  nombre: string;
  posicion: number;
  slug: string;
}

interface Props {
  initialValues?: Role;
  onSubmit: (values: Role) => void;
  menus: Menu[];
}

const RoleSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  descripcion: Yup.string().required('La descripción es requerida'),
  menusPermissions: Yup.array().of(
    Yup.object().shape({
      menuID: Yup.string().required('El ID del menú es requerido'),
      permissions: Yup.object().shape({
        ver: Yup.boolean(),
        crear: Yup.boolean(),
        editar: Yup.boolean(),
        eliminar: Yup.boolean(),
      }),
    })
  ),
});

const RolesFormComponent: React.FC<Props> = ({ initialValues, onSubmit, menus }) => {
  const getInitialMenusPermissions = () => {
    const defaultPermissions = {
      ver: false,
      crear: false,
      editar: false,
      eliminar: false,
    };

    if (initialValues) {
      // Si estamos editando un rol existente
      const existingMenus = new Set(initialValues.menusPermissions.map(mp => mp.menuID));
      return menus.map(menu => {
        if (existingMenus.has(menu.id)) {
          // Mantener los permisos existentes para los menús que ya estaban en el rol
          return initialValues.menusPermissions.find(mp => mp.menuID === menu.id) || 
                 { menuID: menu.id, permissions: { ...defaultPermissions } };
        } else {
          // Añadir nuevos menús con permisos en false
          return { menuID: menu.id, permissions: { ...defaultPermissions } };
        }
      });
    } else {
      // Si estamos creando un nuevo rol
      return menus.map(menu => ({
        menuID: menu.id,
        permissions: { ...defaultPermissions },
      }));
    }
  };

  const defaultValues: Role = {
    id: initialValues?.id || '',
    nombre: initialValues?.nombre || '',
    descripcion: initialValues?.descripcion || '',
    menusPermissions: getInitialMenusPermissions(),
  };

  const cleanData = (data: Role) => {
    return {
      ...data,
      menusPermissions: data.menusPermissions.map(({ __typename, ...menuPermission }) => ({
        ...menuPermission,
        permissions: {
          ...menuPermission.permissions,
          __typename: undefined, // Si necesitas eliminarlo, puedes hacerlo aquí
        },
      })),
    };
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={RoleSchema}
      onSubmit={(values) => {
        const cleanedValues = cleanData(values);
        onSubmit(cleanedValues);
      }}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6 bg-white/65 shadow-md rounded-lg p-8 text-xs md:text-base">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <Field name="nombre" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-4" />
            {errors.nombre && touched.nombre ? <div className="text-red-500 text-sm mt-1">{errors.nombre}</div> : null}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <Field name="descripcion" as="textarea" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-4" />
            {errors.descripcion && touched.descripcion ? <div className="text-red-600 text-sm mt-1">{errors.descripcion}</div> : null}
          </div>

          <div className="overflow-x-auto bg-gray-50 rounded-lg shadow text-[8px] md:text-base">
            <table className="min-w-full text-black">
              <thead className="bg-gray-300">
                <tr>
                  <th className="py-2 px-2 md:py-3 md:px-6 text-left text-[8px] md:text-base font-medium text-gray-500 uppercase tracking-wider">Menú</th>
                  <th className="py-2 px-2 md:py-3 md:px-6 text-center text-[8px] md:text-base font-medium text-gray-500 uppercase tracking-wider">Ver</th>
                  <th className="py-2 px-2 md:py-3 md:px-6 text-center text-[8px] md:text-base font-medium text-gray-500 uppercase tracking-wider">Crear</th>
                  <th className="py-2 px-2 md:py-3 md:px-6 text-center text-[8px] md:text-base font-medium text-gray-500 uppercase tracking-wider">Editar</th>
                  <th className="py-2 px-2 md:py-3 md:px-6 text-center text-[8px] md:text-base font-medium text-gray-500 uppercase tracking-wider">Eliminar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-[10px] md:text-base">
                <FieldArray name="menusPermissions">
                  {() => (
                    <>
                      {menus.map((menu, index) => (
                        <tr key={menu.id} className="hover:bg-gray-50">
                          <td className="py-2 px-2 md:py-3 md:px-6 text-[10px] md:text-base font-medium text-gray-600">{menu.nombre}</td>
                          <td className="py-2 px-2 md:py-3 md:px-6  text-center">
                            <Field 
                              type="checkbox" 
                              name={`menusPermissions.${index}.permissions.crear`} 
                              className="form-checkbox h-3 w-3 md:h-4 md:w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-6  text-center">
                            <Field 
                              type="checkbox" 
                              name={`menusPermissions.${index}.permissions.editar`} 
                              className="form-checkbox h-3 w-3 md:h-4 md:w-4   text-indigo-600 transition duration-150 ease-in-out"
                            />
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-6  text-center">
                            <Field 
                              type="checkbox" 
                              name={`menusPermissions.${index}.permissions.eliminar`} 
                              className="form-checkbox h-3 w-3 md:h-4 md:w-4   text-indigo-600 transition duration-150 ease-in-out"
                            />
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-6  text-center">
                            <Field 
                              type="checkbox" 
                              name={`menusPermissions.${index}.permissions.ver`} 
                              className="form-checkbox h-3 w-3 md:h-4 md:w-4   text-indigo-600 transition duration-150 ease-in-out"
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </FieldArray>
              </tbody>
            </table>
          </div>

          <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
            {initialValues ? 'Actualizar' : 'Crear'} Rol
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RolesFormComponent;