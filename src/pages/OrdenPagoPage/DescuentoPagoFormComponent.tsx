import React, { useState, useEffect } from 'react';
import { OrdenPagoDescuento } from '../../slices/descuentoPagoSlice';
import { calcularDescuento } from '../../components/Utils/calculosUtils';

interface DescuentoPagoFormProps {
  initialValues?: OrdenPagoDescuento;
  onSubmit: (values: Partial<OrdenPagoDescuento>) => void;
  ordenPagoId?: string;
  tipoDescuento?: 'detracciones' | 'retenciones' | null;
}

// Agregamos la interfaz para los valores del formulario
interface FormValues {
  tipo: string;
  monto: number;
  detalle: string;
  porcentaje: number;
  montoBase: number;
}

const DescuentoPagoFormComponent: React.FC<DescuentoPagoFormProps> = ({
  initialValues,
  onSubmit,
  ordenPagoId,
}) => {
  const [formValues, setFormValues] = useState<FormValues>({
    tipo: initialValues?.tipo || '',
    monto: initialValues?.monto || 0,
    detalle: initialValues?.detalle || '',
    porcentaje: initialValues?.tipo === 'retencion' ? 3 : 
                initialValues?.tipo === 'detraccion' ? 12 : 0,
    montoBase: initialValues?.monto || 0
  });

  // Handler para cambio de tipo de descuento
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    setFormValues(prev => ({
      ...prev,
      tipo,
      porcentaje: tipo === 'retencion' ? 3 : 
                  tipo === 'detraccion' ? 12 :
                  tipo === 'pendiente' ? 100 : 0
    }));

    // Recalcular monto si hay monto base
    if (formValues.montoBase > 0) {
      const resultado = calcularDescuento(
        tipo,
        formValues.montoBase,
        tipo === 'retencion' ? 3 : formValues.porcentaje
      );
      setFormValues(prev => ({ ...prev, monto: resultado }));
    }
  };

  // Calcular monto cuando cambian porcentaje o monto base
  useEffect(() => {
    if (!formValues.tipo || formValues.montoBase < 0 || formValues.porcentaje < 0) {
      setFormValues(prev => ({ ...prev, monto: 0 }));
      return;
    }

    const resultado = calcularDescuento(
      formValues.tipo,
      formValues.montoBase,
      formValues.tipo === 'retencion' ? 3 : formValues.porcentaje
    );
    
    setFormValues(prev => ({ ...prev, monto: resultado }));
  }, [formValues.tipo, formValues.porcentaje, formValues.montoBase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formValues,
      orden_pago_id: {
        id: ordenPagoId || '',
        codigo: '',
        monto_solicitado: 0,
        tipo_moneda: '',
        tipo_pago: '',
        estado: '',
        observaciones: '',
        comprobante: '',
        fecha: ''
      },
      estado: 'ACTIVO'  // Now this is properly typed
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Descuento
        </label>
        <select 
          id="tipo" 
          value={formValues.tipo}
          onChange={handleTipoChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Seleccione</option>
          <option value="detraccion">Detracción</option>
          <option value="retencion">Retención (3%)</option>
          <option value="pendiente">Pendientes</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="porcentaje" className="block text-sm font-medium text-gray-700 mb-1">
            Porcentaje
          </label>
          <input 
            type="number"
            id="porcentaje"
            value={formValues.porcentaje}
            onChange={(e) => setFormValues(prev => ({ 
              ...prev, 
              porcentaje: Number(e.target.value)
            }))}
            disabled={formValues.tipo === 'retencion'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md
              ${formValues.tipo === 'retencion' ? 'bg-gray-100' : ''}`}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="montoBase" className="block text-sm font-medium text-gray-700 mb-1">
            Monto Base
          </label>
          <input 
            type="number"
            id="montoBase"
            value={formValues.montoBase}
            onChange={(e) => setFormValues(prev => ({ 
              ...prev, 
              montoBase: Number(e.target.value)
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
          Monto Calculado
        </label>
        <input 
          type="number"
          id="monto"
          value={formValues.monto}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
        />
      </div>

      <div>
        <label htmlFor="detalle" className="block text-sm font-medium text-gray-700 mb-1">
          Detalle
        </label>
        <textarea 
          id="detalle"
          value={formValues.detalle}
          onChange={(e) => setFormValues(prev => ({ ...prev, detalle: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        {initialValues ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
};

export default DescuentoPagoFormComponent;
