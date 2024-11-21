import React, { useState, useEffect } from 'react';

import { fetchRequerimientoRecursosWithAlmacen } from '../../slices/requerimientoRecursoWithAlmacenSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Column, Requerimiento } from '../KanBanBoard/types/kanban';
import LoaderPage from '../../components/Loader/LoaderPage';
import { fetchPreSolicitudByRequerimiento } from '../../slices/preSolicitudAlmacenSlice';
import { updateRequerimiento } from '../../slices/requerimientoSlice';
import { addSolicitudAlmacen } from '../../slices/solicitudAlmacenSlice';
import { addSolicitudRecursoAlmacen } from '../../slices/solicitudRecursoAlmacenSlice';
import { addSolicitudCompra } from '../../slices/solicitudCompraSlice';
import { addSolicitudCompraRecurso } from '../../slices/solicitudCompraRecursoSlice';
import Toast from '../../components/Toast/Toast';

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

const AprobacionTransferenciaPageAlmacen: React.FC<AprobacionTransferenciaPageProps> = ({ column }) => {
  const requerimientoId = column.requerimiento.id;
  const selectedRequerimiento = column.requerimiento;
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [warehouseQuantities, setWarehouseQuantities] = useState<WarehouseQuantities>({});

  const dispatch = useDispatch<AppDispatch>();
  const requerimientoRecursos = useSelector((state: RootState) => state.requerimientoRecursoWithAlmacen.recursos);
  const loadingRequerimientoRecursos = useSelector((state: RootState) => state.requerimientoRecursoWithAlmacen.loading);
  const currentUserId = useSelector((state: RootState) => state.user?.id);

  // Estados para la animación de carga
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({
    currentWarehouse: '',
    currentWarehouseName: '',
    currentResource: '',
    currentResourceName: '',
    warehouseProgress: 0,
    resourceProgress: 0,
    totalWarehouses: 0,
    totalResources: 0,
  });

  // Agregar estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

  // Cargar requerimientos y pre-solicitudes
  useEffect(() => {
    if (requerimientoId) {
      dispatch(fetchRequerimientoRecursosWithAlmacen(requerimientoId.toString()));
      dispatch(fetchPreSolicitudByRequerimiento(requerimientoId.toString()))
        .unwrap()
        .then((preSolicitudes) => {
          const newWarehouseQuantities: WarehouseQuantities = {};

          interface PreSolicitudRecurso {
            recurso_id: string;
            cantidad: number;
          }

          interface PreSolicitud {
            almacen_id: string;
            recursos: PreSolicitudRecurso[];
          }

          preSolicitudes.forEach((preSolicitud: PreSolicitud) => {
            preSolicitud.recursos.forEach((recurso: PreSolicitudRecurso) => {
              const key = `${recurso.recurso_id}-${preSolicitud.almacen_id}`;
              newWarehouseQuantities[key] = recurso.cantidad;
            });
          });

          setWarehouseQuantities(newWarehouseQuantities);
        });
    }
  }, [dispatch, requerimientoId]);

  const handleQuantityChange = (itemId: string, warehouseId: string, value: string): void => {
    const numValue = parseInt(value) || 0;
    const item = requerimientoRecursos.find(i => i.id === itemId);
    const warehouse = item?.listAlmacenRecursos.find(w => w.almacen_id === warehouseId);

    if (warehouse && numValue >= 0 && numValue <= warehouse.cantidad) {
      setWarehouseQuantities(prev => ({
        ...prev,
        [`${itemId}-${warehouseId}`]: numValue
      }));
    }
  };

  const calculateTransferTotal = (itemId: string): number => {
    const item = requerimientoRecursos.find(i => i.id === itemId);
    return item?.listAlmacenRecursos.reduce((total, warehouse) => {
      return total + (warehouseQuantities[`${itemId}-${warehouse.almacen_id}`] || 0);
    }, 0) || 0;
  };

  const calculateQuotation = (itemId: string): number => {
    const item = requerimientoRecursos.find(i => i.id === itemId);
    if (!item) return 0;
    const transferTotal = calculateTransferTotal(itemId);
    return Math.max(0, item.cantidad - transferTotal);
  };

  // const actualizarRequerimiento = async () => {
  //   await dispatch(updateRequerimiento({
  //     id: requerimientoId,
  //     usuario_id: currentUserId || '',
  //     obra_id: column?.requerimiento.obra_id || '',
  //     fecha_final: new Date(column?.requerimiento?.fecha_final || new Date()),
  //     sustento: column?.requerimiento?.sustento || '',
  //     estado_atencion: "aprobado_logistica",
  //   })).unwrap();
  // }
  // Handlers para los botones

  console.log(requerimientoRecursos)

  const handleApprove = async (): Promise<void> => {
    try {
      setIsProcessing(true);
      const recursosPorAlmacen: { [almacenId: string]: { recurso_id: string; cantidad: number }[] } = {};
      const recursosParaCompra: { recurso_id: string; cantidad: number; costo: number }[] = [];

      // Analizar recursos para transferencia y compra
      requerimientoRecursos.forEach(recurso => {
        const cotizacionNecesaria = calculateQuotation(recurso.id);

        // Si necesita cotización, agregar a la lista de compra
        if (cotizacionNecesaria > 0) {
          recursosParaCompra.push({
            recurso_id: recurso.recurso_id,
            cantidad: cotizacionNecesaria,
            costo: recurso.costo_ref || 0,
          });
        }

        // Procesar transferencias de almacén
        recurso.listAlmacenRecursos.forEach(warehouse => {
          const cantidadTransferencia = warehouseQuantities[`${recurso.id}-${warehouse.almacen_id}`] || 0;
          if (cantidadTransferencia > 0) {
            if (!recursosPorAlmacen[warehouse.almacen_id]) {
              recursosPorAlmacen[warehouse.almacen_id] = [];
            }
            recursosPorAlmacen[warehouse.almacen_id].push({
              recurso_id: recurso.id,
              cantidad: cantidadTransferencia,
            });
          }
        });
      });

      // Procesar solicitud de compra si es necesario
      if (recursosParaCompra.length > 0) {
        const solicitudCompraData = {
          requerimientoId: selectedRequerimiento.id,
          usuarioId: currentUserId || '',
          fecha: new Date(),
        };

        const solicitudCompra = await dispatch(addSolicitudCompra(solicitudCompraData)).unwrap();

        // Crear recursos de solicitud de compra
        for (const recurso of recursosParaCompra) {
          await dispatch(addSolicitudCompraRecurso({
            solicitud_compra_id: solicitudCompra.id,
            recurso_id: recurso.recurso_id,
            cantidad: recurso.cantidad,
            costo: recurso.costo,
          })).unwrap();
        }
      }

      // Continuar con el proceso de solicitudes de almacén
      // ...existing code for warehouse transfers...

      const warehouses = Object.keys(recursosPorAlmacen);
      setProgress(prev => ({ ...prev, totalWarehouses: warehouses.length }));

      

      for (const almacenId of warehouses) {
        const recursos = recursosPorAlmacen[almacenId];
        const almacen = requerimientoRecursos[0]?.listAlmacenRecursos.find(w => w.almacen_id === almacenId);



        setProgress(prev => ({
          ...prev,
          currentWarehouse: almacenId,
          currentWarehouseName: almacen?.nombre_almacen || '',
          totalResources: recursos.length,
          warehouseProgress: Math.round(((warehouses.indexOf(almacenId) + 1) / warehouses.length) * 100),
        }));

        if (!currentUserId) {
          throw new Error('Usuario no encontrado');
        }

        const solicitudData = {
          requerimientoId: selectedRequerimiento.id,
          usuarioId: currentUserId,
          almacenOrigenId: almacenId,
          almacenDestinoId: 'id_del_almacen_destino', // Reemplazar con el ID correcto
          fecha: new Date(),
        };

        const solicitud = await dispatch(addSolicitudAlmacen(solicitudData)).unwrap();

        for (const recurso of recursos) {
          setProgress(prev => ({
            ...prev,
            currentResource: recurso.recurso_id,
            currentResourceName: recurso.recurso_id, // Reemplazar si se necesita el nombre
            resourceProgress: Math.round(((recursos.indexOf(recurso) + 1) / recursos.length) * 100),
          }));

          await dispatch(
            addSolicitudRecursoAlmacen({
              recurso_id: recurso.recurso_id,
              cantidad: recurso.cantidad,
              solicitud_almacen_id: solicitud.id,
            })
          ).unwrap();

          // Pequeña pausa para visualizar progreso
          await new Promise(r => setTimeout(r, 300));
        }
      }

      await dispatch(
        updateRequerimiento({
          id: requerimientoId,
          usuario_id: currentUserId || '',
          obra_id: column?.requerimiento.obra_id || '',
          fecha_final: new Date(column?.requerimiento?.fecha_final || new Date()),
          sustento: column?.requerimiento?.sustento || '',
          estado_atencion: 'aprobado_almacen',
        })
      ).unwrap();

      // Al finalizar exitosamente
      setToastMessage('Transferencia aprobada exitosamente');
      setToastVariant('success');
      setShowToast(true);

    } catch (error: unknown) {
      console.error('Error al aprobar transferencia:', error);
      setToastMessage((error as Error).message || 'Error al procesar la transferencia');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleReject = (): void => {
    // Implementar lógica de rechazo
    console.log('Rechazando transferencia...');
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
    warehouses: recurso.listAlmacenRecursos.map((almacenRecurso) => ({
      id: almacenRecurso.almacen_id,
      name: almacenRecurso.nombre_almacen,
      stock: almacenRecurso.cantidad,
    }))
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4 flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex gap-4">
            <div>
              <label className="text-xs text-gray-600">Tipo de Solicitud:</label>
              <select className="ml-2 text-xs border rounded p-1">
                <option>SP-Según Ppto.</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Obra:</label>
              <input
                type="text"
                value={selectedRequerimiento.codigo.split('-')[1]}
                className="ml-2 text-xs border rounded p-1"
                readOnly
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="text-xs text-gray-600">F Emisión:</label>
              <input
                type="text"
                value={new Date(selectedRequerimiento.fecha_solicitud).toISOString().split("T")[0].split("-").reverse().join("/")}
                className="ml-2 text-xs border rounded p-1"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Número:</label>
              <input
                type="text"
                value={selectedRequerimiento.codigo.split('-')[0]}
                className="ml-2 text-xs border rounded p-1"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div>
            <span className="text-xs text-gray-600">Estado:</span>
            <span className="ml-2 text-xs bg-yellow-100 px-2 py-1 rounded">Aprobación Logística</span>
          </div>
          <div>
            <span className="text-xs text-gray-600">Aprobado:</span>
            <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">{selectedRequerimiento.estado_atencion}</span>
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
                <th className="px-2 py-1">Almacenes</th>
                <th className="px-2 py-1">Transferencia</th>
                <th className="px-2 py-1">Cotización</th>
                <th className="px-2 py-1">Acciones</th>
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
                  <td className="px-2 py-1">
                    {item.warehouses.map(warehouse => (
                      <div key={warehouse.id} className="mb-0.5">
                        <div className="flex flex-row justify-end items-center gap-x-3">
                          <span className="text-[8px] text-gray-600">{warehouse.name} - Stock: {warehouse.stock}</span>
                          <input
                            type="number"
                            min="0"
                            max={warehouse.stock}
                            className="w-12 text-[8px] border rounded px-1"
                            value={warehouseQuantities[`${item.id}-${warehouse.id}`] || ''}
                            onChange={(e) => handleQuantityChange(item.id, warehouse.id, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-2 py-1 text-center font-semibold">
                    {calculateTransferTotal(item.id)}
                  </td>
                  <td className="px-2 py-1 text-center font-semibold">
                    {calculateQuotation(item.id)}
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button className="text-green-500 hover:text-green-600">
                      <i className="fas fa-check"></i>
                    </button>
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

      {isProcessing && (
        <div className="absolute z-50 inset-0 bg-slate-900/95 flex items-center justify-center">
          <div className="w-full max-w-md mx-4 p-6 bg-slate-200 rounded-lg shadow-xl">
            <div className="text-center">
              <h3 className="text-xl font-medium text-slate-950 mb-2">Procesando Solicitudes</h3>
              <p className="text-sm text-slate-950">Almacén: {progress.currentWarehouseName}</p>
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

      {/* Agregar el componente Toast al final del componente */}
      {showToast && (
        <Toast
          message={toastMessage}
          variant={toastVariant}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          position="top-right"
          index={0}
        />
      )}
    </div>
  );
};

export default AprobacionTransferenciaPageAlmacen;