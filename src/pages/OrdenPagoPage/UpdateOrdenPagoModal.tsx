import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateOrdenPago } from '../../slices/ordenPagoSlice';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import { AppDispatch } from '../../store/store';

interface UpdateOrdenPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordenPago: any;
  onSuccess: () => void;
}

const UpdateOrdenPagoModal: React.FC<UpdateOrdenPagoModalProps> = ({
  isOpen,
  onClose,
  ordenPago,
  onSuccess
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [monto, setMonto] = useState(0);
  const [moneda, setMoneda] = useState('');
  const [tipoCambio, setTipoCambio] = useState(0);
  const [tipoComprobante, setTipoComprobante] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);

  useEffect(() => {
    if (ordenPago) {
      setMonto(ordenPago.monto_solicitado);
      setMoneda(ordenPago.tipo_moneda);
      setTipoComprobante(ordenPago.comprobante);
      setTipoPago(ordenPago.tipo_pago);
      setTipoCambio(ordenPago.tipo_cambio || 0);
    }
  }, [ordenPago]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprobanteFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('id', ordenPago.id);
      formData.append('monto_solicitado', monto.toString());
      formData.append('tipo_moneda', moneda);
      formData.append('tipo_pago', tipoPago);
      formData.append('comprobante', tipoComprobante);
      
      if (moneda === 'dolares') {
        formData.append('tipo_cambio', tipoCambio.toString());
        formData.append('monto_soles', (tipoCambio * monto).toString());
      }

      if (comprobanteFile) {
        formData.append('comprobante_file', comprobanteFile);
      }

      await dispatch(updateOrdenPago(formData));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizar Orden de Pago">
      <div className="p-4">
        <div className="space-y-4">
          {/* Campo Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Campo Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Moneda</label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">--Seleccione--</option>
              <option value="soles">Soles</option>
              <option value="dolares">Dólares</option>
            </select>
          </div>

          {/* Campo Tipo de Comprobante */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Comprobante</label>
            <select
              value={tipoComprobante}
              onChange={(e) => setTipoComprobante(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">--Seleccione--</option>
              <option value="factura">Factura</option>
              <option value="recibo">Recibo por honorarios</option>
            </select>
          </div>

          {/* Campo Tipo de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Pago</label>
            <select
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">--Seleccione--</option>
              <option value="adelanto">Adelanto</option>
              <option value="contraentrega">Contra Entrega</option>
              <option value="credito">Crédito</option>
            </select>
          </div>

          {/* Campo Archivo Comprobante */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comprobante (Factura/Boleta)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                border border-gray-300 rounded-md shadow-sm"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
          </div>

          {/* Campo Tipo de Cambio (condicional) */}
          {moneda === 'dolares' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Cambio
                </label>
                <input
                  type="number"
                  value={tipoCambio}
                  onChange={(e) => setTipoCambio(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto en Soles
                </label>
                <input
                  type="number"
                  value={tipoCambio * monto}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            text="Cancelar"
            color="gris"
            onClick={onClose}
          />
          <Button
            text="Actualizar"
            color="azul"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateOrdenPagoModal;
