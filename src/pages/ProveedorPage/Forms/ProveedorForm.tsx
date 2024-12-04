import React, { useState } from 'react';
import Button from '../../../components/Buttons/Button';
import { consultarRucService } from '../../../services/proveedorService';

interface ProveedorFormData {
  razon_social: string;
  ruc: string;
  direccion?: string;
  nombre_comercial?: string;
  rubro?: string;
  estado?: string;
}

interface FormErrors {
  razon_social?: string;
  ruc?: string;
}

interface ProveedorFormProps {
  initialValues?: Partial<ProveedorFormData>;
  onSubmit: (data: ProveedorFormData) => void;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState<ProveedorFormData>({
    razon_social: initialValues?.razon_social || '',
    ruc: initialValues?.ruc || '',
    direccion: initialValues?.direccion || '',
    nombre_comercial: initialValues?.nombre_comercial || '',
    rubro: initialValues?.rubro || '',
    estado: initialValues?.estado || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSearching, setIsSearching] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.razon_social) {
      newErrors.razon_social = 'La razón social es requerida';
    }

    if (!formData.ruc) {
      newErrors.ruc = 'El RUC es requerido';
    } else if (formData.ruc.length !== 11) {
      newErrors.ruc = 'El RUC debe tener 11 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleRucSearch = async () => {
    if (!formData.ruc || formData.ruc.length !== 11) {
      setErrors(prev => ({ ...prev, ruc: 'El RUC debe tener 11 caracteres' }));
      return;
    }

    try {
      setIsSearching(true);
      const result = await consultarRucService(formData.ruc);
      setFormData(prev => ({
        ...prev,
        ruc: result.numeroDocumento,
        razon_social: result.razonSocial,
        direccion: result.direccion || '',
      }));
    } catch (error) {
      setErrors(prev => ({ ...prev, ruc: 'Error al consultar el RUC' }));
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="ruc" className="block text-gray-700 text-sm font-bold mb-2">
          RUC:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="ruc"
            name="ruc"
            maxLength={11}
            placeholder="RUC del Proveedor"
            value={formData.ruc}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div
            onClick={handleRucSearch}
            className={`${isSearching ? "cursor-not-allowed bg-gray-400 " : "cursor-pointer"} bg-blue-500 rounded-xl text-white w-auto px-4 py-2 text-sm font-medium`}
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </div>
        </div>
        {errors.ruc && <p className="text-red-500 text-xs italic mt-1">{errors.ruc}</p>}
      </div>

      {/* ...Resto de campos del formulario... */}
      <div className="mb-4">
        <label htmlFor="razon_social" className="block text-gray-700 text-sm font-bold mb-2">
          Razón Social:
        </label>
        <input
          id="razon_social"
          name="razon_social"
          placeholder="Razón Social del Proveedor"
          value={formData.razon_social}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.razon_social && <p className="text-red-500 text-xs italic mt-1">{errors.razon_social}</p>}
      </div>

      {/* ...Campos adicionales... */}
      <div className="mb-4">
        <label htmlFor="direccion" className="block text-gray-700 text-sm font-bold mb-2">
          Dirección:
        </label>
        <input
          id="direccion"
          name="direccion"
          placeholder="Dirección del Proveedor"
          value={formData.direccion}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="nombre_comercial" className="block text-gray-700 text-sm font-bold mb-2">
          Nombre Comercial:
        </label>
        <input
          id="nombre_comercial"
          name="nombre_comercial"
          placeholder="Nombre Comercial"
          value={formData.nombre_comercial}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rubro" className="block text-gray-700 text-sm font-bold mb-2">
          Rubro:
        </label>
        <input
          id="rubro"
          name="rubro"
          placeholder="Rubro del Proveedor"
          value={formData.rubro}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">
          Estado:
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Seleccione un estado</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="flex items-center justify-center mt-6">
        <Button
          text={initialValues ? 'Actualizar Proveedor' : 'Crear Proveedor'}
          color="verde"
          className="w-auto px-6 py-2 text-sm font-medium"
        />
      </div>
    </form>
  );
};

export default ProveedorForm;
