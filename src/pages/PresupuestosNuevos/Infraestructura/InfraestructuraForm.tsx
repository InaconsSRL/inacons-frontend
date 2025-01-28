import React from 'react';
import type { IInfraestructura } from '../../../types/PresupuestosTypes';

interface InfraestructuraFormProps {
  initialValues?: IInfraestructura;
  onSubmit: (data: Omit<IInfraestructura, 'id_infraestructura'>) => void;
}

const InfraestructuraForm: React.FC<InfraestructuraFormProps> = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = React.useState<Omit<IInfraestructura, 'id_infraestructura'>>({
    nombre_infraestructura: initialValues?.nombre_infraestructura || '',
    tipo_infraestructura: initialValues?.tipo_infraestructura || '',
    descripcion: initialValues?.descripcion || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="nombre_infraestructura" className="text-sm font-medium text-gray-700">
          Nombre de la Infraestructura
        </label>
        <input
          type="text"
          id="nombre_infraestructura"
          name="nombre_infraestructura"
          value={formData.nombre_infraestructura}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="tipo_infraestructura" className="text-sm font-medium text-gray-700">
          Tipo de Infraestructura
        </label>
        <select
          id="tipo_infraestructura"
          name="tipo_infraestructura"
          value={formData.tipo_infraestructura}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione un tipo</option>
          <option value="EDUCATIVA">Educativa</option>
          <option value="SALUD">Salud</option>
          <option value="VIAL">Vial</option>
          <option value="CIVIL">Civil</option>
          <option value="OTROS">Otros</option>
          <option value="DEPORTIVA">Deportiva</option>
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialValues ? 'Actualizar' : 'Crear'} Infraestructura
        </button>
      </div>
    </form>
  );
};

export default InfraestructuraForm;
