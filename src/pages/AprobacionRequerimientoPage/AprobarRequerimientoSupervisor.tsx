import { useState, useEffect } from 'react';
import { FiCalendar, FiCheck, FiCheckSquare, FiChevronsDown, FiX } from 'react-icons/fi';
import { fetchRequerimientoRecursos, updateRequerimientoRecurso, addRequerimientoAprobacionThunk } from '../../slices/requerimientoRecursoSlice';
import { getRequerimiento, updateRequerimiento } from '../../slices/requerimientoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import Button from '../../components/Buttons/Button';

interface EditValues {
  [key: string]: {
    cantidad_aprobada?: number;
    fecha_limit?: string;
  }
}

interface UpdateRequerimientoRecursoData {
  id: string;
  cantidad_aprobada: number;
  fecha_limit: Date;
  notas: string;
}

interface Requerimiento {
  id: string;
  deliveryDate: string;
  title: string;
  projectCode: string;
  approvedBy: string;
}

interface AprobarRequerimientoProps {
  requerimiento: Requerimiento;
}

const AprobarRequerimientoSupervisor = ({ requerimiento }: AprobarRequerimientoProps) => {

  const dispatch = useDispatch<AppDispatch>();  
  const id = requerimiento.id
  const { requerimientoRecursos, loading } = useSelector((state: RootState) => state.requerimientoRecurso);
  const { selectedRequerimiento } = useSelector((state: RootState) => state.requerimiento);
  const [editValues, setEditValues] = useState<EditValues>({} as EditValues);
  const [comentario, setComentario] = useState('');
  const user = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if (id) {
      // Dispatch para obtener los recursos del requerimiento
      dispatch(fetchRequerimientoRecursos(id.toString()));
      
      // Dispatch para obtener la información del requerimiento
      dispatch(getRequerimiento(id.toString()));
    }
  }, []);
  
  const handleEditChange = (recursoId: string, field: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [recursoId]: {
        ...prev[recursoId],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (recurso: any) => {
    
    try {
      const recursoValues = editValues[recurso.id] || {};

      const updateData: UpdateRequerimientoRecursoData = {
        id: recurso.id.toString(),
        cantidad_aprobada: recursoValues.cantidad_aprobada
          ? Number(recursoValues.cantidad_aprobada)
          : recurso.cantidad_aprobada,
        fecha_limit: recursoValues.fecha_limit ? new Date(recursoValues.fecha_limit) : new Date(recurso.fecha_limit ?? ''),
        notas: recurso.notas
      };

      await dispatch(updateRequerimientoRecurso(updateData)).unwrap();

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

  const aprobarRequerimiento = async () => {
    try {
      if (!user.id) {
        throw new Error('Usuario no identificado');
      }
      
      const data = {
        requerimientoId: requerimiento.id,
        usuarioId: user.id as string,
        estadoAprobacion: "aprobado_supervisor",
        comentario: comentario || "Requerimiento aprobado"
      };

      await dispatch(addRequerimientoAprobacionThunk(data)).unwrap();
      setComentario(''); 


      await dispatch(updateRequerimiento({
        id: selectedRequerimiento?.id || '',
        usuario_id: selectedRequerimiento?.usuario_id || '',
        obra_id: selectedRequerimiento?.obra_id || '',
        fecha_final: new Date(selectedRequerimiento?.fecha_final || new Date()),
        sustento: selectedRequerimiento?.sustento || '',
        estado_atencion: "aprobado_supervisor"
      })).unwrap();
      


      console.log('Requerimiento aprobado exitosamente');
    } catch (error) {
      console.error('Error al aprobar requerimiento:', error);
    }
  };

  const rechazarRequerimiento = async () => {
    try {
      const data = {
        requerimientoId: requerimiento.id,
        usuarioId: user.id as string,
        estadoAprobacion: "rechazado_supervisor",
        fechaAprobacion: new Date(),
        comentario: comentario || "Requerimiento rechazado"
      };

      await dispatch(addRequerimientoAprobacionThunk(data)).unwrap();
      setComentario('');
      console.log('Requerimiento rechazado exitosamente');
    } catch (error) {
      console.error('Error al rechazar requerimiento:', error);
    }
  };
  
  const newFechaFinal = selectedRequerimiento ? new Date(selectedRequerimiento.fecha_final).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : '';

  if (loading) {
    return <LoaderPage />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
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
              <span>{requerimiento.deliveryDate}</span>
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
              value={requerimiento.title.split('-')[1]}
              className="px-2 py-1 border rounded text-xs"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Número:</label>
            <input
              type="text"
              value={requerimiento.projectCode}
              className="px-2 py-1 border rounded text-xs w-16"
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Estado:</label>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              {requerimiento.approvedBy}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Aprobado:</label>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Por Aprobar
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs block h-[60vh] overflow-y-auto">
          <thead className="bg-gray-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Código</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Nombre</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Unidad</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">U.Emb</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Metrado</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Estado</th>
              {/* <th className="px-2 py-2 text-left font-medium text-gray-600">Comprado</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-600">Cotizado</th> */}
              <th className="px-2 py-2 text-left font-medium text-gray-600">P.Historico</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">F.Limite</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">CostoParcial</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Notas</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">C.Aprobada</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Nueva.F.Limite</th>
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
                <td className="px-2 py-2">{recurso.nombre}</td>
                <td className="px-2 py-2">{recurso.unidad}</td>
                <td className="px-2 py-2">{recurso.unidad}</td>
                <td className="px-2 py-2">{recurso.cantidad_aprobada ?? "-"}</td>
                <td className="px-2 py-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{recurso.estado}</span></td>
                <td className="px-2 py-2">{recurso.costo_ref ?? "-"}</td>
                <td className="px-2 py-2"> {new Date(recurso.fecha_limit ?? '').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })} </td>
                <td className="px-2 py-2">{(recurso.costo_ref ?? 1) * (recurso.cantidad_aprobada ?? 2)}</td>
                <td className="px-2 py-2">{recurso.notas}</td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    value={editValues[recurso.id]?.cantidad_aprobada || ''}
                    onChange={(e) => handleEditChange(recurso.id, 'cantidad_aprobada', e.target.value)}
                    className="w-16 px-2 py-1 border rounded"
                    placeholder={String(recurso.cantidad_aprobada || "")}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="date"
                    value={editValues[recurso.id]?.fecha_limit || ''}
                    onChange={(e) => handleEditChange(recurso.id, 'fecha_limit', e.target.value)}
                    className="w-32 px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-2 py-2 flex flex-row">
                  <button
                    onClick={() => handleUpdate({ ...recurso, cantidad_aprobada: recurso.cantidad_aprobada ?? 0, costo_ref: recurso.costo_ref ?? 0, fecha_limit: recurso.fecha_limit ?? '', notas: recurso.notas })}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FiCheckSquare className='h-2.5 w-2.5' />
                  </button>                
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className='bg-gray-200 sticky bottom-0 z-10 shadow-sm mt-20'>
            <tr>
              <td colSpan={8} className="px-2 py-2 text-right font-medium text-gray-600">Total:</td>
              <td className="px-2 py-2 text-center font-medium text-gray-600">
                S/. {requerimientoRecursos.reduce((total, recurso) => total + (recurso.costo_ref ?? 1) * (recurso.cantidad_aprobada ?? 2), 0)}
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
          key={`${requerimiento.id}-reject`}
          className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
        />
        <Button 
          onClick={aprobarRequerimiento}
          icon={<FiCheck />}
          text="Aprobar"
          color='verde'
          key={`${requerimiento.id}-approve`}
          className="px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors"
        />
      </div>

      {/* <div className="flex justify-end gap-2 mt-4">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors">
                    Ver Compras
                </button>
                <button className="px-3 py-1 bg-gray-500 text-white rounded-md text-xs hover:bg-gray-600 transition-colors">
                    Ver Historial
                </button>
                <button className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors">
                    Act. Compras
                </button>
                <button className="px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors">
                    Dar por Terminada
                </button>
            </div> */}
    </div>
  );
};

export default AprobarRequerimientoSupervisor;