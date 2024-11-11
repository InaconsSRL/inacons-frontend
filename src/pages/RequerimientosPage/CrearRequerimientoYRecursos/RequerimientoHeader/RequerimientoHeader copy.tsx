// DetalleRequerimiento.tsx
import React, { useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../store/store';
import { updateRequerimiento } from '../../../../slices/requerimientoSlice';
import Button from '../../../../components/Buttons/Button';
import LoaderPage from '../../../../components/Loader/LoaderPage';
import Toast from '../../../../components/Toast/Toast';

interface UsuarioCargo {
  id: string;
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  rol_id: string | null;
  cargo_id: {
    id: string;
    nombre: string;
    descripcion: string;
    gerarquia: number;
  };
}

// Definir la interfaz para el objeto requerimiento
interface Requerimiento {
  id: string;
  usuario_id: string;
  obra_id: string;
  fecha_final: string;
  sustento: string;
  codigo: string;
  usuario: string;
  estado_atencion: string;
}

interface DetalleRequerimientoProps {
  requerimiento: Requerimiento;
  obras: {
    obras: { id: string; nombre: string }[];
  };
  onClose: () => void;
}

// Interfaz para el estado del formulario
interface FormData {
  usuario_id: string;
  obra_id: string;
  fecha_final: string;
  sustento: string;
  codigo: string;
}

//Todo Bien Hasta Aqui
// Reafirmado

// Función auxiliar para formatear la fecha
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10); // Obtiene YYYY-MM-DD
};

interface ReadOnlyViewProps {
  formData: FormData;
  usuariosCargo: UsuarioCargo[];
  requerimiento: Requerimiento;
  obras: { obras: { id: string; nombre: string }[] };
  onEdit: () => void;
  onSubmit: () => void;  // Nueva prop
  onSave: () => void;  // Nueva prop
}

const ReadOnlyView = memo(({ usuariosCargo, formData, requerimiento, obras, onEdit, onSave, onSubmit }: ReadOnlyViewProps) => (
  <div className="grid grid-cols-4 gap-1 bg-white/50 p-2 rounded-lg">
    <div>
      <span className="block text-xs text-gray-700">Código:</span>
      <p className="text-sm border-b p-1">{formData.codigo || '-'}</p>
    </div>

    <div>
      <span className="block text-xs text-gray-700">Usuario:</span>
      <p className="text-sm border-b p-1">{requerimiento.usuario || '-'}</p>
    </div>

    <div>
      <span className="block text-xs text-gray-700">Obra:</span>
      <p className="text-sm border-b p-1">
        {obras.obras.find(obra => obra.id === formData.obra_id)?.nombre || '-'}
      </p>
    </div>

    <div>
      <span className="block text-xs text-gray-700">Fecha Final:</span>
      <p className="text-sm border-b p-1">
        {formatDateForInput(formData.fecha_final).split("-").reverse().join("-") || '-'}
      </p>
    </div>

    <div className="col-span-1">
      <span className="block text-xs text-gray-700">Sustento:</span>
      <p className="text-sm border-b p-1">{formData.sustento || '-'}</p>
    </div>

    <div className="col-span-1">
      <span className="block text-xs text-gray-700">Elige al Supervisor:</span>
      <select className="w-full border rounded text-xs p-1">
        <option value="">--Selecciona Supervisor--</option>
        {usuariosCargo
          .filter(usuario => usuario.cargo_id?.gerarquia === 3)
          .map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombres} {usuario.apellidos}
            </option>
          ))}
      </select>
    </div>

    <div className="col-span-1">
      <span className="block text-xs text-gray-700">Elige al Gerente:</span>
      <select className="w-full border rounded text-xs p-1">
        <option value="">--Selecciona Gerente--</option>
        {usuariosCargo
          .filter(usuario => usuario.cargo_id?.gerarquia === 4)
          .map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombres} {usuario.apellidos}
            </option>
          ))}
      </select>
    </div>

    <div className="flex items-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="w-full bg-blue-500 text-white rounded text-xs p-2"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={onSave}
        className="w-full bg-green-500 text-white rounded text-xs p-2"
      >
        Guardar
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="w-full bg-yellow-500 text-white rounded text-xs p-2"
      >
        Enviar
      </button>
    </div>
  </div>
));

interface EditViewProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsEditing: (value: boolean) => void;
  requerimiento: Requerimiento;
  obras: { obras: { id: string; nombre: string }[] };
}

const EditView = memo(({ formData, handleInputChange, handleSubmit, setIsEditing, requerimiento, obras }: EditViewProps) => (
  <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-1 bg-white/50 p-2 rounded-lg">
    <div>
      <span className="block text-xs text-gray-700">Código:</span>
      <p className="text-xs border rounded p-1">{formData.codigo || '-'}</p>
    </div>

    <div>
      <label className="block text-xs text-gray-700">Usuario:</label>
      <p className="w-full border rounded text-xs p-1">
        {requerimiento.usuario}
      </p>
    </div>

    <div>
      <label className="block text-xs text-gray-700">Obra:</label>
      <select
        name="obra_id"
        value={formData.obra_id}
        onChange={handleInputChange}
        className="w-full border rounded text-xs p-1"
      >
        <option value="">Seleccionar</option>
        {obras.obras.map((obra) => (
          <option key={obra.id} value={obra.id}>{obra.nombre}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-xs text-gray-700">Fecha Final:</label>
      <input
        name="fecha_final"
        type="date"
        value={formData.fecha_final}
        onChange={handleInputChange}
        className="w-full border rounded text-xs p-1"
      />
    </div>

    <div className="col-span-3">
      <label className="block text-xs text-gray-700">Sustento:</label>
      <textarea
        name="sustento"
        value={formData.sustento}
        onChange={handleInputChange}
        className="w-full border rounded text-xs p-1 h-8"
      />
    </div>

    <div className="flex items-end pb-2 gap-3">
      <button
        type='submit'
        className="w-full bg-green-500 text-white rounded text-xs p-2.5"
      >
        Guardar
      </button>
      <Button
        onClick={() => setIsEditing(false)}
        text="Cancelar"
        color='rojo'
        className="w-full bg-red-500 text-white rounded text-xs"
      />
    </div>
  </form>
));
const RequerimientoHeader: React.FC<DetalleRequerimientoProps> = memo(({ requerimiento, obras, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { usuariosCargo } = useSelector((state: RootState) => state.usuario);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => ({
    usuario_id: requerimiento.usuario_id || '',
    obra_id: requerimiento.obra_id || '',
    fecha_final: formatDateForInput(requerimiento.fecha_final || ''),
    sustento: requerimiento.sustento || '',
    codigo: requerimiento.codigo || ''
  }));

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
        />
      ) : (
        <ReadOnlyView
          usuariosCargo={usuariosCargo}
          formData={formData}
          requerimiento={requerimiento}
          obras={obras}
          onEdit={() => setIsEditing(true)}
          onSubmit={handleSubmitRequerimiento}
          onSave={handleSubmitSave}
        />
      )}
    </div>
  );
});

export default memo(RequerimientoHeader);