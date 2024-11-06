import React, { useState, useEffect } from 'react';

import { fetchRequerimientoRecursos} from '../../slices/requerimientoRecursoSlice';
// import { getRequerimiento, updateRequerimiento } from '../../slices/requerimientoSlice';
import { getRequerimiento } from '../../slices/requerimientoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

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
  historicDate: string;
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
  requerimientoId: string;
}

const AprobacionTransferenciaPage: React.FC<AprobacionTransferenciaPageProps> = ({ requerimientoId }) => {
  console.log(requerimientoId);


  const dispatch = useDispatch<AppDispatch>();
  const { requerimientoRecursos } = useSelector((state: RootState) => state.requerimientoRecurso);
  const { selectedRequerimiento } = useSelector((state: RootState) => state.requerimiento);
  const user = useSelector((state: RootState) => state.user);

  console.log(requerimientoRecursos,selectedRequerimiento, user )
  
  useEffect(() => {
    if (requerimientoId) {
      // Dispatch para obtener los recursos del requerimiento
      dispatch(fetchRequerimientoRecursos(requerimientoId.toString()));
      
      // Dispatch para obtener la información del requerimiento
      dispatch(getRequerimiento(requerimientoId.toString()));
    }
  }, []);


const [items] = useState<Item[]>([
    {
        id: '16489',
        name: 'ALFOMBRA AISLANTE CLASE 4 1 X 1MTS X 5.2MM',
        unit: 'UNID',
        unitEmb: 'UNID',
        quantity: 4,
        status: 'pendiente',
        historicDate: '25',
        limitDate: '09/11/2024',
        partialCost: 100,
        approvedQuantity: 4,
        warehouses: [
            { id: 'w1', name: 'Almacén Central', stock: 150 },
            { id: 'w2', name: 'Almacén Norte', stock: 75 },
            { id: 'w3', name: 'Almacén Sur', stock: 25 }
        ]
    },
    {
        id: '12384',
        name: 'CABESTRILLO INMOVILIZADOR UNIVERSAL',
        unit: 'UNID',
        unitEmb: 'UNID',
        quantity: 3,
        status: '',
        historicDate: '-',
        limitDate: '02/11/2024',
        partialCost: 3,
        approvedQuantity: 3,
        warehouses: [
            { id: 'w1', name: 'Almacén Central', stock: 80 },
            { id: 'w2', name: 'Almacén Norte', stock: 45 },
            { id: 'w3', name: 'Almacén Sur', stock: 30 }
        ]
    },
    {
        id: '19739',
        name: 'ALCOHOL EN GEL X 380 ML',
        unit: 'UNID',
        unitEmb: 'UNID',
        quantity: 4,
        status: 'pendiente',
        historicDate: '-',
        limitDate: '31/10/2024',
        partialCost: 4,
        approvedQuantity: 4,
        warehouses: [
            { id: 'w1', name: 'Almacén Central', stock: 200 },
            { id: 'w2', name: 'Almacén Norte', stock: 150 },
            { id: 'w3', name: 'Almacén Sur', stock: 100 }
        ]
    }
]);

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
                value="INA_CAS" 
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
                value="25/10/2024" 
                className="ml-2 text-xs border rounded p-1"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Número:</label>
              <input 
                type="text" 
                value="0002" 
                className="ml-2 text-xs border rounded p-1"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div>
            <span className="text-xs text-gray-600">Estado:</span>
            <span className="ml-2 text-xs bg-yellow-100 px-2 py-1 rounded">Pendiente</span>
          </div>
          <div>
            <span className="text-xs text-gray-600">Aprobado:</span>
            <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">Por Aprobar</span>
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
              <th className="px-2 py-1">P.Histórico</th>
              <th className="px-2 py-1">F.Límite</th>
              <th className="px-2 py-1">Costo Parcial</th>
              {items[0].warehouses.map(warehouse => (
                <th key={warehouse.id} className="px-2 py-1">{warehouse.name}</th>
              ))}
              <th className="px-2 py-1">Transferencia</th>
              <th className="px-2 py-1">Cotización</th>
              <th className="px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-2 py-1">{item.id}</td>
                <td className="px-2 py-1">{item.name}</td>
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
                <td className="px-2 py-1 text-center">{item.historicDate}</td>
                <td className="px-2 py-1 text-center">{item.limitDate}</td>
                <td className="px-2 py-1 text-center">{item.partialCost}</td>
                {item.warehouses.map(warehouse => (
                  <td key={warehouse.id} className="px-2 py-1 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] text-gray-600">Stock: {warehouse.stock}</span>
                      <input
                        type="number"
                        min="0"
                        max={warehouse.stock}
                        className="w-16 text-[8px] border rounded px-1 py-0.5"
                        value={warehouseQuantities[`${item.id}-${warehouse.id}`] || ''}
                        onChange={(e) => handleQuantityChange(item.id, warehouse.id, e.target.value)}
                      />
                    </div>
                  </td>
                ))}
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