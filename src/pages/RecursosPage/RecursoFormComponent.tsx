import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
})

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
      onSubmit(values.value);
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
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl mx-auto"
    >
      {/* Codigo - AUTOGENERABLE 80000*/}
      {/* <div className="mb-4">
        <label htmlFor="codigo" className="block text-gray-700 text-sm font-bold mb-2">Código:</label>
        <form.Field
          name="codigo"
          children={(field) => (
            <>
              <input
                id="codigo"
                placeholder="Código del recurso"
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
      </div> */}
      {/* Nombre */}
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
        <form.Field
          name="nombre"
          children={(field) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre del recurso"
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
      {/* Precio */}
      <div className="mb-4">
        <label htmlFor="precio_actual" className="block text-gray-700 text-sm font-bold mb-2">Precio Referencial:</label>
        <form.Field
          name="precio_actual"
          children={(field) => (
            <>
              <input
                id="precio_actual"
                placeholder="Nombre del recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                type='number'
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
      {/* Unidad */}
      <div className="mb-4">
        <label htmlFor="unidad_id" className="block text-gray-700 text-sm font-bold mb-2">Unidad:</label>
        <form.Field
          name="unidad_id"
          children={(field) => (
            <>
              <select
                id="unidad_id"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccione una unidad</option>
                {options.unidades.map(unidad => (
                  <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                ))}
              </select>
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      {/* Tipo Recurso */}
      <div className="mb-4">
        <label htmlFor="tipo_recurso_id" className="block text-gray-700 text-sm font-bold mb-2">Tipo de Recurso:</label>
        <form.Field
          name="tipo_recurso_id"
          children={(field) => (
            <>
              <select
                id="tipo_recurso_id"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccione un tipo de recurso</option>
                {options.tiposRecurso.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      {/* Clasificacion Recurso */}
      <div className="mb-4">
        <label htmlFor="clasificacion_recurso_id" className="block text-gray-700 text-sm font-bold mb-2">Clasificación de Recurso:</label>
        <form.Field
          name="clasificacion_recurso_id"
          children={(field) => (
            <>
              <select
                id="clasificacion_recurso_id"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccione una clasificación</option>
                {renderClasificaciones(options.clasificaciones)}
              </select>
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      {/* Descripcion */}
      <div className="mb-4">
        <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
        <form.Field
          name="descripcion"
          children={(field) => (
            <>
              <textarea
                id="descripcion"
                placeholder="Descripción del recurso"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>

      {/* <div className="mb-6">
        <label className="flex items-center">
          <form.Field
            name="presupuesto"
            children={(field) => (
              <input
                id="presupuesto"
                type="checkbox"
                checked={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="mr-2 leading-tight"
              />
            )}
          />
          <span className="text-sm font-bold text-gray-700">Presupuesto</span>
        </label>
      </div> */}

      <div className="flex items-center justify-center">
        <Button
          text={initialValues ? 'Actualizar Recurso' : 'Crear Recurso'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default RecursoFormComponent;