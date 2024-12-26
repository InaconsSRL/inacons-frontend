import React, { useState, useEffect } from 'react';
import LoaderPage from '../../components/Loader/LoaderPage';
import type { Cargo } from '../../slices/cargoSlice';
import type { Empleado } from '../../slices/empleadoSlice';

interface FormData {
  id?: string;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  telefono_secundario?: string;
  cargo_id: string;
}

interface EmpleadoFormProps {
  initialValues: FormData;
  onSubmit: (data: FormData) => Promise<Empleado | undefined>;
  cargos: Cargo[];
}

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => (
  <label {...props} className="block text-xs font-medium text-gray-700 mb-1">
    {props.children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full border rounded-md p-2 mt-1" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="w-full border rounded-md p-2 mt-1">
    {props.children}
  </select>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'primary' }> = ({
  variant = 'outline',
  children,
  ...props
}) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md ${variant === 'primary'
        ? 'bg-blue-500 text-white hover:bg-blue-600'
        : 'border border-gray-300 bg-white hover:bg-gray-50'
      }`}
  >
    {children}
  </button>
);

const NewEmpleadoForm: React.FC<EmpleadoFormProps> = ({ initialValues, onSubmit, cargos }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialValues);
  const [isEditing] = useState(!!initialValues.id);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      alert('Empleado guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el empleado');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoaderPage />;

  return (
    <form onSubmit={handleSubmit} className="rounded-lg max-w-4xl mx-auto text-xs">
      <div className="bg-gray-200 shadow-md rounded-lg px-4 py-2">


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="nombres">Nombres</Label>
            <Input
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="telefono">Teléfono Principal</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="telefono_secundario">Teléfono Secundario</Label>
            <Input
              id="telefono_secundario"
              name="telefono_secundario"
              value={formData.telefono_secundario || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="cargo_id">Cargo</Label>
            <Select
              id="cargo_id"
              name="cargo_id"
              value={formData.cargo_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un cargo</option>
              {cargos.map(cargo => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nombre}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-full h-0.5 bg-blue-800/20 rounded-full my-4"></div>
          <div className="flex justify-end p-2">
            <Button type="submit" variant="primary">
              {isEditing ? 'Actualizar Empleado' : 'Crear Empleado'}
            </Button>
          </div>

        </div>
      </div>
    </form>
  );
};

export default NewEmpleadoForm;
