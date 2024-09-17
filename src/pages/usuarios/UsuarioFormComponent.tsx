import React, { useState } from 'react';
import { useForm, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import EyeIcon from '../../components/Icons/EyeIcon';
import EyeSlashIcon from '../../components/Icons/EyeSlashIcon';
import Button from '../../components/Buttons/Button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usuarioSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  dni: z.number().int().min(10000000, 'El DNI debe tener al menos 8 dígitos'),
  usuario: z.string().min(1, 'El usuario es requerido'),
  contrasenna: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  cargo_id: z.string().min(1, 'El cargo es requerido'),
  rol_id: z.string().min(1, 'El rol es requerido'),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
}

interface FormComponentProps {
  initialValues?: UsuarioFormData;
  onSubmit: (data: UsuarioFormData) => void;
  cargos: Cargo[];
}

const UsuarioFormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit, cargos }) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<UsuarioFormData>({
    defaultValues: initialValues || {
      nombres: '',
      apellidos: '',
      dni: 0,
      usuario: '',
      contrasenna: '',
      cargo_id: '',
      rol_id: '',
    },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      {['nombres', 'apellidos', 'usuario', 'rol_id'].map((field) => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-gray-700 text-sm font-bold mb-2">
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <form.Field
            name={field as keyof UsuarioFormData}
          >
            {(fieldProps: FieldApi<UsuarioFormData, keyof UsuarioFormData>) => (
              <>
                <input
                  id={field}
                  placeholder={`Ingrese ${field}`}
                  value={fieldProps.state.value as string}
                  onBlur={fieldProps.handleBlur}
                  onChange={(e) => fieldProps.handleChange(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {fieldProps.state.meta.errors ? (
                  <p className="text-red-500 text-xs italic mt-1">{fieldProps.state.meta.errors}</p>
                ) : null}
              </>
            )}
          </form.Field>
        </div>
      ))}
      <div className="mb-4">
        <label htmlFor="dni" className="block text-gray-700 text-sm font-bold mb-2">DNI:</label>
        <form.Field
          name="dni"
        >
          {(fieldProps: FieldApi<UsuarioFormData, "dni">) => (
            <>
              <input
                id="dni"
                type="number"
                placeholder="Ingrese DNI"
                value={fieldProps.state.value || ''}
                onBlur={fieldProps.handleBlur}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  fieldProps.handleChange(value);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {fieldProps.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{fieldProps.state.meta.errors}</p>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <div className="mb-4">
        <label htmlFor="contrasenna" className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
        <form.Field
          name="contrasenna"
        >
          {(fieldProps: FieldApi<UsuarioFormData, "contrasenna">) => (
            <div className="relative">
              <input
                id="contrasenna"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese contraseña"
                value={fieldProps.state.value}
                onBlur={fieldProps.handleBlur}
                onChange={(e) => fieldProps.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {fieldProps.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{fieldProps.state.meta.errors}</p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>
      <div className="mb-4">
        <label htmlFor="cargo_id" className="block text-gray-700 text-sm font-bold mb-2">Cargo:</label>
        <form.Field
          name="cargo_id"
        >
          {(fieldProps: FieldApi<UsuarioFormData, "cargo_id">) => (
            <>
              <select
                id="cargo_id"
                value={fieldProps.state.value}
                onBlur={fieldProps.handleBlur}
                onChange={(e) => fieldProps.handleChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccione un cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </option>
                ))}
              </select>
              {fieldProps.state.meta.errors ? (
                <p className="text-red-500 text-xs italic mt-1">{fieldProps.state.meta.errors}</p>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues ? 'Actualizar Usuario' : 'Crear Usuario'}
          onClick={() => form.handleSubmit()}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default UsuarioFormComponent;