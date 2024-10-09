import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  menusPermissions: {
    menuID: string;
    permissions: {
      ver: boolean;
      crear: boolean;
      editar: boolean;
      eliminar: boolean;
    };
  }[];
}

interface Menu {
  id: string;
  nombre: string;
  posicion: string;
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
  const defaultValues: Role = {
    id: '',
    nombre: '',
    descripcion: '',
    menusPermissions: [],
  };

  const cleanData = (data: Role) => {
    return {
      ...data,
      menusPermissions: data.menusPermissions.map(({ __typename, ...menuPermission }) => ({
        ...menuPermission,
        permissions: {
          ...menuPermission.permissions,
          __typename: undefined,
        },
      })),
    };
  };

  return (
    <Formik
      initialValues={initialValues || defaultValues}
      validationSchema={RoleSchema}
      onSubmit={(values) => {
        const cleanedValues = cleanData(values); // Limpiar los datos
        onSubmit(cleanedValues); // Enviar los datos limpios
      }}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <Field name="nombre" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            {errors.nombre && touched.nombre ? <div className="text-red-500 text-sm mt-1">{errors.nombre}</div> : null}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <Field name="descripcion" as="textarea" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            {errors.descripcion && touched.descripcion ? <div className="text-red-500 text-sm mt-1">{errors.descripcion}</div> : null}
          </div>

          <FieldArray name="menusPermissions">
            {({ push, remove }) => (
              <div>
                {initialValues?.menusPermissions.map((menuPermission, index) => {
                  // Buscar el nombre del menú usando el menuID
                  const menu = menus.find(m => m.id === menuPermission.menuID);
                  return (
                    <div key={index} className="border p-4 mb-4 rounded">
                      {/* Mostrar el nombre del menú en lugar del menuID */}
                      <div className="mb-2">
                        {menu ? menu.nombre : 'Menú no encontrado'}
                      </div>
                      <Field name={`menusPermissions.${index}.menuID`} type="hidden" value={menuPermission.menuID} />
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <Field type="checkbox" name={`menusPermissions.${index}.permissions.ver`} className="mr-2" />
                          Ver
                        </label>
                        <label className="flex items-center">
                          <Field type="checkbox" name={`menusPermissions.${index}.permissions.crear`} className="mr-2" />
                          Crear
                        </label>
                        <label className="flex items-center">
                          <Field type="checkbox" name={`menusPermissions.${index}.permissions.editar`} className="mr-2" />
                          Editar
                        </label>
                        <label className="flex items-center">
                          <Field type="checkbox" name={`menusPermissions.${index}.permissions.eliminar`} className="mr-2" />
                          Eliminar
                        </label>
                      </div>
                      <button type="button" onClick={() => remove(index)} className="mt-2 px-2 py-1 bg-red-500 text-white rounded">Eliminar</button>
                    </div>
                  );
                })}
                <button type="button" onClick={() => push({ menuID: '', permissions: { ver: false, crear: false, editar: false, eliminar: false } })} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Agregar Menú</button>
              </div>
            )}
          </FieldArray>

          <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            {initialValues ? 'Actualizar' : 'Crear'} Rol
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RolesFormComponent;