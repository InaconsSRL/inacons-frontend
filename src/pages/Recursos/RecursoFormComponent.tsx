import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const recursoSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  cantidad: z.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
  unidadId: z.string().min(1, 'La unidad es requerida'),
  precioActual: z.number().min(0, 'El precio actual debe ser mayor o igual a 0'),
  tipoRecursoId: z.string().min(1, 'El tipo de recurso es requerido'),
  clasificacionRecursoId: z.string().min(1, 'La clasificación de recurso es requerida'),
  presupuesto: z.boolean(),
});

type RecursoFormData = z.infer<typeof recursoSchema>;

interface FormComponentProps {
  initialValues?: RecursoFormData;
  onSubmit: (data: RecursoFormData) => void;
}

const RecursoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const form = useForm<RecursoFormData>({
    defaultValues: initialValues || {
      codigo: '',
      nombre: '',
      descripcion: '',
      cantidad: 0,
      unidadId: '',
      precioActual: 0,
      tipoRecursoId: '',
      clasificacionRecursoId: '',
      presupuesto: false,
    },
    onSubmit: async (values) => {
      onSubmit(values);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div>
        <label htmlFor="codigo">Código:</label>
        <form.Field
          name="codigo"
          validate={(value) => {
            const result = recursoSchema.shape.codigo.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="codigo"
                placeholder="Código del recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="nombre">Nombre:</label>
        <form.Field
          name="nombre"
          validate={(value) => {
            const result = recursoSchema.shape.nombre.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="descripcion">Descripción:</label>
        <form.Field
          name="descripcion"
          validate={(value) => {
            const result = recursoSchema.shape.descripcion.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <textarea
                id="descripcion"
                placeholder="Descripción del recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="cantidad">Cantidad:</label>
        <form.Field
          name="cantidad"
          validate={(value) => {
            const result = recursoSchema.shape.cantidad.safeParse(Number(value));
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="cantidad"
                type="number"
                placeholder="Cantidad del recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="unidadId">Unidad:</label>
        <form.Field
          name="unidadId"
          validate={(value) => {
            const result = recursoSchema.shape.unidadId.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="unidadId"
                placeholder="ID de la unidad"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="precioActual">Precio Actual:</label>
        <form.Field
          name="precioActual"
          validate={(value) => {
            const result = recursoSchema.shape.precioActual.safeParse(Number(value));
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="precioActual"
                type="number"
                step="0.01"
                placeholder="Precio actual del recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="tipoRecursoId">Tipo de Recurso:</label>
        <form.Field
          name="tipoRecursoId"
          validate={(value) => {
            const result = recursoSchema.shape.tipoRecursoId.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="tipoRecursoId"
                placeholder="ID del tipo de recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="clasificacionRecursoId">Clasificación de Recurso:</label>
        <form.Field
          name="clasificacionRecursoId"
          validate={(value) => {
            const result = recursoSchema.shape.clasificacionRecursoId.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="clasificacionRecursoId"
                placeholder="ID de la clasificación de recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="presupuesto">Presupuesto:</label>
        <form.Field
          name="presupuesto"
          validate={(value) => {
            const result = recursoSchema.shape.presupuesto.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="presupuesto"
                type="checkbox"
                checked={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <button type="submit">
        {initialValues ? 'Actualizar Recurso' : 'Crear Recurso'}
      </button>
    </form>
  );
};

export default RecursoFormComponent;