import { useState } from 'react';
import { CiCalendar } from "react-icons/ci";

interface TransportFormProps {
  onSubmit: (data: any) => void;
}

export function TransportForm({ onSubmit }: TransportFormProps) {
  const [formData, setFormData] = useState({
    orderNumber: '',
    orderCode: '',
    notes: '',
    transportType: '',
    loadDate: null as Date | null, // Aquí se maneja la fecha de carga
    selectedType: 'encomienda', // Estado para manejar el tipo de transporte seleccionado
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value); // Convierte la fecha seleccionada a un objeto Date
    setFormData((prev) => ({
      ...prev,
      loadDate: selectedDate,
    }));
  };

  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedType: type,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Botones para seleccionar tipo de transporte */}
      <div className="w-full mb-8">
        <div className="grid w-full grid-cols-2">
          <button
            type="button"
            onClick={() => handleTypeChange('encomienda')}
            className={`text-lg ${formData.selectedType === 'encomienda' ? 'font-bold' : ''}`}
          >
            Encomienda
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('movilidad')}
            className={`text-lg ${formData.selectedType === 'movilidad' ? 'font-bold' : ''}`}
          >
            RQ.Movilidad
          </button>
        </div>
      </div>

      {/*  encomienda */}
      {formData.selectedType === 'encomienda' && (
        <div className="space-y-4">
          <div>
            <input
              placeholder="N° de Orden"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              className="bg-white bg-opacity-90"
            />
          </div>
          <div>
            <input
              placeholder="Código de Orden"
              name="orderCode"
              value={formData.orderCode}
              onChange={handleChange}
              className="bg-white bg-opacity-90"
            />
          </div>
          <div>
            <textarea
              placeholder="Notas"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[150px] bg-white bg-opacity-90"
            />
          </div>
        </div>
      )}

      {/*  rq movilidad */}
      {formData.selectedType === 'movilidad' && (
        <div className="space-y-4">
          <div>
            <input
              placeholder="Tipo de Transporte"
              name="transportType"
              value={formData.transportType}
              onChange={handleChange}
              className="bg-white bg-opacity-90"
            />
          </div>
          <div>
            {/* fecha de carga */}
            <input 
              type='date' 
              name="loadDate"
              value={formData.loadDate ? formData.loadDate.toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className={`w-full justify-start text-left font-normal bg-white bg-opacity-90 ${!formData.loadDate ? 'text-muted-foreground' : ''}`}
            />
            <CiCalendar className="mr-2 h-4 w-4" />
            {formData.loadDate ? (
             
              formData.loadDate.toLocaleDateString()
            ) : (
              <span>Fecha de Carga</span>
            )}
          </div>
          <div>
            <textarea
              placeholder="Notas"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[150px] bg-white bg-opacity-90"
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-between pt-4">
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">
          Guardar
        </button>
        <button
          type="button"
          className="bg-navy-900 hover:bg-navy-800 text-white px-8 py-2"
          onClick={() => {}}
        >
          Generar Guia de Transferencia
        </button>
      </div>
    </form>
  );
}
