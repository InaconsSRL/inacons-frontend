import React, {  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addAprobacion } from '../../slices/aprobacionesOrdenPagoSlice';
import { uploadArchivo } from '../../slices/archivoPagoSlice';
import { updateOrdenPago } from '../../slices/ordenPagoSlice';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Buttons/Button';
import Toast from '../../components/Toast/Toast';
import { FaSpinner } from 'react-icons/fa'; // Agregar este import
//import { OrdenPagoInput } from '../../types/ordenPago';

interface AprobacionArchivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordenPagoId: string;
  currentEstado: string;
}

const AprobacionArchivoModal: React.FC<AprobacionArchivoModalProps> = ({
  isOpen,
  onClose,
  ordenPagoId,
 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [monto, setMonto] = useState<number | ''>('');
  const [tipoMoneda, setTipoMoneda] = useState('soles');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'warning'>('warning');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Files object:', files);
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      setSelectedFile(null);
      return;
    }

    const file = files[0];
    console.log('Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validaciones básicas
    if (file.size > 5000000) { // 5MB
      alert('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Use PDF, DOC, DOCX, JPG o PNG.');
      return;
    }

    setSelectedFile(file);
    console.log('File successfully set:', file.name);
  };

  const handleSubmitArchivo = async () => {
    if (!selectedFile) {
      setToastMessage('Por favor seleccione un archivo');
      setToastVariant('warning');
      setShowToast(true);
      return;
    }

    if (monto === '') {
      setToastMessage('Por favor ingrese el monto');
      setToastVariant('warning');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Primero subir el archivo
      await dispatch(uploadArchivo({
        ordenPagoId,
        userId: userId || '',
        file: selectedFile
      })).unwrap();

      // Despues registrar aprobación
      await dispatch(addAprobacion({
        usuario_id: userId || '',
        estado: 'APROBADO',
        orden_pago_id: ordenPagoId,
        monto: Number(monto),
        tipo_moneda: tipoMoneda
      })).unwrap();

      setToastMessage('Archivo y aprobación registrados exitosamente');
      setToastVariant('success');
      setShowToast(true);

      // Preguntar si desea finalizar el pago
      const confirmarFinalizacion = window.confirm('¿Desea finalizar el pago?');
      if (confirmarFinalizacion) {
        try {
          const updateData: any = {
            id: ordenPagoId,
            estado: 'FINALIZADO'
          };
          await dispatch(updateOrdenPago(updateData)).unwrap();

          setToastMessage('Pago finalizado exitosamente');
          setToastVariant('success');
          setShowToast(true);
        } catch (error) {
          setToastMessage('Error al finalizar el pago');
          setToastVariant('danger');
          setShowToast(true);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Esperar 2 segundos antes de cerrar para que se vea el mensaje
      await new Promise(resolve => setTimeout(resolve, 2000));
      onClose();
    } catch (error) {
      console.error('Error en el proceso:', error);
      setToastMessage('Error al procesar la solicitud');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTipoMonedaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoMoneda(e.target.value);
  };

  return (
    <Modal title="Confirmar Pago" isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="space-y-6">
          {/* Input de Archivo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Comprobante de Pago
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Archivo seleccionado:</p>
                <ul className="list-disc pl-5">
                  <li>Nombre: {selectedFile.name}</li>
                  <li>Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB</li>
                  <li>Tipo: {selectedFile.type}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Inputs de Monto y Tipo de Moneda */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm  font-medium text-gray-700">
                Monto 
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Moneda
              </label>
              <select
                value={tipoMoneda}
                onChange={handleTipoMonedaChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              >
                <option value="soles">Soles</option>
                <option value="dolares">Dólares</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center space-x-4">
            <Button
              text={
                <div className="flex items-center gap-2">
                  {isSubmitting && (
                    <FaSpinner className="animate-spin" />
                  )}
                  Confirmar
                </div>
              }
              color="verde"
              onClick={handleSubmitArchivo}
              disabled={isSubmitting}
              className="w-[200px]"
            />
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          variant={toastVariant}
          position="top-right"
          duration={3000}
          onClose={() => setShowToast(false)}
          isVisible={showToast}
          index={0}
        />
      )}
    </Modal>
  );
};

export default AprobacionArchivoModal;
