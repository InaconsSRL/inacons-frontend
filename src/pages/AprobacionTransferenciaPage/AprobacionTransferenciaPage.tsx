import React, { useState, useEffect } from 'react';

import { fetchRequerimientoRecursosWithAlmacen } from '../../slices/requerimientoRecursoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Column, Requerimiento } from '../KanBanBoard/types/kanban';
import LoaderPage from '../../components/Loader/LoaderPage';

// Interfaces
interface Warehouse {
  id: string;
  name: string;
  stock: number;
}

interface Item {
  id: string;
  name: string;
  unit: string;
  unitEmb: string;
  quantity: number;
  status: string;
  limitDate: string;
  partialCost: number;
  approvedQuantity: number;
  warehouses: Warehouse[];
}

interface WarehouseQuantities {
  [key: string]: number;
}

// Componente principal
interface AprobacionTransferenciaPageProps {
  column: Omit<Column, 'requerimiento'> & {
    requerimiento: Requerimiento;
  }
}

const AprobacionTransferenciaPage: React.FC<AprobacionTransferenciaPageProps> = ({ column }) => {
  const requerimientoId = column.requerimiento.id;
  const selectedRequerimiento = column.requerimiento;
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const requerimientoRecursos = useSelector((state: RootState) => state.requerimientoRecurso.requerimientoRecursos);
  const loadingRequerimientoRecursos = useSelector((state: RootState) => state.requerimientoRecurso.loading);
  
  useEffect(() => {
    if (requerimientoId) {
     const response = dispatch(fetchRequerimientoRecursosWithAlmacen(requerimientoId.toString()));
     console.log(response)
    }
  }, [dispatch, requerimientoId]);

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const itemsData: Item[] = requerimientoRecursos.map((recurso) => {
      const warehouses = recurso.listAlmacenRecursos.map((almacenRecurso) => ({
        id: almacenRecurso.almacen_id || '',
        name: almacenRecurso.nombre_almacen || '',
        stock: almacenRecurso.cantidad,
      }));

      return {
        id: recurso.codigo,
        name: recurso.nombre,
        unit: recurso.unidad,
        unitEmb: recurso.unidad,
        quantity: recurso.cantidad,
        status: recurso.estado,
        limitDate: recurso.fecha_limit ? new Date(recurso.fecha_limit).toISOString().split("T")[0].split("-").reverse().join("/") : '-',
        partialCost: recurso.costo_ref || 0,
        approvedQuantity: recurso.cantidad_aprobada || 0,
        warehouses: warehouses,
      };
    });

    setItems(itemsData);
  }, [requerimientoRecursos]);

  const [warehouseQuantities, setWarehouseQuantities] = useState<WarehouseQuantities>({});

  const handleQuantityChange = (itemId: string, warehouseId: string, value: string): void => {
    const numValue = parseInt(value) || 0;
    const item = items.find(i => i.id === itemId);
    const warehouse = item?.warehouses.find(w => w.id === warehouseId);

    if (warehouse && numValue >= 0 && numValue <= warehouse.stock) {
      setWarehouseQuantities(prev => ({
        ...prev,
        [`${itemId}-${warehouseId}`]: numValue
      }));
    }
  };

  const calculateTransferTotal = (itemId: string): number => {
    const item = items.find(i => i.id === itemId);
    return item?.warehouses.reduce((total, warehouse) => {
      return total + (warehouseQuantities[`${itemId}-${warehouse.id}`] || 0);
    }, 0) || 0;
  };

  const calculateQuotation = (itemId: string): number => {
    const item = items.find(i => i.id === itemId);
    if (!item) return 0;
    const transferTotal = calculateTransferTotal(itemId);
    return Math.max(0, item.quantity - transferTotal);
  };

  // Handlers para los botones
  const handleApprove = (): void => {
    // Implementar lógica de aprobación
    console.log('Aprobando transferencia...');
  };

  const handleReject = (): void => {
    // Implementar lógica de rechazo
    console.log('Rechazando transferencia...');
  };

  console.log(items, warehouseQuantities);

  if (loadingRequerimientoRecursos) {
    return <LoaderPage />;
  }

  

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
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
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
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                className={`
                  border-b font-extralight text-[0.62rem] 
                  hover:bg-gray-50 cursor-pointer
                  ${activeRowId === item.id ? 'bg-blue-50' : ''}
                `}
                onClick={() => setActiveRowId(item.id)}
              >
                <td className="px-2 py-1">{item.id}</td>
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
    </div>
  );
};

export default AprobacionTransferenciaPage;