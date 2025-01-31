import React, { useEffect } from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import Button from '../../components/Buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchTipoAlmacenes } from '../../slices/tipoAlmacenSlice';
import { fetchEmpresas } from '../../slices/empresaSlice';

interface ObraInput {
  titulo: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  direccion: string;
  estado: string;
  tipoId: string;
  empresaId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const obraSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  estado: z.string().min(1, 'El estado es requerido'),
  tipoId: z.string().min(1, 'El tipo de obra es requerido'),
  empresaId: z.string().min(1, 'La empresa es requerida'),
});

type ObraFormData = z.infer<typeof obraSchema>;

interface FormComponentProps {
  initialValues?: ObraInput;
  onSubmit: (data: ObraInput) => void;
}

const ObraFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tipoAlmacenes } = useSelector((state: RootState) => state.tipoAlmacen);
  const { empresas } = useSelector((state: RootState) => state.empresa);

  useEffect(() => {
    // Solo realizar la consulta si no hay tipos de almacén en el estado
    if (tipoAlmacenes.length === 0) {
      dispatch(fetchTipoAlmacenes());
    }
    if (empresas.length === 0) {
      dispatch(fetchEmpresas());
    }
  }, [dispatch, tipoAlmacenes.length, empresas.length]);

  const form = useForm<ObraFormData>({
    defaultValues: {
      titulo: initialValues?.titulo || '',
      nombre: initialValues?.nombre || '',
      descripcion: initialValues?.descripcion || '',
      ubicacion: initialValues?.ubicacion || '',
      direccion: initialValues?.direccion || '',
      estado: initialValues?.estado || '',
      tipoId: initialValues?.tipoId || '',
      empresaId: initialValues?.empresaId || ''
    },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className=" bg-gradient-to-b from-white to-gray-100 shadow-lg rounded-lg px-6 sm:px-8 py-8 mb-4 w-full mx-auto border border-gray-200"
    >
      <div className="mb-6 w-full">
        <label htmlFor="titulo" className="block text-blue-700 text-sm font-semibold mb-2">
          Título:
          <span className='text-neutral-300 text-xs '>(Ejm: "CU_PLAN3")</span>
        </label>
        <form.Field
          name="titulo"
          children={(field: FieldApi<ObraFormData, 'titulo'>) => (
            <>
              <input
                id="titulo"
                placeholder="Título de la obra"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="nombre" className="block text-blue-700 text-sm font-semibold mb-2">
          Nombre:
          <span className='text-neutral-300 text-xs '>(Ejm: "CU PLAN3")</span>
        </label>
        <form.Field
          name="nombre"
          children={(field: FieldApi<ObraFormData, 'nombre'>) => (
            <>
              <input
                id="nombre"
                placeholder="Nombre de la obra"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="descripcion" className="block text-blue-700 text-sm font-semibold mb-2">
          Descripción:
        </label>
        <form.Field
          name="descripcion"
          children={(field: FieldApi<ObraFormData, 'descripcion'>) => (
            <>
              <textarea
                id="descripcion"
                placeholder="Descripción de la obra"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out h-32 resize-none"
              />
              {field.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              ) : null}
            </>
          )}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="ubicacion" className="block text-blue-700 text-sm font-semibold mb-2">
          Ubicación:
          <span className='text-neutral-300 text-xs '>(Ejm: "-12.456789, -75.654987")</span>
        </label>
        <form.Field
          name="ubicacion"
          children={(field: FieldApi<ObraFormData, 'ubicacion'>) => (
            <>
              <input
                id="ubicacion"
                placeholder="Ubicación de la obra"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {field.state.meta.errors && (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="direccion" className="block text-blue-700 text-sm font-semibold mb-2">
          Dirección:
        </label>
        <form.Field
          name="direccion"
          children={(field: FieldApi<ObraFormData, 'direccion'>) => (
            <>
              <input
                id="direccion"
                placeholder="Dirección de la obra"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {field.state.meta.errors && (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="estado" className="block text-blue-700 text-sm font-semibold mb-2">
          Estado:
        </label>
        <form.Field
          name="estado"
          children={(field: FieldApi<ObraFormData, 'estado'>) => (
            <>
              <select
                id="estado"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione un estado</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="COMPLETADO">Completado</option>
              </select>
              {field.state.meta.errors && (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="tipoId" className="block text-blue-700 text-sm font-semibold mb-2">
          Tipo de Obra:
        </label>
        <form.Field
          name="tipoId"
          children={(field: FieldApi<ObraFormData, 'tipoId'>) => (
            <>
              <select
                id="tipoId"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione un tipo</option>
                {tipoAlmacenes.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              {field.state.meta.errors && (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="empresaId" className="block text-blue-700 text-sm font-semibold mb-2">
          Empresa:
        </label>
        <form.Field
          name="empresaId"
          children={(field: FieldApi<ObraFormData, 'empresaId'>) => (
            <>
              <select
                id="empresaId"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre_comercial}
                  </option>
                ))}
              </select>
              {field.state.meta.errors && (
                <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors[0]}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="flex items-center justify-center mt-8">
        <Button
          text={initialValues ? 'Actualizar Obra' : 'Crear Obra'}
          color="verde"
          className="w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-md shadow-sm hover:shadow-md transition duration-150 ease-in-out"
        />
      </div>
    </form>
  );
};

export default ObraFormComponent