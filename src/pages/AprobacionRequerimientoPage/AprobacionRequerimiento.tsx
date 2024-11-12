import { useState, useEffect } from 'react';
import { FiCalendar, FiCheck, FiCheckSquare, FiChevronsDown, FiX } from 'react-icons/fi';
import { fetchRequerimientoRecursos, updateRequerimientoRecurso,  } from '../../slices/requerimientoRecursoSlice';
import { updateAprobacion } from '../../slices/requerimientoAprobacionSlice';
import { updateRequerimiento } from '../../slices/requerimientoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import Button from '../../components/Buttons/Button';
import { NewRequerimiento } from '../KanBanBoard/types/kanban';

interface EditValues {
  [key: string]: {
    cantidad_aprobada?: number;
    fecha_limit?: string;
    notas?: string;
    estado: string;
  }
}

interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  unidad: string;
  cantidad_aprobada: number;
  costo_ref: number;
  fecha_limit: string | Date;
  notas?: string;
}

interface UpdateRequerimientoRecursoData {
  id: string;
  cantidad_aprobada: number;
  fecha_limit: Date;
  notas: string;
}

interface Aprobacion {
  id_usuario: string;
  gerarquia: number;
  cargo: string;
  id_aprobacion: string;
}

interface AprobarRequerimientoProps {
  newRequerimiento: NewRequerimiento;
  userAprobacion: Aprobacion | undefined;
  columnId: string;
}

const AprobacionRequerimiento = ({ newRequerimiento, userAprobacion, columnId }: AprobarRequerimientoProps) => {

  const dispatch = useDispatch<AppDispatch>();  
  const id = newRequerimiento.id
  const { requerimientoRecursos, loading } = useSelector((state: RootState) => state.requerimientoRecurso);
  const [editValues, setEditValues] = useState<EditValues>({} as EditValues);
  const [comentario, setComentario] = useState('');
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchRequerimientoRecursos(id.toString()));
    }
  }, [dispatch, id]);
  
  const handleEditChange = (recursoId: string, field: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [recursoId]: {
        ...prev[recursoId],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (recurso: Recurso) => {
    
    try {
      const recursoValues = editValues[recurso.id] || {};

      const updateData: UpdateRequerimientoRecursoData = {
        id: recurso.id.toString(),
        cantidad_aprobada: recursoValues.cantidad_aprobada
          ? Number(recursoValues.cantidad_aprobada)
          : recurso.cantidad_aprobada,
        fecha_limit: recursoValues.fecha_limit ? new Date(recursoValues.fecha_limit) : new Date(recurso.fecha_limit),
        notas: recursoValues.notas || recurso.notas || ''
      };

      await dispatch(updateRequerimientoRecurso(updateData)).unwrap();

      console.log('Recurso actualizado');

      // Limpiar los valores editados para este recurso
      setEditValues(prev => {
        const newValues = { ...prev };
        delete newValues[recurso.id];
        return newValues;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const shouldShowButtons = () => {
    if (!userAprobacion) return false;

    if (userAprobacion.gerarquia === 3) {
      return columnId === 'aprobacion_supervisor';
    } else if (userAprobacion.gerarquia === 4) {
      return true;
    }
    return false;
  };

  const aprobarRequerimiento = async () => {
    setIsLoading(true);
    try {
      if (!user.id) {
        throw new Error('Usuario no identificado');
      }

      const aprobacionUsuario = userAprobacion;
      if (!aprobacionUsuario) {
        throw new Error('Usuario no autorizado para aprobar');
      }
      
      const data = {
        id: aprobacionUsuario.id_aprobacion,
        requerimiento_id: newRequerimiento.id,
        usuario_id: user.id as string,
        estado_aprobacion: newRequerimiento.estado === "pendiente" ? "aprobado_supervisor" : "aprobado_gerencia",
        comentario: comentario || "Requerimiento aprobado"
      };
      await dispatch(updateAprobacion(data)).unwrap();
      setComentario(''); 
      await dispatch(updateRequerimiento({
        id: newRequerimiento?.id || '',
        usuario_id: newRequerimiento?.usuario_id || '',
        obra_id: newRequerimiento?.obra_id || '',
        fecha_final: new Date(newRequerimiento?.fecha_final || new Date()),
        sustento: newRequerimiento?.sustento || '',
        estado_atencion: "aprobado_supervisor"
      })).unwrap();
      console.log('Requerimiento aprobado exitosamente');
    } catch (error) {
      console.error('Error al aprobar requerimiento:', error);
    }
    setIsLoading(false);
  };

  const rechazarRequerimiento = async () => {
    setIsLoading(true);
    try {
      const aprobacionUsuario = userAprobacion;
      if (!aprobacionUsuario) {
        throw new Error('Usuario no autorizado para rechazar');
      }

      const data = {
        id: aprobacionUsuario.id_aprobacion,
        requerimiento_id: newRequerimiento.id,
        usuario_id: user.id as string,
        estado_aprobacion: newRequerimiento.estado_atencion === "pendiente" ? "rechazado_supervisor" : "aprobado_gerencia",
        comentario: comentario || "Requerimiento rechazado"
      };

      await dispatch(updateAprobacion(data)).unwrap();
      setComentario('');
      await dispatch(updateRequerimiento({
        id: newRequerimiento?.id || '',
        usuario_id: newRequerimiento?.usuario_id || '',
        obra_id: newRequerimiento?.obra_id || '',
        fecha_final: new Date(newRequerimiento?.fecha_final || new Date()),
        sustento: newRequerimiento?.sustento || '',
        estado_atencion: "rechazado_supervisor"
      })).unwrap();
      console.log('Requerimiento rechazado exitosamente');
    } catch (error) {
      console.error('Error al rechazar requerimiento:', error);
    }
    setIsLoading(false);
  };
  
  const newFechaFinal = newRequerimiento ? new Date(newRequerimiento.fecha_final).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : '';
  const newFechaInicial = newRequerimiento ? new Date(newRequerimiento.fecha_solicitud).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : '';

  if (loading) {
    return <LoaderPage />;
  }


  return (
    <div className="p-6 max-w-full mx-auto bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Tipo de Solicitud:</label>
            <div className="flex items-center gap-1 px-2 py-1 border rounded bg-white text-xs">
              <span>SP-Según Ppto.</span>
              <FiChevronsDown size={14} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">F Emisión:</label>
            <div className="flex items-center gap-1 px-2 py-1 border rounded bg-white text-xs">
              <span>{newFechaInicial}</span>
              <FiCalendar size={14} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">F Final:</label>
            <div className="flex items-center gap-1 px-2 py-1 border rounded bg-white text-xs">
              <span>{newFechaFinal}</span>
              <FiCalendar size={14} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Obra:</label>
            <input
              type="text"
              value={newRequerimiento.codigo.split('-')[1]}
              className="px-2 py-1 border rounded text-xs"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Número:</label>
            <input
              type="text"
              value={newRequerimiento.codigo.split('-')[0]}
              className="px-2 py-1 border rounded text-xs w-16"
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Estado:</label>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              {newRequerimiento.aprobacion[0].cargo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Aprobado:</label>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {newRequerimiento.aprobacion[0].id_usuario}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs block h-[50vh] overflow-y-auto">
          <thead className="bg-gray-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Código</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Nombre</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Unidad</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">U.Emb</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Metrado</th>
              {/* <th className="px-2 py-2 text-left font-medium text-gray-600">Estado</th> */}
              {/* <th className="px-2 py-2 text-left font-medium text-gray-600">Comprado</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-600">Cotizado</th> */}
              <th className="px-2 py-2 text-left font-medium text-gray-600">P.Historico</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">CostoParcial</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Metrado Aprobado</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Notas</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">F.Limite</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Acciones</th>

            </tr>
          </thead>
            <tbody >
            {requerimientoRecursos.map((recurso) => (
              <tr
              key={recurso.id}
              className="border-b hover:bg-blue-50 transition-colors text-[10px] text-center text-slate-500"
              >
              <td className="px-2 py-2">{recurso.codigo}</td>
              <td className="px-2 py-2 max-w-60 text-left">{recurso.nombre}</td>
              <td className="px-2 py-2">{recurso.unidad}.</td>
              <td className="px-2 py-2">{recurso.unidad}</td>
              <td className="px-2 py-2">{recurso.cantidad_aprobada ?? "-"}</td>
              <td className="px-2 py-2">{recurso.costo_ref ?? "-"}</td>
                <td className="px-2 py-2">
                {((recurso.costo_ref ?? 1) * (editValues[recurso.id]?.cantidad_aprobada || recurso.cantidad_aprobada || 2)).toFixed(2)}
                </td>
                <td className="px-2 py-2">
                <input
                type="number"
                value={editValues[recurso.id]?.cantidad_aprobada || recurso.cantidad_aprobada || 0}
                onChange={(e) => handleEditChange(recurso.id, 'cantidad_aprobada', e.target.value)}
                className="w-16 px-2 py-1 border rounded"
                placeholder={String(recurso.cantidad_aprobada || "")}
                />
                </td>
              <td className="px-2 py-2">
                <input
                type="text"
                value={editValues[recurso.id]?.notas || recurso.notas || ''}
                onChange={(e) => handleEditChange(recurso.id, 'notas', e.target.value)}
                className="w-32 px-2 py-1 border rounded"
                placeholder={recurso.notas || ""}
                />
              </td>
              
              <td className="px-2 py-2">
                <input
                type="date"
                value={editValues[recurso.id]?.fecha_limit || (recurso.fecha_limit ? new Date(recurso.fecha_limit).toISOString().split('T')[0] : '') || ''}
                onChange={(e) => handleEditChange(recurso.id, 'fecha_limit', e.target.value)}
                className="w-32 px-2 py-1 border rounded max-w-24"
                />
              </td>                
              <td className="px-2 py-2 align-middle">
                <button
                onClick={() => handleUpdate({ ...recurso, cantidad_aprobada: recurso.cantidad_aprobada ?? 0, costo_ref: recurso.costo_ref ?? 0, fecha_limit: (recurso.fecha_limit ? new Date(recurso.fecha_limit).toISOString().split('T')[0] : '') ?? '', notas: recurso.notas })}
                className="w-full h-6 inline-flex items-center justify-center px-3 bg-green-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                <FiCheckSquare className='h-2.5 w-2.5' />
                </button>                
              </td>
              </tr>
            ))}
            </tbody>
          <tfoot className='bg-gray-200 sticky -bottom-0.5 z-10 shadow-sm mt-20'>
            <tr>
              <td colSpan={6} className="px-2 py-2 text-right font-medium text-gray-600">Total:</td>
                <td className="px-2 py-2 text-center font-medium text-gray-600">
                S/. {requerimientoRecursos.reduce((total, recurso) => 
                  total + (recurso.costo_ref ?? 1) * (editValues[recurso.id]?.cantidad_aprobada || recurso.cantidad_aprobada || 2), 0).toFixed(2)}
                </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Action Buttons */}

      {shouldShowButtons() && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <input
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Ingrese un comentario..."
            className="flex-1 px-3 py-1 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            onClick={rechazarRequerimiento}
            icon={<FiX />}
            text="Rechazar"
            color='rojo'
            key={`${newRequerimiento.id}-reject`}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
          />
          <Button 
            onClick={aprobarRequerimiento}
            icon={<FiCheck />}
            text="Aprobar"
            color='verde'
            key={`${newRequerimiento.id}-approve`}
            className="px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors"
          />
        </div>
      )}

      {isLoading && <LoaderPage />}
    </div>
  );
};

export default AprobacionRequerimiento;