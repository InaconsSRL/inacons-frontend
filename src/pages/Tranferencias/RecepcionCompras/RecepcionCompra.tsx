import React, { useEffect, useState } from 'react';
import RecepcionComp from './RecepcionComp';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdenCompras } from '../../../slices/ordenCompraSlice';
import { fetchOrdenCompraRecursosByOrdenId } from '../../../slices/ordenCompraRecursosSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { OrdenCompra } from '../../../services/ordenCompraService';

interface RecepcionesCompraProps {
    onClose: () => void;
}

const RecepcionCompra: React.FC<RecepcionesCompraProps> = ({ onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    
    // Estados
    const [selectedOrdenId, setSelectedOrdenId] = useState<string | null>(null);
    const [showRecepcionComp, setShowRecepcionComp] = useState(false);
    const [selectedOrden, setSelectedOrden] = useState<OrdenCompra | null>(null);
    const [ordenesCompletadas, setOrdenesCompletadas] = useState<OrdenCompra[]>([]);

    // Selectores
    const { ordenCompras, loading: ordenesLoading } = useSelector((state: RootState) => state.ordenCompra);
    const { loading: recursosLoading } = useSelector((state: RootState) => state.ordenCompraRecursos);

    // Efectos
    useEffect(() => {
        dispatch(fetchOrdenCompras());
    }, [dispatch]);

    useEffect(() => {
        if (selectedOrdenId) {
            dispatch(fetchOrdenCompraRecursosByOrdenId(selectedOrdenId));
        }
    }, [dispatch, selectedOrdenId]);

    // Handlers
    const handleOrdenClick = (orden: OrdenCompra) => {
        setSelectedOrdenId(orden.id);
        setSelectedOrden(orden);
        setShowRecepcionComp(true);
    };

    const handleRecepcionComplete = (orden: OrdenCompra) => {
        setOrdenesCompletadas(prev => [...prev, orden]);
    };

    const handleCloseRecepcion = () => {
        setShowRecepcionComp(false);
        setSelectedOrdenId(null);
        setSelectedOrden(null);
    };

    // Loading
    if (ordenesLoading || recursosLoading) {
        return <div className="flex justify-center items-center h-full">Cargando...</div>;
    }

    // Filtrar órdenes pendientes
    const ordenesPendientes = ordenCompras.filter(oc => 
        !ordenesCompletadas.some(completada => completada.id === oc.id)
    );

    return (
        <div className="bg-white rounded-lg p-6">
            {showRecepcionComp && selectedOrdenId && selectedOrden ? (
                <RecepcionComp 
                    ordenId={selectedOrdenId} 
                    ordenCompra={selectedOrden}
                    onClose={handleCloseRecepcion}
                    onComplete={handleRecepcionComplete}
                />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-blue-900">Recepción de Compras</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex gap-4">
                        {/* Sección de Pendientes */}
                        <div className="w-1/3">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Pendientes</h3>
                            <div className="overflow-y-auto max-h-[calc(100vh-300px)] space-y-4">
                                {ordenesPendientes.map((oc: OrdenCompra) => (
                                    <div
                                        key={oc.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedOrdenId === oc.id
                                                ? 'border-blue-500 shadow-lg'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                        onClick={() => handleOrdenClick(oc)}
                                    >
                                        <h4 className="font-semibold text-lg mb-2">N° Orden De Compra: {oc.codigo_orden}</h4>
                                        <p className="text-gray-600">Destino: {oc.descripcion}</p>
                                        <p className="text-gray-600">Estado: {oc.estado ? 'Activo' : 'Pendiente'}</p>
                                        <p className="text-gray-600">
                                            Fecha de Emisión: {new Date(oc.fecha_ini).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sección de Recibido */}
                        <div className="w-1/3">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Recibido</h3>
                            <div className="overflow-y-auto max-h-[calc(100vh-300px)] space-y-4">
                                {ordenesCompletadas.map((oc: OrdenCompra) => (
                                    <div
                                        key={oc.id}
                                        className="border rounded-lg p-4 bg-green-50 border-green-200"
                                    >
                                        <h4 className="font-semibold text-lg mb-2">N° Orden De Compra: {oc.codigo_orden}</h4>
                                        <p className="text-gray-600">Destino: {oc.descripcion}</p>
                                        <p className="text-green-600 font-medium">Estado: Completado</p>
                                        <p className="text-gray-600">
                                            Fecha de Emisión: {new Date(oc.fecha_ini).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sección de Reportes */}
                        <div className="w-1/3">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Reportes</h3>
                            <div className="border rounded-lg p-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Resumen</h4>
                                    <p className="text-sm text-gray-600">
                                        Total Órdenes: {ordenCompras.length}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Pendientes: {ordenesPendientes.length}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Completadas: {ordenesCompletadas.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecepcionCompra;
