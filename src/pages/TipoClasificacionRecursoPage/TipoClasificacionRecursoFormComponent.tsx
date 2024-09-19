import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

const clasificacionRecursoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  parentId: z.string().nullable(),
});

type ClasificacionRecursoFormData = z.infer<typeof clasificacionRecursoSchema>;

interface FormComponentProps {
  initialValues?: ClasificacionRecursoFormData & { id?: string };
  onSubmit: (data: ClasificacionRecursoFormData) => void;
  clasificacionesRecurso: Array<{ id: string; nombre: string; parent_id: string | null; childs: any[] }>;
}

const ClasificacionRecursoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit, clasificacionesRecurso }) => {
  const form = useForm<ClasificacionRecursoFormData>({
    defaultValues: initialValues || { nombre: '', parentId: '' },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
  });

  const getAvailableParents = () => {
    if (!initialValues?.id) return clasificacionesRecurso;

    const isDescendant = (parent: any, childId: string): boolean => {
      if (parent.id === childId) return true;
      return parent.childs.some((child: any) => isDescendant(child, childId));
    };

    return clasificacionesRecurso.filter(cr => cr.id !== initialValues.id && !isDescendant(cr, initialValues.id));
  };

  const availableParents = getAvailableParents();

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
        <label htmlFor="parentId" className="block text-gray-700 text-sm font-bold mb-2">
          Clasificación Padre:
        </label>
        
        <form.Field
          name="parentId"
          children={(field) => (
            <>
              <select
                id="parentId"
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value === '' ? null : e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Sin clasificación padre</option>
                {availableParents.map((cr) => (
                  <option key={cr.id} value={cr.id}>
                    {cr.nombre}
                  </option>
                ))}
              </select>
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors}</p>
              ) : null}
            </>
          )}
        />
      </div>

      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues?.id ? 'Actualizar Clasificación de Recurso' : 'Crear Clasificación de Recurso'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default ClasificacionRecursoFormComponent;