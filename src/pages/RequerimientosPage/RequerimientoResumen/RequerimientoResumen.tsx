import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchRequerimientoRecursos } from '../../../slices/requerimientoRecursoSlice';
import Modal from '../../../components/Modal/Modal';

interface Resource {
  id: string;
  name: string;
  total: number;
  summary: {
    quoted: number;
    inTransfer: number;
    attended: number;
    pending: number;
  };
  purchaseOrders: Array<{
    id: string;
    date: string;
    quantity: number;
    status: string;
  }>;
  transferOrders: Array<{
    id: string;
    date: string;
    quantity: number;
    fromWarehouse: string;
    toWarehouse: string;
    status: string;
  }>;
  deliveries: Array<{
    id: string;
    date: string;
    quantity: number;
    warehouse: string;
  }>;
}

interface RequerimientoResumenProps {
  id: string;
  onClose: () => void;
}

const RequerimientoResumen = ({ id }: RequerimientoResumenProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { requerimientoRecursos, loading } = useSelector((state: RootState) => state.requerimientoRecurso);
    const [selectedResource, setSelectedResource] = React.useState<Resource | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchRequerimientoRecursos(id));
        }
    }, [id, dispatch]);

    // Función para generar datos simulados
    const generateMockData = (cantidad: number) => {
        const quoted = Math.floor(Math.random() * cantidad);
        const inTransfer = Math.floor(Math.random() * quoted);
        const attended = Math.floor(Math.random() * inTransfer);
        const pending = cantidad - attended;

        const mockPurchaseOrders = Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, index) => ({
            id: `OC-${String(index + 1).padStart(3, '0')}`,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            quantity: Math.floor(Math.random() * 30) + 10,
            status: Math.random() > 0.5 ? 'completed' : 'in_progress'
        }));

    const mockTransferOrders = Array(Math.floor(Math.random() * 2) + 1).fill(null).map((_, index) => ({
        id: `TR-${String(index + 1).padStart(3, '0')}`,
        date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: Math.floor(Math.random() * 20) + 5,
        fromWarehouse: `Almacén ${Math.floor(Math.random() * 3) + 1}`,
        toWarehouse: `Almacén ${Math.floor(Math.random() * 3) + 4}`,
        status: Math.random() > 0.5 ? 'completed' : 'in_progress'
    }));

    const mockDeliveries = Array(Math.floor(Math.random() * 4) + 1).fill(null).map((_, index) => ({
        id: `EN-${String(index + 1).padStart(3, '0')}`,
        date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: Math.floor(Math.random() * 15) + 5,
        warehouse: `Almacén ${Math.floor(Math.random() * 6) + 1}`
    }));

    return {
        summary: { quoted, inTransfer, attended, pending },
        purchaseOrders: mockPurchaseOrders,
        transferOrders: mockTransferOrders,
        deliveries: mockDeliveries
    };
    };

    // Combinar datos reales con simulados
    const enrichedResources = requerimientoRecursos.map(recurso => ({
        id: recurso.id,
        name: recurso.nombre,
        total: recurso.cantidad,
        ...generateMockData(recurso.cantidad),
    }));

    if (loading) {
        return <div className="p-4">Cargando...</div>;
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Resumen de Recursos</h2>
            
            <div className="space-y-4">
                {enrichedResources.map(resource => (
                    <div key={resource.id} 
                         className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                         onClick={() => {
                           setSelectedResource(resource);
                           setIsModalOpen(true);
                         }}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{resource.name}</h3>
                          <p className="text-gray-600">Código: {resource.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Total: {resource.total}</p>
                        </div>
                      </div>
      
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center">
                          <div className="text-blue-600 font-bold">{resource.summary.quoted}</div>
                          <div className="text-sm text-gray-600">Cotizados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-600 font-bold">{resource.summary.inTransfer}</div>
                          <div className="text-sm text-gray-600">En Traslado</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-600 font-bold">{resource.summary.attended}</div>
                          <div className="text-sm text-gray-600">Atendidos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-bold">{resource.summary.pending}</div>
                          <div className="text-sm text-gray-600">Pendientes</div>
                        </div>
                      </div>
      
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(resource.summary.attended / resource.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedResource && (
                <Modal 
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedResource(null);
                    }}
                    title={`${selectedResource.name} - Código: ${selectedResource.id}`}
                >
                    {/* Resumen General */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-blue-700">{selectedResource.total}</div>
                            <div className="text-sm text-blue-600">Total Requerido</div>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-yellow-700">{selectedResource.summary.quoted}</div>
                            <div className="text-sm text-yellow-600">Cotizados</div>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-green-700">{selectedResource.summary.attended}</div>
                            <div className="text-sm text-green-600">Atendidos</div>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-red-700">{selectedResource.summary.pending}</div>
                            <div className="text-sm text-red-600">Pendientes</div>
                        </div>
                    </div>

                    {/* Órdenes de Compra */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3">Órdenes de Compra</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-2">N° OC</th>
                                        <th className="pb-2">Fecha</th>
                                        <th className="pb-2">Cantidad</th>
                                        <th className="pb-2">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedResource.purchaseOrders.map(po => (
                                        <tr key={po.id} className="border-t">
                                            <td className="py-2">{po.id}</td>
                                            <td>{po.date}</td>
                                            <td>{po.quantity}</td>
                                            <td>
                                                <span className={`px-2 py-1 rounded-full text-sm ${
                                                    po.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                    {po.status === 'completed' ? 'Completado' : 'En Proceso'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Órdenes de Traslado */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3">Órdenes de Traslado</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-2">N° Traslado</th>
                                        <th className="pb-2">Fecha</th>
                                        <th className="pb-2">Origen</th>
                                        <th className="pb-2">Destino</th>
                                        <th className="pb-2">Cantidad</th>
                                        <th className="pb-2">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedResource.transferOrders.map(to => (
                                        <tr key={to.id} className="border-t">
                                            <td className="py-2">{to.id}</td>
                                            <td>{to.date}</td>
                                            <td>{to.fromWarehouse}</td>
                                            <td>{to.toWarehouse}</td>
                                            <td>{to.quantity}</td>
                                            <td>
                                                <span className={`px-2 py-1 rounded-full text-sm ${
                                                    to.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                    {to.status === 'completed' ? 'Completado' : 'En Tránsito'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Entregas */}
                    <div>
                        <h3 className="text-lg font-bold mb-3">Entregas Realizadas</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-2">N° Entrega</th>
                                        <th className="pb-2">Fecha</th>
                                        <th className="pb-2">Almacén</th>
                                        <th className="pb-2">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedResource.deliveries.map(del => (
                                        <tr key={del.id} className="border-t">
                                            <td className="py-2">{del.id}</td>
                                            <td>{del.date}</td>
                                            <td>{del.warehouse}</td>
                                            <td>{del.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default RequerimientoResumen;