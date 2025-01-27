import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addAprobacion } from '../../slices/aprobacionesOrdenPagoSlice';
import { uploadArchivo } from '../../slices/archivoPagoSlice';
import { updateOrdenPago } from '../../slices/ordenPagoSlice';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Buttons/Button';
import Toast from '../../components/Toast/Toast';

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
  currentEstado,
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
    console.log('Starting submit with file:', selectedFile);
    if (!selectedFile) {
      setToastMessage('Por favor seleccione un archivo');
      setToastVariant('warning');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Crear y verificar FormData
      const formData = new FormData();
      
      // Agregar y verificar cada campo
      formData.append('operations', JSON.stringify({
        query: `
          mutation UploadArchivoPago($orden_pago_id: ID!, $usuario_id: ID!, $file: Upload!) {
            uploadArchivoPago(orden_pago_id: $orden_pago_id, usuario_id: $usuario_id, file: $file) {
              id
            }
          }
        `,
        variables: {
          orden_pago_id: ordenPagoId,
          usuario_id: userId,
          file: null
        }
      }));

      // Agregar el map
      formData.append('map', JSON.stringify({
        "0": ["variables.file"]
      }));

      // Agregar y verificar el archivo
      formData.append('0', selectedFile);

      // Depurar el FormData
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: value.size
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Verificar el archivo antes de enviarlo
      const fileInFormData = formData.get('0');
      console.log('File in FormData:', fileInFormData instanceof File ? {
        name: fileInFormData.name,
        type: fileInFormData.type,
        size: fileInFormData.size
      } : 'No file found');

      // Intentar enviar
      const result = await dispatch(uploadArchivo({
        ordenPagoId,
        userId: userId || '',
        file: formData
      })).unwrap();

      console.log('Upload result:', result);

      // Si hay monto, registrar aprobación
      if (monto !== '') {
        await dispatch(addAprobacion({
          usuario_id: userId || '',
          estado: 'APROBADO',
          orden_pago_id: ordenPagoId,
          monto: Number(monto),
          tipo_moneda: tipoMoneda
        })).unwrap();
      }

      setToastMessage('Archivo subido exitosamente');
      setToastVariant('success');
      setShowToast(true);
      
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('Upload error full details:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      setToastMessage('Error al procesar la solicitud');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizarPago = async () => {
    if (monto === '') {
      setToastMessage('Debe ingresar el monto para finalizar el pago');
      setToastVariant('warning');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Actualizar estado de la orden
      await dispatch(updateOrdenPago({
        id: ordenPagoId,
        estado: 'FINALIZADO'
      })).unwrap();

      setToastMessage('Pago finalizado exitosamente');
      setToastVariant('success');
      setShowToast(true);
      
      setTimeout(onClose, 2000);
    } catch (error) {
      setToastMessage('Error al finalizar el pago');
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
              <label className="block text-sm font-medium text-gray-700">
                Monto (obligatorio si va a finalizar el Pago)
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="soles">Soles</option>
                <option value="dolares">Dólares</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <Button
              text="Confirmar"
              color="verde"
              onClick={handleSubmitArchivo}
              disabled={isSubmitting}
            />
            <Button
              text="Finalizar Pago"
              color="azul"
              onClick={handleFinalizarPago}
              disabled={isSubmitting}
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
