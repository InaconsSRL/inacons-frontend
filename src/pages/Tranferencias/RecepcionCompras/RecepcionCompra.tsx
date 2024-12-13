import React, { useEffect, useState } from 'react';
import RecepcionComp from './RecepcionComp'; // Importar RecepcionComp
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdenCompras } from '../../../slices/ordenCompraSlice';
import { fetchOrdenCompraRecursosByOrdenId } from '../../../slices/ordenCompraRecursosSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { OrdenCompra } from '../../../services/ordenCompraService';

interface RecepcionesCompraProps {
    onClose: () => void;
}

interface RecursoImagen {
    file: string;
}

interface Recurso {
    id: string;
    nombre: string;
    codigo: string;
    imagenes: RecursoImagen[];
    precio_actual: number;
    unidad_id: string;
}

interface OrdenCompraRecurso {
    id: string;
    orden_compra_id: {
        id: string;
    };
    id_recurso: Recurso;
    costo_real: number;
    costo_aproximado: number;
    estado: string;
    cantidad: number;
}

const RecepcionCompra: React.FC<RecepcionesCompraProps> = ({ onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { ordenCompras, loading: ordenesLoading } = useSelector((state: RootState) => state.ordenCompra);
    const { ordenCompraRecursosByOrdenId, loading: recursosLoading } = useSelector((state: RootState) => state.ordenCompraRecursos);
    const [selectedOrdenId, setSelectedOrdenId] = useState<string | null>(null);
    const [showRecepcionComp, setShowRecepcionComp] = useState(false); // Estado para mostrar RecepcionComp

    useEffect(() => {
        dispatch(fetchOrdenCompras());
    }, [dispatch]);

    useEffect(() => {
        if (selectedOrdenId) {
            dispatch(fetchOrdenCompraRecursosByOrdenId(selectedOrdenId));
        }
    }, [dispatch, selectedOrdenId]);

    const handleOrdenClick = (ordenId: string) => {
        setSelectedOrdenId(ordenId);
        setShowRecepcionComp(true); // Mostrar RecepcionComp al hacer clic
    };

    if (ordenesLoading || recursosLoading) {
        return <div className="flex justify-center items-center h-full">Cargando...</div>;
    }

    return (
        <div className="bg-white rounded-lg p-6">
            {showRecepcionComp ? ( // Condicional para renderizar RecepcionComp
                <RecepcionComp ordenId={selectedOrdenId!} onClose={() => setShowRecepcionComp(false)} />
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
                                {ordenCompras.map((oc: OrdenCompra) => (
                                    <div 
                                        key={oc.id} 
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedOrdenId === oc.id 
                                                ? 'border-blue-500 shadow-lg' 
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                        onClick={() => handleOrdenClick(oc.id)}
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
                            <div className="border rounded-lg p-4">
                                {selectedOrdenId && ordenCompraRecursosByOrdenId && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Detalles de la Orden</h4>
                                        {ordenCompraRecursosByOrdenId.map((recurso: OrdenCompraRecurso) => (
                                            <div key={recurso.id} className="border-b pb-2">
                                                <p className="font-medium">{recurso.id_recurso.nombre}</p>
                                                <p className="text-sm text-gray-600">Cantidad: {recurso.cantidad}</p>
                                                <p className="text-sm text-gray-600">
                                                    Costo Real: S/. {recurso.costo_real.toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sección de Reportes */}
                        <div className="w-1/3">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Reportes</h3>
                            <div className="border rounded-lg p-4">
                                {selectedOrdenId && ordenCompraRecursosByOrdenId && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Resumen de la Orden</h4>
                                        <p className="text-sm text-gray-600">
                                            Total de Recursos: {ordenCompraRecursosByOrdenId.length}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Costo Total: S/. {
                                                ordenCompraRecursosByOrdenId.reduce(
                                                    (sum: number, item: OrdenCompraRecurso) => 
                                                        sum + (item.costo_real * item.cantidad), 
                                                    0
                                                ).toFixed(2)
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecepcionCompra;