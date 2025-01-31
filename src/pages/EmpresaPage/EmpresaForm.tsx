import React, { useState } from 'react';
import Button from '../../components/Buttons/Button';
import type { Empresa } from '../../slices/empresaSlice';
import { consultarRucService } from '../../services/proveedorService';

export type EmpresaFormData = Omit<Empresa, 'id'>;

interface EmpresaFormProps {
  initialValues?: Partial<EmpresaFormData>;
  onSubmit: (data: EmpresaFormData) => void;
}

const EmpresaForm: React.FC<EmpresaFormProps> = ({ initialValues, onSubmit }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState<EmpresaFormData>({
    nombre_comercial: initialValues?.nombre_comercial || '',
    razon_social: initialValues?.razon_social || '',
    estado: initialValues?.estado || '',
    regimen_fiscal: initialValues?.regimen_fiscal || '',
    ruc: initialValues?.ruc || '',
    descripcion: initialValues?.descripcion || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(formData);
  };

  const handleRucSearch = async () => {
    if (!formData.ruc || formData.ruc.length !== 11) {
      return;
    }

    try {
      setIsSearching(true);
      const result = await consultarRucService(formData.ruc);
      setFormData(prev => ({
        ...prev,
        razon_social: result.razonSocial,
        nombre_comercial: result.razonSocial,
      }));
    } catch (error) {
      console.error('Error al consultar RUC:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1" htmlFor="ruc">
          RUC:
        </label>
        <div className="flex gap-2">
          <input
            id="ruc"
            name="ruc"
            value={formData.ruc}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            maxLength={11}
          />
          <div
            onClick={handleRucSearch}
            className={`${
              isSearching ? "cursor-not-allowed bg-gray-400" : "cursor-pointer bg-blue-500"
            } rounded-xl text-white w-auto px-4 py-2 text-sm font-medium`}
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1" htmlFor="nombre_comercial">
          Nombre Comercial:
        </label>
        <input
          id="nombre_comercial"
          name="nombre_comercial"
          value={formData.nombre_comercial}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1" htmlFor="razon_social">
          Razón Social:
        </label>
        <input
          id="razon_social"
          name="razon_social"
          value={formData.razon_social}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1" htmlFor="estado">
          Estado:
        </label>
        <input
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1" htmlFor="regimen_fiscal">
          Régimen Fiscal:
        </label>
        <input
          id="regimen_fiscal"
          name="regimen_fiscal"
          value={formData.regimen_fiscal}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>


      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1" htmlFor="descripcion">
          Descripción:
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button text={initialValues ? 'Actualizar Empresa' : 'Crear Empresa'} color="verde" />
      </div>
    </form>
  );
};

export default EmpresaForm;
