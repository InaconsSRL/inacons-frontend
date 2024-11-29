import React, { useState } from 'react';
import Button from '../../../components/Buttons/Button';

interface MediosPagoData {
  cuenta_bcp: string;
  cuenta_bbva: string;
  yape: string;
}

interface MediosPagoFormProps {
  onSubmit: (data: MediosPagoData) => void;
  onCancel: () => void;
  initialData?: MediosPagoData;
}

const MediosPagoForm: React.FC<MediosPagoFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    cuenta_bcp: initialData?.cuenta_bcp || '',
    cuenta_bbva: initialData?.cuenta_bbva || '',
    yape: initialData?.yape || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Entidad</label>
        <input
          type="text"
          name="cuenta_bcp"
          value={formData.cuenta_bcp}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">NroCuenta</label>
        <input
          type="text"
          name="cuenta_bbva"
          value={formData.cuenta_bbva}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notas</label>
        <input
          type="text"
          name="yape"
          value={formData.yape}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button text="Cancelar" color="rojo" onClick={onCancel} />
        <Button text="Guardar" color="verde" />
      </div>
    </form>
  );
};

export default MediosPagoForm;