import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchRequerimientoRecursos } from '../../../slices/requerimientoRecursoSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';

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
        return <LoaderPage />;
    }

    return (
        <div className="max-w-full mx-auto flex space-x-4 h-[calc(100vh-12rem)] custom-scrollbar">
            {/* Lista de recursos */}
            <div className="max-w-[20vw] min-w-[calc(19vw)] flex flex-col bg-gradient-to-b from-blue-100 to-white rounded-2xl shadow-lg border border-slate-200/60 p-4 m-1">
                <h2 className="text-xl font-bold mb-6 p-3 text-center bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl text-white shadow-sm">
                    Resumen de Recursos
                </h2>

                <div className="space-y-3 overflow-y-auto pr-2">
                    {enrichedResources.map((resource, index) => (
                        <div
                            key={resource.id}
                            className={`
                    relative bg-white rounded-xl p-4
                    border transition-all duration-200 ease-in-out
                    hover:shadow-lg hover:scale-[0.98]
                    cursor-pointer
                    ${selectedResource?.id === resource.id
                                    ? 'border-slate-600 border-2 shadow-md'
                                    : 'border-slate-200 shadow-sm hover:border-slate-400'
                                }
                `}
                            onClick={() => setSelectedResource(resource)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 pr-6">
                                    <h3 className="text-xs font-medium text-slate-700 mb-1">
                                        {resource.name}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-900">
                                        Total: {resource.total}
                                    </p>
                                </div>

                                {/* Indicador numérico */}
                                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-xs text-white font-medium">
                                        {index + 1}
                                    </span>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden -mt-1.5">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-700 transition-all duration-300 ease-out"
                                    style={{ width: `${(resource.summary.attended / resource.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detalle del recurso seleccionado */}
            <div className="max-w-[41vw] min-w-[calc(40vw)] h-full overflow-y-auto pr-2 bg-gradient-to-b from-blue-100 to-white rounded-2xl shadow-lg border border-slate-200/60 p-4">
                {selectedResource ? (
                    <div>
                        <h2 className=" bg-slate-600 text-center rounded-xl p-2 font-semibold mb-4 sticky top-0">
                            <span className='text-white'>
                                {selectedResource.name}
                            </span>
                            <br />
                            <span className="text-xs text-slate-200 ml-2">

                                Código: {selectedResource.id}
                            </span>
                        </h2>

                        {/* Resumen General */}
                        <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <div className="text-xl font-bold text-blue-700">{selectedResource.total}</div>
                                <div className="text-blue-600">Total Requerido</div>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded-lg">
                                <div className="text-xl font-bold text-yellow-700">{selectedResource.summary.quoted}</div>
                                <div className="text-yellow-600">Cotizados</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg">
                                <div className="text-xl font-bold text-green-700">{selectedResource.summary.attended}</div>
                                <div className="text-green-600">Atendidos</div>
                            </div>
                            <div className="bg-red-50 p-2 rounded-lg">
                                <div className="text-xl font-bold text-red-700">{selectedResource.summary.pending}</div>
                                <div className="text-red-600">Pendientes</div>
                            </div>
                        </div>

                        {/* Órdenes de Compra */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Órdenes de Compra</h3>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <table className="w-full text-xs">
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
                                                    <span className={`px-2 py-1 rounded-full text-sm ${po.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
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
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Órdenes de Traslado</h3>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <table className="w-full text-xs">
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
                                                    <span className={`px-2 py-1 rounded-full text-sm ${to.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
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
                            <h3 className="text-lg font-semibold mb-2">Entregas Realizadas</h3>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <table className="w-full text-xs">
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
                    </div>
                ) : (
                    <div className="p-4 text-gray-500 text-center">
                        Selecciona un recurso para ver el detalle
                    </div>
                )}
            </div>
        </div>
    );
}

export default RequerimientoResumen;