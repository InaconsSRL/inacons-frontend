import React, { useState, useEffect } from 'react';

import { fetchRequerimientoRecursosWithAlmacen } from '../../slices/requerimientoRecursoWithAlmacenSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Column, Requerimiento } from '../KanBanBoard/types/kanban';
import LoaderPage from '../../components/Loader/LoaderPage';
import { addPreSolicitud } from '../../slices/preSolicitudAlmacenSlice';
import { addPreSolicitudAlmacenRecurso } from '../../slices/preSolicitudAlmacenRecursoSlice';
import { updateRequerimiento } from '../../slices/requerimientoSlice';
import { Tooltip } from 'react-tooltip';
import { FiCalendar, FiChevronsDown } from 'react-icons/fi';
import { formatDate, formatFullTime } from '../../components/Utils/dateUtils';

// Interfaces

interface WarehouseQuantities {
  [key: string]: number;
}

// Componente principal
interface AprobacionTransferenciaPageProps {
  column: Omit<Column, 'requerimiento'> & {
    requerimiento: Requerimiento;
  }
}

const AprobacionTransferenciaPageLogistica: React.FC<AprobacionTransferenciaPageProps> = ({ column }) => {
  const requerimientoId = column.requerimiento.id;
  const selectedRequerimiento = column.requerimiento;
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const requerimientoRecursos = useSelector((state: RootState) => state.requerimientoRecursoWithAlmacen.recursos);
  const loadingRequerimientoRecursos = useSelector((state: RootState) => state.requerimientoRecursoWithAlmacen.loading);

  const currentUserId = useSelector((state: RootState) => state.user?.id);

  useEffect(() => {
    if (requerimientoId) {
      dispatch(fetchRequerimientoRecursosWithAlmacen(requerimientoId.toString()));
    }
  }, [dispatch, requerimientoId]);

  const [warehouseQuantities, setWarehouseQuantities] = useState<WarehouseQuantities>({});

  const handleQuantityChange = (itemId: string, obraId: string, value: string): void => {
    const numValue = parseInt(value) || 0;
    const item = requerimientoRecursos.find(i => i.id === itemId);
    const obra = item?.list_obra_bodega_recursos.find(o => o.obra_id === obraId);

    if (obra && numValue >= 0 && numValue <= obra.cantidad_total_obra) {
      setWarehouseQuantities(prev => ({
        ...prev,
        [`${itemId}-${obraId}`]: numValue
      }));
    }
  };

  const calculateTransferTotal = (itemId: string): number => {
    const item = requerimientoRecursos.find(i => i.id === itemId);
    return item?.list_obra_bodega_recursos.reduce((total, obra) => {
      return total + (warehouseQuantities[`${itemId}-${obra.obra_id}`] || 0);
    }, 0) || 0;
  };

  const calculateQuotation = (itemId: string): number => {
    const item = requerimientoRecursos.find(i => i.id === itemId);
    if (!item) return 0;
    const transferTotal = calculateTransferTotal(itemId);
    return Math.max(0, item.cantidad - transferTotal);
  };

  // 1. Primero añadimos estados para controlar la animación
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({
    currentWarehouse: '',
    currentWarehouseName: '', // Añadido
    currentResource: '',
    currentResourceName: '', // Añadido
    warehouseProgress: 0,
    resourceProgress: 0,
    totalWarehouses: 0,
    totalResources: 0
  });

  const handleUpdateRequerimiento = async () => {
    await dispatch(updateRequerimiento({
      id: requerimientoId,
      usuario_id: currentUserId || '',
      obra_id: column?.requerimiento.obra_id || '',
      fecha_final: new Date(column?.requerimiento?.fecha_final || new Date()),
      sustento: column?.requerimiento?.sustento || '',
      estado_atencion: "aprobado_logistica",
    })).unwrap();
  }
  // Handlers para los botones
  const handleApprove = async (): Promise<void> => {
    try {
      setIsProcessing(true);
      const recursosPorAlmacen: { [almacenId: string]: { recurso_id: string; cantidad: number }[] } = {};

      requerimientoRecursos.forEach(recurso => {
        recurso.list_obra_bodega_recursos.forEach(obra => {
          const cantidadKey = `${recurso.id}-${obra.obra_id}`;
          const cantidad = warehouseQuantities[cantidadKey] || 0;
          if (cantidad > 0) {
            if (!recursosPorAlmacen[obra.obra_id]) {
              recursosPorAlmacen[obra.obra_id] = [];
            }
            recursosPorAlmacen[obra.obra_id].push({
              recurso_id: recurso.id,
              cantidad: cantidad,
            });
          }
        });
      });

      const warehouses = Object.keys(recursosPorAlmacen);
      setProgress(prev => ({ ...prev, totalWarehouses: warehouses.length }));

      for (const almacenId in recursosPorAlmacen) {
        const recursos = recursosPorAlmacen[almacenId];
        const almacen = requerimientoRecursos[0]?.list_obra_bodega_recursos.find(o => o.obra_id === almacenId);

        setProgress(prev => ({
          ...prev,
          currentWarehouse: almacenId,
          currentWarehouseName: almacen?.obra_nombre || '',
          totalResources: recursos.length,
          warehouseProgress: Math.round((warehouses.indexOf(almacenId) + 1) / warehouses.length * 100)
        }));

        if (!currentUserId) {
          throw new Error('Usuario no encontrado');
        }

        const preSolicitudData = {
          requerimiento_id: selectedRequerimiento.id,
          usuario_id: currentUserId,
          almacen_id: almacenId,
          fecha: new Date(),
        };

        const preSolicitud = await dispatch(addPreSolicitud(preSolicitudData)).unwrap();

        for (const recurso of recursos) {
          if (recurso.cantidad && recurso.cantidad > 0) {
            const recursoInfo = requerimientoRecursos.find(r => r.id === recurso.recurso_id);

            setProgress(prev => ({
              ...prev,
              currentResource: recurso.recurso_id,
              currentResourceName: recursoInfo?.nombre || '',
              resourceProgress: Math.round((recursos.indexOf(recurso) + 1) / recursos.length * 100)
            }));

            await dispatch(addPreSolicitudAlmacenRecurso({
              preSolicitudAlmacenId: preSolicitud.id,
              recursoId: recurso.recurso_id,
              cantidad: recurso.cantidad,
            })).unwrap();

            // Pequeña pausa para visualizar progreso
            await new Promise(r => setTimeout(r, 300));
          }
        }
      }

      await handleUpdateRequerimiento();
    } catch (error) {
      // Manejar error si es necesario
      console.error('Error al aprobar transferencia:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (): void => {
    // Implementar lógica de rechazo
    console.error('Rechazando transferencia...');
  };

  if (loadingRequerimientoRecursos) {
    return <LoaderPage />;
  }

  const renderItems = requerimientoRecursos.map((recurso) => ({
    id: recurso.id,
    codigo: recurso.codigo,
    name: recurso.nombre,
    unit: recurso.unidad,
    unitEmb: recurso.unidad,
    quantity: recurso.cantidad,
    status: recurso.estado,
    limitDate: recurso.fecha_limit ? new Date(recurso.fecha_limit).toISOString().split("T")[0].split("-").reverse().join("/") : '-',
    partialCost: recurso.costo_ref || 0,
    approvedQuantity: recurso.cantidad_aprobada || 0,
    obras: recurso.list_obra_bodega_recursos.map((obraRecurso) => ({
      id: obraRecurso.obra_id,
      name: obraRecurso.obra_nombre,
      stock: obraRecurso.cantidad_total_obra,
      bodegas: obraRecurso.bodegas // Añadimos la información de bodegas aquí
    }))
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
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
              <span>{formatFullTime(selectedRequerimiento.fecha_solicitud)}</span>
              <FiCalendar size={14} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">F Final:</label>
            <div className="flex items-center gap-1 px-2 py-1 border rounded bg-white text-xs">
              <span>{formatDate(selectedRequerimiento.fecha_final, 'dd/mm/yyyy')}</span>
              <FiCalendar size={14} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Obra:</label>
            <input
              type="text"
              value={selectedRequerimiento.codigo.split('-')[1]}
              className="px-2 py-1 border rounded text-xs"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Número:</label>
            <input
              type="text"
              value={selectedRequerimiento.codigo.split('-')[0]}
              className="px-2 py-1 border rounded text-xs w-16"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Sustento:</label>
            <input
              type="text"
              value={selectedRequerimiento.sustento}
              className="px-2 py-1 border rounded text-xs "
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Estado:</label>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              {selectedRequerimiento.estado_atencion || 'Sin estado'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Aprueba(n):</label>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {selectedRequerimiento.estado_atencion === "pendiente"
                ? selectedRequerimiento?.aprobacion?.map(ap => (
                  <span
                    key={ap.id_aprobacion}
                    className={ap.cargo !== "Gerente" ? "text-cyan-700" : ""}
                  >
                    {`${ap.nombres} ${ap.apellidos}`}
                  </span>
                )).reduce((prev, curr) => <>{prev}, {curr}</>)
                : selectedRequerimiento?.aprobacion
                  ?.filter(ap => ap.cargo === "Gerente")
                  .map(ap => `${ap.nombres} ${ap.apellidos}`)
                  .join(', ') || 'No aprobado'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[calc(100vh-30rem)] overflow-y-auto">
          <table className="min-w-full text-xs relative">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-2 py-1 text-left">Código</th>
                <th className="px-2 py-1 text-left">Nombre</th>
                <th className="px-2 py-1">Unidad</th>
                <th className="px-2 py-1">U.Emb</th>
                <th className="px-2 py-1">Metrado</th>
                <th className="px-2 py-1">Estado</th>
                <th className="px-2 py-1">F.Límite</th>
                <th className="px-2 py-1">Costo Parcial</th>
                <th className="px-2 py-1">ExistenciasEnAlmacen</th>
                <th className="px-2 py-1">ATransferir</th>
                <th className="px-2 py-1">ACotizar</th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {renderItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`
              border-b font-extralight text-[0.62rem] 
              hover:bg-gray-50 cursor-pointer
              ${activeRowId === item.id ? 'bg-blue-50' : ''}
              ${index % 2 === 0 ? '' : 'bg-sky-50'}
            `}
                  onClick={() => setActiveRowId(item.id)}
                >
                  <td className="px-2 py-1">{item.codigo}</td>
                  <td className="px-2 py-1 text-left ">{item.name}</td>
                  <td className="px-2 py-1 text-center">{item.unit}</td>
                  <td className="px-2 py-1 text-center">{item.unitEmb}</td>
                  <td className="px-2 py-1 text-center">{item.quantity}</td>
                  <td className="px-2 py-1 text-center">
                    {item.status && (
                      <span className="bg-yellow-100 px-2 py-0.5 rounded-full text-[8px]">
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-1 text-center">{item.limitDate}</td>
                  <td className="px-2 py-1 text-center">{item.partialCost}</td>
                  <td className="px-2 py-1 relative">
                    {item.obras.map(obra => (
                      <div key={obra.id} className="mb-0.5 flex items-center justify-end gap-x-3">
                        <div className="flex-shrink-0">
                          <span
                            data-tooltip-id={`tooltip-${item.id}-${obra.id}`}
                            className="text-[8px] text-gray-600 cursor-help whitespace-nowrap"
                          >
                            {obra.name} - Stock: {obra.stock}
                          </span>
                          <Tooltip
                            id={`tooltip-${item.id}-${obra.id}`}
                            place="left"
                            className="!bg-white !text-gray-800 !shadow-lg !rounded-lg !p-0 !opacity-100 !border !border-gray-200 !z-[9999]"
                            positionStrategy="fixed"
                            noArrow={true}
                          >
                            <div className="p-3 min-w-[200px]">
                              <h3 className="font-medium text-xs border-b pb-2 mb-2">{obra.name}</h3>
                              <div className="space-y-2">
                                {obra.bodegas?.map((bodega) => (
                                  <div key={bodega.obra_bodega_id} className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-600">{bodega.nombre}</span>
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-blue-500 transition-all"
                                          style={{
                                            width: `${(bodega.cantidad / obra.stock) * 100}%`
                                          }}
                                        />
                                      </div>
                                      <span className="text-[10px] text-gray-500">
                                        {bodega.cantidad}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Tooltip>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={obra.stock}
                          className="w-12 text-[8px] border rounded px-1 flex-shrink-0"
                          value={warehouseQuantities[`${item.id}-${obra.id}`] || ''}
                          onChange={(e) => handleQuantityChange(item.id, obra.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </td>
                  <td className="px-2 py-1 text-center font-semibold">
                    {calculateTransferTotal(item.id)}
                  </td>
                  <td className="px-2 py-1 text-center font-semibold">
                    {calculateQuotation(item.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Ingrese un comentario..."
            className="w-full text-xs border rounded p-2"
          />
        </div>
        <div className="flex gap-2 ml-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-xs" onClick={handleReject}>
            Rechazar
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-xs" onClick={handleApprove}>
            Aprobar
          </button>
        </div>
      </div>

      {/* 3. Añadimos el componente de progreso */}
      {isProcessing && (
        <div className="absolute z-50 inset-0 bg-slate-900/95 flex items-center justify-center">
          <div className="w-full max-w-md mx-4 p-6 bg-slate-200 rounded-lg shadow-xl">
            <div className="text-center">
              <h3 className="text-xl font-medium text-slate-950 mb-2">
                Procesando Sugerencias
              </h3>
              <p className="text-sm text-slate-950">
                Almacén: {progress.currentWarehouseName}
              </p>
            </div>

            {/* Barra de progreso almacenes */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-950">
                <span>Progreso Almacenes</span>
                <span>{progress.warehouseProgress}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress.warehouseProgress}%` }}
                />
              </div>
            </div>

            {/* Barra de progreso recursos */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-950">
                <span>Progreso Recursos</span>
                <span>{progress.resourceProgress}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-300 ease-out"
                  style={{ width: `${progress.resourceProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-slate-950">
              Procesando recurso: {progress.currentResourceName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AprobacionTransferenciaPageLogistica;