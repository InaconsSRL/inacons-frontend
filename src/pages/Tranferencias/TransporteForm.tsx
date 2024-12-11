import { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io"; 
import GuiaTransfer from './Recepcion de Transferencias/GuiaTransfer';

interface TransportFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;  
}

export function TransportForm({ onSubmit, onClose }: TransportFormProps) {
  const [formData, setFormData] = useState({
    orderNumber: '',
    orderCode: '',
    notes: '',
    transportType: '',
    loadDate: null as Date | null,
    selectedType: 'encomienda', 
  });
  const [isModalOpen, setIsModalOpen] = useState(false); 

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
    const selectedDate = new Date(e.target.value);
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
    <div className="relative">
      <button onClick={onClose} className=" space-y-5 absolute top-2 right-3">
        <IoMdCloseCircle className="h-6 w-6 text-red-600 text-xl" />
      </button>
      <form onSubmit={handleSubmit} className="space-y-9 bg-blue-50 p-4 rounded-lg pt-10">
        {/* Botones para seleccionar tipo de transporte */}
        <div className="w-full mb-9">
          <div className="grid w-full grid-cols-2 gap-4"> {/* Agregar espacio entre botones */}
            <button
              type="button"
              onClick={() => handleTypeChange('encomienda')}
              className={`text-lg bg-blue-950 hover:bg-blue-800 text-white rounded-lg py-2 ${formData.selectedType === 'encomienda' ? 'font-bold' : ''}`}
            >
              Encomienda
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('movilidad')}
              className={`text-lg bg-blue-950 hover:bg-blue-800 text-white rounded-lg py-2 ${formData.selectedType === 'movilidad' ? 'font-bold' : ''}`}
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
                className="bg-white bg-opacity-90 p-2 rounded-lg w-full"
              />
            </div>
            <div>
              <input
                placeholder="Código de Orden"
                name="orderCode"
                value={formData.orderCode}
                onChange={handleChange}
                className="bg-white bg-opacity-90 p-2 rounded-lg w-full"
              />
            </div>
            <div>
              <textarea
                placeholder="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="min-h-[150px] bg-white bg-opacity-90 p-2 rounded-lg w-full"
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
                className="bg-white bg-opacity-90 p-2 rounded-lg w-full"
              />
            </div>
            <div>
              <input 
              placeholder='Fecha de Carga '
                type='date' 
                name="loadDate"
                value={formData.loadDate ? formData.loadDate.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                className={`w-full justify-start text-left font-normal bg-white bg-opacity-90 p-2 rounded-lg ${!formData.loadDate ? 'text-muted-foreground' : ''}`}
              />
              
            </div>
            <div>
              <textarea
                placeholder="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="min-h-[150px] bg-white bg-opacity-90 p-2 rounded-lg w-full"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-between pt-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg">
            Guardar
          </button>
          <button
            type="button"
            className=" bg-blue-950 bg-navy-900 hover:bg-navy-800 text-white px-8 py-2 rounded-lg"
            onClick={() => setIsModalOpen(true)}  
          >
            Generar Guia de Transferencia
          </button>
        </div>
        {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-4">
      <GuiaTransfer onClose={() => setIsModalOpen(false)} numero={0} solicita={''} recibe={''} fEmision={undefined} estado={''} obra={''} transferenciaId={''} onSubmit={function (data: any): void {
                throw new Error('Function not implemented.');
              } } />
    </div>
  </div>
)}
      </form>
    </div>
  );
}
