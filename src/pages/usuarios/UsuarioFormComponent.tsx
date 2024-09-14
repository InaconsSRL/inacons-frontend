import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const usuarioSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  dni: z.string().min(8, 'El DNI debe tener al menos 8 caracteres'),
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
  const form = useForm<UsuarioFormData>({
    defaultValues: initialValues || {
      nombres: '',
      apellidos: '',
      dni: '',
      usuario: '',
      contrasenna: '',
      cargo_id: '',
      rol_id: '',
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
      {['nombres', 'apellidos', 'dni', 'usuario', 'contrasenna', 'rol_id'].map((field) => (
        <div key={field}>
          <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          <form.Field
            name={field as keyof UsuarioFormData}
            validate={(value) => {
              const result = usuarioSchema.shape[field as keyof UsuarioFormData].safeParse(value);
              return result.success ? undefined : result.error.message;
            }}
          >
            {(fieldProps) => (
              <>
                <input
                  id={field}
                  placeholder={`Ingrese ${field}`}
                  value={fieldProps.state.value}
                  onBlur={fieldProps.handleBlur}
                  onChange={(e) => fieldProps.handleChange(e.target.value)}
                />
                {fieldProps.state.meta.touchedErrors ? (
                  <span>{fieldProps.state.meta.touchedErrors}</span>
                ) : null}
              </>
            )}
          </form.Field>
        </div>
      ))}
      <div>
        <label htmlFor="cargo_id">Cargo:</label>
        <form.Field
          name="cargo_id"
          validate={(value) => {
            const result = usuarioSchema.shape.cargo_id.safeParse(value);
            return result.success ? undefined : result.error.message;
          }}
        >
          {(fieldProps) => (
            <>
              <select
                id="cargo_id"
                value={fieldProps.state.value}
                onBlur={fieldProps.handleBlur}
                onChange={(e) => fieldProps.handleChange(e.target.value)}
              >
                <option value="">Seleccione un cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </option>
                ))}
              </select>
              {fieldProps.state.meta.touchedErrors ? (
                <span>{fieldProps.state.meta.touchedErrors}</span>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <button type="submit">
        {initialValues ? 'Actualizar Usuario' : 'Crear Usuario'}
      </button>
    </form>
  );
};

export default UsuarioFormComponent;