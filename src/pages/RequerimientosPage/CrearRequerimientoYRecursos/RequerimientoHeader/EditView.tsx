import React, { memo } from 'react';
import { FormData, Requerimiento } from './types';

interface EditViewProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsEditing: (value: boolean) => void;
  requerimiento: Requerimiento;
  obras: { obras: { id: string; nombre: string }[] };
  onCancel: () => void;  // Añadir esta prop
}

export const EditView: React.FC<EditViewProps> = memo(({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  requerimiento, 
  obras,
  onCancel 
}) => (
    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-x-4 bg-black/70 px-2 rounded-lg">
      <div>
        <span className="block font-bold text-base text-zinc-400">Código:</span>
        <p className="tw-full rounded text-base text-white p-1">{formData.codigo || '-'}</p>
      </div>
  
      <div>
        <label className="block font-bold text-base text-zinc-400">Usuario:</label>
        <p className="w-full rounded text-base text-white p-1">
          {requerimiento.usuario}
        </p>
      </div>
  
      <div>
        <label className="block font-bold text-base text-zinc-400">Cambiar Obra:</label>
        <select
          name="obra_id"
          value={formData.obra_id}
          onChange={handleInputChange}
          className="w-full border rounded text-base p-1"
        >
          <option value="">Seleccionar</option>
          {obras.obras.map((obra) => (
            <option key={obra.id} value={obra.id}>{obra.nombre}</option>
          ))}
        </select>
      </div>
  
      <div>
        <label className="block font-bold text-base text-zinc-400">Modificar Fecha Final:</label>
        <input
          name="fecha_final"
          type="date"
          value={formData.fecha_final}
          onChange={handleInputChange}
          className="w-full border rounded text-base p-1"
        />
      </div>
  
      <div className="col-span-3">
        <label className="block font-bold text-base text-zinc-400">Modificar Sustento:</label>
        <textarea
          name="sustento"
          value={formData.sustento}
          onChange={handleInputChange}
          className="w-full border rounded text-base p-1 h-8"
        />
      </div>
  
      <div className="flex items-end pb-2 gap-3">
        <button
          type='submit'
          className="w-full bg-green-500 text-white rounded text-base p-1.5"
        >
          Guardar
        </button>
        <button
          onClick={onCancel}  // Cambiar aquí
          color='rojo'
          className="w-full bg-red-500 text-white rounded text-base p-1.5"
        >Cancelar
        </button>
      </div>
    </form>
  ));