import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store/store';
import { fetchEspecialidades, Especialidad  } from '../../../../slices/especialidadSlice';
import Modal from '../../../../components/Modal/Modal';
import EspecialidadForm from './EspecialidadForm';
import { Titulo } from '../../../../slices/tituloSlice';

interface TituloFormProps {
  titulo: Titulo | null;
  onSubmit: (titulo: Titulo) => void;
  onCancel: () => void;
  titulos: Titulo[];
  tituloParentId?: string; // Nueva prop opcional
  ordenCreate?: number; // Nueva prop opcional
  tipo: 'TITULO' | 'PARTIDA';
}

const TituloForm: React.FC<TituloFormProps> = ({
  titulo,
  onSubmit,
  onCancel,
  titulos,
  tituloParentId,
  ordenCreate,
  tipo
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);
  const activePresupuesto = useSelector((state: RootState) => state.activeData.activePresupuesto);
  const especialidades = useSelector((state: RootState) => state.especialidad.especialidades);
  const [showEspecialidadForm, setShowEspecialidadForm] = useState(false);

  const [formData, setFormData] = useState<Partial<Titulo>>({
    descripcion: '',
    nivel: 1,
    item: '',
    parcial: 0,
    id_especialidad: ''
  });

  useEffect(() => {
    if (especialidades.length === 0) {
      dispatch(fetchEspecialidades());
    }
  }, [dispatch, especialidades.length]);

  useEffect(() => {
    if (titulo) {
      setFormData(titulo);
    } else {
      const tituloParent = tituloParentId ? titulos.find(t => t.id_titulo === tituloParentId) : null;
      const nivelBase = tituloParent ? tituloParent.nivel + 1 : 1;
      const hermanosDirectos = titulos.filter(t => t.id_titulo_padre === tituloParentId);
      const nextOrder = tituloParent
        ? Math.max(...hermanosDirectos.map(t => t.orden || 0), 0) + 1
        : titulos.length + 1;

      setFormData({
        descripcion: '',
        nivel: nivelBase,
        item: '',
        parcial: 0,
        orden: (ordenCreate ? ordenCreate : nextOrder) + 0.5,
        id_titulo_padre: tituloParentId || null,
        id_especialidad: especialidades[0]?.id_especialidad || '',
        tipo: tipo
      });
    }
  }, [titulo, titulos, especialidades, tituloParentId, tipo, ordenCreate]);

  useEffect(() => {
    // Enfocar el input cuando el componente se monte
    inputRef.current?.focus();
  }, []);

  const handleEspecialidadCreated = (nuevaEspecialidad: Especialidad) => {
    setFormData({ ...formData, id_especialidad: nuevaEspecialidad.id_especialidad });
    setShowEspecialidadForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activePresupuesto || !formData.id_especialidad) return;

    const tituloData: Titulo = {
      id_titulo: titulo?.id_titulo || 'TEMP_' + Date.now(),
      id_presupuesto: activePresupuesto.id_presupuesto,
      id_titulo_padre: formData.id_titulo_padre || null,
      id_titulo_plantilla: null,
      descripcion: formData.descripcion?.toUpperCase() || '',
      nivel: formData.nivel || 1,
      orden: formData.orden || (ordenCreate ? ordenCreate : titulos.length) + 0.5,
      item: formData.item || '01',
      parcial: formData.parcial || 0,
      fecha_creacion: titulo?.fecha_creacion || new Date().toISOString(),
      id_especialidad: formData.id_especialidad,
      tipo: tipo || 'TITULO',
    };

    onSubmit(tituloData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 bg-blue-950/80 rounded-xl p-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Descripción
          </label>
          <input
            ref={inputRef}
            type="text"
            value={formData.descripcion || ''}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="mt-1 px-2 py-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Especialidad
            </label>
            <div className="flex gap-2">
              <select
                value={formData.id_especialidad}
                onChange={(e) => setFormData({ ...formData, id_especialidad: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100"
                required
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((esp) => (
                  <option key={esp.id_especialidad} value={esp.id_especialidad}>
                    {esp.descripcion}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowEspecialidadForm(true)}
                className="mt-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {titulo ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>

      {showEspecialidadForm &&
        <Modal
          isOpen={showEspecialidadForm}
          onClose={() => setShowEspecialidadForm(false)}
          title="Nueva Especialidad"
        >
          <EspecialidadForm
            onSubmit={handleEspecialidadCreated}
            onCancel={() => setShowEspecialidadForm(false)}
          />
        </Modal>
      }
    </>
  );
};

export default TituloForm;
