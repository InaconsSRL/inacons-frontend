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
import { formatFullTime } from '../../components/Utils/dateUtils';
import { formatCurrency } from '../../components/Utils/priceFormatUtils';

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
  nombres: string;
  apellidos: string;
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

  const isRecursoModificado = (recurso: Recurso) => {
    const editedValues = editValues[recurso.id];
    if (!editedValues) return false;

    const currentCantidad = recurso.cantidad_aprobada ?? 0;
    const editedCantidad = editedValues.cantidad_aprobada !== undefined 
      ? Number(editedValues.cantidad_aprobada) 
      : currentCantidad;

    return (
      editedCantidad !== currentCantidad ||
      editedValues.notas !== undefined && editedValues.notas !== recurso.notas ||
      editedValues.fecha_limit !== undefined && editedValues.fecha_limit !== (recurso.fecha_limit ? new Date(recurso.fecha_limit).toISOString().split('T')[0] : '')
    );
  };

  const handleUpdate = async (recurso: Recurso) => {
    
    try {
      const recursoValues = editValues[recurso.id] || {};

      const updateData: UpdateRequerimientoRecursoData = {
        id: recurso.id.toString(),
        cantidad_aprobada: (recursoValues.cantidad_aprobada
          ? Number(recursoValues.cantidad_aprobada)
          : recurso.cantidad_aprobada) || 0,
        fecha_limit: recursoValues.fecha_limit ? new Date(recursoValues.fecha_limit) : new Date(recurso.fecha_limit),
        notas: recursoValues.notas || recurso.notas || ''
      };

      await dispatch(updateRequerimientoRecurso(updateData)).unwrap();

      if (id) {
        await dispatch(fetchRequerimientoRecursos(id.toString()));
      }

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

  console.log(newRequerimiento);

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
        estado_aprobacion: newRequerimiento.estado_atencion === "pendiente" ? "aprobado_supervisor" : "aprobado_gerencia",
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
        estado_atencion: newRequerimiento.estado_atencion === "pendiente" ? "aprobado_supervisor" : "aprobado_gerencia",
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
        estado_aprobacion: newRequerimiento.estado_atencion === "pendiente" ? "rechazado_supervisor" : "rechazado_gerencia",
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
        estado_atencion: newRequerimiento.estado_atencion === "pendiente" ? "rechazado_supervisor" : "rechazado_gerencia",
      })).unwrap();
      console.log('Requerimiento rechazado exitosamente');
    } catch (error) {
      console.error('Error al rechazar requerimiento:', error);
    }
    setIsLoading(false);
  };
  
  const newFechaFinal = newRequerimiento ? new Date(newRequerimiento.fecha_final).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : '';

  if (loading) {
    return <LoaderPage />;
  }


  return (
    <div className="p-6 max-w-[1440px] mx-auto bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="grid grid-cols-3 gap-4 mb-6 w-full">
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
              <span>{formatFullTime(newRequerimiento.fecha_solicitud)}</span>
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
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Sustento:</label>
            <input
              type="text"
              value={newRequerimiento.sustento}
              className="px-2 py-1 border rounded text-xs "
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Estado:</label>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              { newRequerimiento.estado_atencion || 'Sin estado'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Aprueba(n):</label>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {newRequerimiento.estado_atencion === "pendiente"
              ? newRequerimiento?.aprobacion?.map(ap => (
                <span
                  key={ap.id_aprobacion}
                  className={ap.cargo !== "Gerente" ? "text-cyan-700" : ""}
                >
                  {`${ap.nombres} ${ap.apellidos}`}
                </span>
                )).reduce((prev, curr) => <>{prev}, {curr}</>)
              : newRequerimiento?.aprobacion
                ?.filter(ap => ap.cargo === "Gerente")
                .map(ap => `${ap.nombres} ${ap.apellidos}`)
                .join(', ') || 'No aprobado'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Código</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Nombre</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Unidad</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">U.Emb</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Metrado</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">P.Historico</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">CostoParcial</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">MetradoAprobado</th>
              <th className="px-2 py-2 text-center font-medium text-gray-600">Notas</th>
              <th className="px-2 py-2 text-center font-medium text-gray-600">F.Limite</th>
              {shouldShowButtons() && (
                <th className="px-2 py-2 text-center font-medium text-gray-600">Acciones</th>
              )}
            </tr>
          </thead>
            <tbody className="divide-y divide-gray-200">
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
              <td className="px-2 py-2">{formatCurrency(recurso.costo_ref ?? 0) ?? "-"}</td>
                <td className="px-2 py-2">
                {formatCurrency((recurso.costo_ref ?? 1) * (editValues[recurso.id]?.cantidad_aprobada || recurso.cantidad_aprobada || 2))}
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
              {shouldShowButtons() && (
                <td className="px-2 py-2 align-middle">
                  <button
                    onClick={() => handleUpdate({ ...recurso, cantidad_aprobada: recurso.cantidad_aprobada ?? 0, costo_ref: recurso.costo_ref ?? 0, fecha_limit: (recurso.fecha_limit ? new Date(recurso.fecha_limit).toISOString().split('T')[0] : '') ?? '', notas: recurso.notas })}
                    className={`w-full h-6 inline-flex items-center justify-center px-3 text-white rounded-md transition-colors
                      ${isRecursoModificado({
                        id: recurso.id,
                        codigo: recurso.codigo,
                        nombre: recurso.nombre, 
                        unidad: recurso.unidad,
                        cantidad_aprobada: recurso.cantidad_aprobada ?? 0,
                        costo_ref: recurso.costo_ref ?? 0,
                        fecha_limit: (recurso.fecha_limit ? new Date(recurso.fecha_limit).toISOString().split('T')[0] : '') ?? '',
                        notas: recurso.notas
                      }) ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    <FiCheckSquare className='h-2.5 w-2.5' />
                  </button>                
                </td>
              )}
              </tr>
            ))}
            </tbody>
          <tfoot className="bg-gray-200 sticky bottom-0 z-10">
            <tr>
              <td colSpan={6} className="px-2 py-2 text-right font-medium text-gray-600">Total:</td>
                <td className="px-2 py-2 text-center font-medium text-gray-600">
                S/. {formatCurrency(requerimientoRecursos.reduce((total, recurso) => 
                  total + (recurso.costo_ref ?? 1) * (editValues[recurso.id]?.cantidad_aprobada || recurso.cantidad_aprobada || 2), 0))}
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
        <div className="flex justify-end items-center gap-2 mt-4 w-full">
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