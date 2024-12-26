import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addTransferenciaRecurso, fetchTransferenciaRecursosById } from '../../../slices/transferenciaRecursoSlice';
import { 
    addTransferenciaDetalle, 
    fetchTransferenciaDetalles,
    TransferenciaDetalleData 
} from '../../../slices/transferenciaDetalleSlice';
import ValidationErrors from '../RecepcionCompras/components/ValidationErrors';
import { ValidationError } from '../RecepcionCompras/utils/validaciones';
import { RootState, AppDispatch } from '../../../store/store';
import GuiaTransferencia from './GuiaTransfer';
//import { EstadoTransferencia } from './GuiaTransfer'; 

interface Props {
    onClose: () => void;
}

interface RecursoState {
    _id: string;
    cantidad_original: number;
    cantidad_recibida: number;
    diferencia: number;
}

const RecepcionTransferencia: React.FC<Props> = ({ onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedDetalleId, setSelectedDetalleId] = useState<string | null>(null);
    const [recursosState, setRecursosState] = useState<{ [key: string]: RecursoState }>({});
    const [showGuiaTransfer, setShowGuiaTransfer] = useState(false);
    const [transferenciaId, setTransferenciaId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { transferenciaDetalles, loading: detallesLoading, error: detallesError } = useSelector((state: RootState) => state.transferenciaDetalle);
    const { transferenciaRecursos, loading: recursosLoading } = useSelector((state: RootState) => state.transferenciaRecurso);
    const unidades = useSelector((state: RootState) => state.unidad.unidades);

    useEffect(() => {
        dispatch(fetchTransferenciaDetalles());
    }, [dispatch]);

    const handleDetalleClick = async (detalleId: string) => {
        setSelectedDetalleId(detalleId);
        try {
            const recursos = await dispatch(fetchTransferenciaRecursosById(detalleId)).unwrap();
            const newRecursosState = recursos.reduce((acc: { [key: string]: RecursoState }, recurso: any) => {
                acc[recurso._id] = {
                    _id: recurso._id,
                    cantidad_original: recurso.cantidad,
                    cantidad_recibida: 0,
                    diferencia: recurso.cantidad
                };
                return acc;
            }, {});
            setRecursosState(newRecursosState);
        } catch (err) {
            console.error('Error al cargar recursos:', err);
        }
    };

    const handleCantidadChange = (recursoId: string, cantidad: number) => {
        setRecursosState(prev => {
            const recurso = prev[recursoId];
            if (!recurso) return prev;

            const cantidadValidada = Math.max(0, Math.min(cantidad, recurso.cantidad_original));
            return {
                ...prev,
                [recursoId]: {
                    ...recurso,
                    cantidad_recibida: cantidadValidada,
                    diferencia: recurso.cantidad_original - cantidadValidada
                }
            };
        });
    };

    const handleRecepcionar = async () => {
        if (selectedDetalleId) {
            setIsProcessing(true);
            // Procesar la recepción aquí
            // ...
            // Después de procesar la recepción, establecer el ID de la transferencia y mostrar la guía de transferencias
            setTransferenciaId(selectedDetalleId);
            setShowGuiaTransfer(true);
            setIsProcessing(false);
        }
    };

    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    if (detallesLoading || recursosLoading) {
        return <div className="flex justify-center items-center h-full">Cargando...</div>;
    }

    if (detallesError) {
        return <div className="p-6 text-center text-red-600">Error: {detallesError}</div>;
    }

    const detallesFiltrados = transferenciaDetalles?.filter(detalle => 
        detalle.transferencia_id.movimiento_id.nombre.toLowerCase().includes('salida') &&
        detalle.transferencia_id.movimiento_id.nombre.toLowerCase().includes('')
    );

    const selectedDetalle = transferenciaDetalles?.find(d => d.id === selectedDetalleId);

    // Filtrar recursos por el detalle seleccionado
    const recursosDelDetalle = selectedDetalleId 
        ? transferenciaRecursos.filter(recurso => recurso.transferencia_detalle_id.id === selectedDetalleId)
        : [];

    if (showGuiaTransfer && selectedDetalle) {
        return (
            <GuiaTransferencia
                numero={parseInt(selectedDetalle.transferencia_id.id)}
                solicita={`${selectedDetalle.transferencia_id.usuario_id.nombres} ${selectedDetalle.transferencia_id.usuario_id.apellidos}`}
                recibe={selectedDetalle.transferencia_id.movilidad_id?.denominacion || ''}
                fEmision={new Date(selectedDetalle.fecha)}
                //estado={selectedDetalle.tipo as EstadoTransferencia} // Asegúrate de que el tipo sea correcto
                obra={selectedDetalle.transferencia_id.movimiento_id.nombre}
                transferenciaId={selectedDetalle.transferencia_id.id}
                //obraDestino={selectedDetalle.transferencia_id.movilidad_id?.denominacion || ''}
                onClose={() => setShowGuiaTransfer(false)} estado={'PARCIAL'}            />
        );
    }

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-full h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-white">
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-blue-800">Recepción de Transferencia</h2>
                    <button onClick={onClose} className="text-2xl text-red-500 hover:text-red-600">
                        <FiX />
                    </button>
                </div>
            </div>

            {validationErrors.length > 0 && <ValidationErrors errors={validationErrors} />}

            <div className="flex flex-1 min-h-0">
                {/* Panel izquierdo */}
                <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
                    <div className="p-4 bg-white border-b">
                        <h3 className="text-sm font-medium text-gray-700">Detalles de Transferencia</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {detallesFiltrados?.map((detalle) => (
                            <div
                                key={detalle.id}
                                onClick={() => handleDetalleClick(detalle.id)}
                                className={`p-4 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                                    selectedDetalleId === detalle.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                                }`}
                            >
                                <div className="text-sm font-medium text-gray-900">
                                    Transferencia #{detalle.transferencia_id.id}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Usuario: {detalle.transferencia_id.usuario_id.nombres} {detalle.transferencia_id.usuario_id.apellidos}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Fecha: {new Date(detalle.fecha).toLocaleDateString()}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Tipo: {detalle.tipo}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Movimiento: {detalle.transferencia_id.movimiento_id.nombre}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="flex-1 bg-white overflow-y-auto">
                    {selectedDetalle ? (
                        <div className="p-4">
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Detalle de Transferencia #{selectedDetalle.transferencia_id.id}
                                </h3>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Usuario: {selectedDetalle.transferencia_id.usuario_id.nombres} {selectedDetalle.transferencia_id.usuario_id.apellidos}</p>
                                    <p>Fecha: {new Date(selectedDetalle.fecha).toLocaleDateString()}</p>
                                    <p>Tipo: {selectedDetalle.tipo}</p>
                                    <p>Movimiento: {selectedDetalle.transferencia_id.movimiento_id.nombre}</p>
                                </div>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Código</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unidad</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cant.Solicitada</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cant.Disponible</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cant.Recibida</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Diferencia</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recursosDelDetalle.map((recurso) => {
                                        const estado = recursosState[recurso._id];
                                        return (
                                            <tr key={recurso._id}>
                                                <td className="px-3 py-2">
                                                    <input type="checkbox" className="rounded border-gray-300" />
                                                </td>
                                                <td className="px-3 py-2 text-sm text-gray-900">{recurso.recurso_id.codigo}</td>
                                                <td className="px-3 py-2 text-sm text-gray-900">{recurso.recurso_id.nombre}</td>
                                                <td className="px-3 py-2 text-sm text-gray-500">
                                                    {unidades?.find(u => u.id === recurso.recurso_id.unidad_id)?.nombre || 'UND'}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-gray-900">{recurso.cantidad}</td>
                                                <td>0</td> {/* Aqui ira la Cantidad disponible dentro de la bodega  */}
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={recurso.cantidad}
                                                        value={estado?.cantidad_recibida || 0}
                                                        onChange={(e) => handleCantidadChange(recurso._id, parseInt(e.target.value))}
                                                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className={`px-3 py-2 text-sm ${
                                                    estado?.diferencia > 0 ? 'text-red-600' : 
                                                    estado?.diferencia < 0 ? 'text-blue-600' : 
                                                    'text-green-600'
                                                }`}>
                                                    {estado?.diferencia || 0}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <p className="text-lg">Seleccione un detalle de transferencia</p>
                                <p className="text-sm mt-2">Para ver los recursos disponibles</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-white">
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={handleRecepcionar}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={!selectedDetalleId || isProcessing}
                    >
                        {isProcessing ? 'Procesando...' : 'Recepcionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecepcionTransferencia;
