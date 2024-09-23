import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clasificacionRecursoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  parent_id: z.string().nullable(),
});

type ClasificacionRecursoFormData = z.infer<typeof clasificacionRecursoSchema>;

interface HomogenizedClasificacion {
  id: string;
  nombre: string;
  parent_id: string | null;
  nivel: number;
}

interface FormComponentProps {
  initialValues?: ClasificacionRecursoFormData & { id: string; nivel: number };
  onSubmit: (data: ClasificacionRecursoFormData) => void;
  clasificaciones: HomogenizedClasificacion[];
}

// Función para obtener el nombre limpio (sin '>' o espacios al inicio)
const getCleanName = (nombre: string) => nombre.replace(/^[>\s]+/, '').trim();

const ClasificacionRecursoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit, clasificaciones }) => {
  const form = useForm<ClasificacionRecursoFormData>({
    defaultValues: initialValues
      ? { ...initialValues, nombre: getCleanName(initialValues.nombre) }
      : { nombre: '', parent_id: null },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setFieldValue('nombre', getCleanName(initialValues.nombre));
    }
  }, [initialValues]);

  // Función para obtener la jerarquía de una clasificación
  const getHierarchy = (id: string | null): string => {
    if (!id) return "No tiene padre";
    const parent = clasificaciones.find(c => c.id === id);
    if (!parent) return "No tiene padre";
    const grandparent = clasificaciones.find(c => c.id === parent.parent_id);
    if (!grandparent) return getCleanName(parent.nombre);
    return `${getCleanName(grandparent.nombre)} → ${getCleanName(parent.nombre)}`;
  };

  // Filtramos las clasificaciones para el select
  const selectOptions = clasificaciones.filter(c => {
    if (initialValues) {
      // Si estamos editando, excluimos la clasificación actual, sus descendientes directos y mantenemos solo niveles 0 y 1
      return c.id !== initialValues.id && 
             c.parent_id !== initialValues.id && 
             c.nivel <= 1;
    } else {
      // Si estamos creando, solo incluimos niveles 0 y 1
      return c.nivel <= 1;
    }
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
        <label htmlFor="parent_id" className="block text-gray-700 text-sm font-bold mb-2">
          Clasificación Padre:
        </label>

        <form.Field
          name="parent_id"
          children={(field) => (
            <>
              <select
                id="parent_id"
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value === '' ? null : e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Sin padre</option>
                {selectOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {getCleanName(option.nombre)}
                  </option>
                ))}
              </select>
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors}</p>
              ) : null}
            </>
          )}
        />
        {initialValues && (
          <p className="text-sm text-gray-600 mt-2">
            Jerarquía actual: {getHierarchy(initialValues.parent_id)}
          </p>
        )}
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