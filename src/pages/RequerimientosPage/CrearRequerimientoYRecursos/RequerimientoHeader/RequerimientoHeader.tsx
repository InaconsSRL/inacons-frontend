import React, { useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../store/store';
import { updateRequerimiento } from '../../../../slices/requerimientoSlice';
import LoaderPage from '../../../../components/Loader/LoaderPage';
import Toast from '../../../../components/Toast/Toast';
import { ReadOnlyView } from './ReadOnlyView';
import { EditView } from './EditView';
import { formatDateForInput } from '../../../../components/Utils/dateUtils';
import { Requerimiento, FormData } from './types';

interface DetalleRequerimientoProps {
  requerimiento: Requerimiento;
  obras: {
    obras: { id: string; nombre: string }[];
  };
  onClose: () => void;
}

const RequerimientoHeader: React.FC<DetalleRequerimientoProps> = memo(({ requerimiento, obras, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { usuariosCargo } = useSelector((state: RootState) => state.usuario);
  console.log('Usuarios Cargo:', usuariosCargo);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => ({
    usuario_id: requerimiento.usuario_id || '',
    obra_id: requerimiento.obra_id || '',
    fecha_final: formatDateForInput(requerimiento.fecha_final || ''),
    sustento: requerimiento.sustento || '',
    codigo: requerimiento.codigo || ''
  }));

  const [initialFormData, setInitialFormData] = useState<FormData>(() => ({
    usuario_id: requerimiento.usuario_id || '',
    obra_id: requerimiento.obra_id || '',
    fecha_final: formatDateForInput(requerimiento.fecha_final || ''),
    sustento: requerimiento.sustento || '',
    codigo: requerimiento.codigo || ''
  }));

  const handleCancelEdit = useCallback((): void => {
    setFormData(initialFormData);
    setIsEditing(false);
  }, [initialFormData]);

  // Agregar estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTitle, setToastTitle] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mostrar Toast según el campo modificado
    if (name === 'fecha_final') {
      setToastTitle('Fecha Final');
      setToastMessage(`Se ha seleccionado la fecha: ${value}`);
      setShowToast(true);
    } else if (name === 'sustento') {
      setToastTitle('Sustento');
      setToastMessage(`Modificando sustento - ID: ${requerimiento.id}`);
      setShowToast(true);
    }
  }, [requerimiento.id]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(updateRequerimiento({
        id: requerimiento.id,
        ...formData,
        fecha_final: new Date(formData.fecha_final),
        estado_atencion: requerimiento.estado_atencion || 'pendiente'
      })).unwrap();
      setFormData(prev => ({ ...prev, codigo: response.codigo }));
      setInitialFormData({ ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, formData, requerimiento.id, requerimiento.estado_atencion]);
  console.log('Requerimiento para Aprob:', requerimiento);

  const handleSubmitRequerimiento = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await dispatch(updateRequerimiento({
        id: requerimiento.id,
        ...formData,
        fecha_final: new Date(formData.fecha_final),
        estado_atencion: 'pendiente'
      })).unwrap();

      setLoading(false);
      onClose();
      navigate('/dashboard/requerimiento');

    } catch (error) {
      console.error('Error al enviar:', error);
      setLoading(false);
    }
  }, [dispatch, formData, requerimiento.id]);

  const handleSubmitSave = useCallback((): void => {
    navigate('/dashboard/requerimiento');
    onClose();
  }, [navigate]);

  if (loading) {
    return <LoaderPage />;
  }

  return (
    <div className="w-full ">
      {/* Agregar el componente Toast */}
      <Toast
        index={0}
        title={toastTitle}
        message={toastMessage}
        variant="danger"
        position="bottom-right"
        duration={3000}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        icon={<i className="bi bi-info-circle"></i>}
      />      

      {isEditing ? (
        <EditView
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setIsEditing={setIsEditing}
          requerimiento={requerimiento}
          obras={obras}
          onCancel={handleCancelEdit}  // Añadir esta prop
        />
      ) : (
        <ReadOnlyView
          formData={formData}
          requerimiento={requerimiento}
          obras={obras}
          onEdit={() => setIsEditing(true)}
          onSubmit={handleSubmitRequerimiento}
          onSave={handleSubmitSave}
          usuariosCargo={usuariosCargo}
        />
      )}
    </div>
  );
});

export default memo(RequerimientoHeader);