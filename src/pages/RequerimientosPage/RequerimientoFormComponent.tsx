import React, { useEffect, useState } from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRequerimientoRecursos, addRequerimientoRecurso, deleteRequerimientoRecurso } from '../../slices/requerimientoRecursoSlice';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requerimientoSchema = z.object({
  usuario_id: z.string().min(1, 'El ID de usuario es requerido'),
  obra_id: z.string().min(1, 'El ID de obra es requerido'),
  sustento: z.string().min(1, 'El sustento es requerido'),
});

type RequerimientoFormData = z.infer<typeof requerimientoSchema>;

interface FormComponentProps {
  initialValues?: RequerimientoFormData & { id?: string };
  onSubmit: (data: RequerimientoFormData) => void;
}

const RequerimientoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { requerimientoRecursos, loading, error } = useSelector((state: RootState) => state.requerimientoRecurso);
  const [newRecurso, setNewRecurso] = useState({ recurso_id: '', cantidad: 0 });

  const form = useForm<RequerimientoFormData>({
    defaultValues: initialValues || { usuario_id: '', obra_id: '', sustento: '' },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
  });

  useEffect(() => {
    if (initialValues?.id) {
      dispatch(fetchRequerimientoRecursos(initialValues.id));
    }
  }, [dispatch, initialValues?.id]);

  const handleAddRecurso = () => {
    if (initialValues?.id && newRecurso.recurso_id && newRecurso.cantidad > 0) {
      dispatch(addRequerimientoRecurso({
        requerimiento_id: initialValues.id,
        recurso_id: newRecurso.recurso_id,
        cantidad: newRecurso.cantidad
      }));
      setNewRecurso({ recurso_id: '', cantidad: 0 });
    }
  };

  const handleDeleteRecurso = (id: string) => {
    dispatch(deleteRequerimientoRecurso(id));
  };

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
        <label htmlFor="usuario_id" className="block text-gray-700 text-sm font-bold mb-2">
          ID de Usuario:
        </label>
        <form.Field
          name="usuario_id"
          children={(field: FieldApi<RequerimientoFormData, 'usuario_id'>) => (
            <>
              <input
                id="usuario_id"
                placeholder="ID de Usuario"
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
        <label htmlFor="obra_id" className="block text-gray-700 text-sm font-bold mb-2">
          ID de Obra:
        </label>
        <form.Field
          name="obra_id"
          children={(field: FieldApi<RequerimientoFormData, 'obra_id'>) => (
            <>
              <input
                id="obra_id"
                placeholder="ID de Obra"
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
        <label htmlFor="sustento" className="block text-gray-700 text-sm font-bold mb-2">
          Sustento:
        </label>
        <form.Field
          name="sustento"
          children={(field: FieldApi<RequerimientoFormData, 'sustento'>) => (
            <>
              <textarea
                id="sustento"
                placeholder="Sustento del requerimiento"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>

      {initialValues?.id && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Recursos</h3>
          {loading && <p>Cargando recursos...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          <ul>
            {requerimientoRecursos.map((recurso) => (
              <li key={recurso.id} className="flex justify-between items-center mb-2">
                <span>{recurso.nombre} - Cantidad: {recurso.cantidad}</span>
                <Button
                  text="Eliminar"
                  color="rojo"
                  onClick={() => handleDeleteRecurso(recurso.id)}
                  className="px-2 py-1 text-xs"
                />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              placeholder="ID del recurso"
              value={newRecurso.recurso_id}
              onChange={(e) => setNewRecurso({ ...newRecurso, recurso_id: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={newRecurso.cantidad}
              onChange={(e) => setNewRecurso({ ...newRecurso, cantidad: parseInt(e.target.value, 10) })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            />
            <Button
              text="Agregar Recurso"
              color="verde"
              onClick={handleAddRecurso}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues?.id ? 'Actualizar Requerimiento' : 'Crear Requerimiento'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default RequerimientoFormComponent;