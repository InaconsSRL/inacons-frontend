import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const recursoSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  cantidad: z.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
  unidad_id: z.string().min(1, 'La unidad es requerida'),
  precio_actual: z.number().min(0, 'El precio actual debe ser mayor o igual a 0'),
  tipo_recurso_id: z.string().min(1, 'El tipo de recurso es requerido'),
  clasificacion_recurso_id: z.string().min(1, 'La clasificación de recurso es requerida'),
  presupuesto: z.boolean().optional(),
});

type RecursoFormData = z.infer<typeof recursoSchema>;

interface FormComponentProps {
  initialValues?: RecursoFormData;
  onSubmit: (data: RecursoFormData) => void;
  options: {
    unidades: Array<{ id: string; nombre: string }>;
    tiposRecurso: Array<{ id: string; nombre: string }>;
    clasificaciones: Array<{ id: string; nombre: string; childs?: Array<{ id: string; nombre: string }> }>;
  };
}

const RecursoFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit, options }) => {
  const form = useForm<RecursoFormData>({
    defaultValues: initialValues || {
      codigo: '',
      nombre: '',
      descripcion: '',
      cantidad: 0,
      unidad_id: '',
      precio_actual: 0,
      tipo_recurso_id: '',
      clasificacion_recurso_id: '',
      presupuesto: false,
    },
    onSubmit: async (values) => {
      onSubmit(values);
    },
  });

  const renderClasificaciones = (clasificaciones: Array<{ id: string; nombre: string; childs?: Array<{ id: string; nombre: string }> }>) => {
    return clasificaciones.map(clasificacion => (
      <React.Fragment key={clasificacion.id}>
        <option value={clasificacion.id}>{clasificacion.nombre}</option>
        {clasificacion.childs && clasificacion.childs.map(child => (
          <option key={child.id} value={child.id}>&nbsp;&nbsp;{child.nombre}</option>
        ))}
      </React.Fragment>
    ));
  };

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
        <label htmlFor="unidad_id">Unidad:</label>
        <form.Field
          name="unidad_id"
          validate={(value) => {
            const result = recursoSchema.shape.unidad_id.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <select
                id="unidad_id"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">Seleccione una unidad</option>
                {options.unidades.map(unidad => (
                  <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                ))}
              </select>
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="precio_actual">Precio Actual:</label>
        <form.Field
          name="precio_actual"
          validate={(value) => {
            const result = recursoSchema.shape.precio_actual.safeParse(Number(value));
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <input
                id="precio_actual"
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
        <label htmlFor="tipo_recurso_id">Tipo de Recurso:</label>
        <form.Field
          name="tipo_recurso_id"
          validate={(value) => {
            const result = recursoSchema.shape.tipo_recurso_id.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <select
                id="tipo_recurso_id"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">Seleccione un tipo de recurso</option>
                {options.tiposRecurso.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
              {field.state.meta.touchedErrors ? (
                <span>{field.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <label htmlFor="clasificacion_recurso_id">Clasificación de Recurso:</label>
        <form.Field
          name="clasificacion_recurso_id"
          validate={(value) => {
            const result = recursoSchema.shape.clasificacion_recurso_id.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(field) => (
            <>
              <select
                id="clasificacion_recurso_id"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">Seleccione una clasificación</option>
                {renderClasificaciones(options.clasificaciones)}
              </select>
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