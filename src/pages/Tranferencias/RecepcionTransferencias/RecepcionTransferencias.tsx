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

interface Props {
    onClose: () => void;
}

interface RecursoState {
    _id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    cantidad_original: number;
    cantidad_recibida: number;
    diferencia: number;
    precio_actual: number; 
}

const RecepcionTransferencia: React.FC<Props> = ({onClose}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedDetalleId, setSelectedDetalleId] = useState<string | null>(null);
    const [recursosState, setRecursosState] = useState<{ [key: string]: RecursoState }>({});
    const [showGuiaTransfer, setShowGuiaTransfer] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { transferenciaDetalles, loading: detallesLoading, error: detallesError } = useSelector((state: RootState) => state.transferenciaDetalle);
    const { transferenciaRecursos, loading: recursosLoading } = useSelector((state: RootState) => state.transferenciaRecurso);
    const unidades = useSelector((state: RootState) => state.unidad.unidades);

    useEffect(() => {
        dispatch(fetchTransferenciaDetalles());
    }, [dispatch]);

const handleDetalleClick = async (detalleId: string) => {
    console.log('detalle id', detalleId);
    setSelectedDetalleId(detalleId);
    const selectedDetalle = transferenciaDetalles.find(d => d.id === detalleId);
    console.log('IMPRIMIENDO detalle id', detalleId);
        setSelectedDetalleId(detalleId); 
        try {
            let recursos = await dispatch(fetchTransferenciaRecursosById(detalleId)).unwrap();
            console.log('IMPRIMIENDO RECURSOS', recursos);
            const newRecursosState = recursos.reduce((acc: { [key: string]: RecursoState }, recurso: any) => {
                acc[recurso._id] = {
                    _id: recurso._id,
                    codigo: recurso.recurso_id.codigo,
                    nombre: recurso.recurso_id.nombre,
                    descripcion: recurso.descripcion,
                    cantidad_original: recurso.cantidad,
                    cantidad_recibida: 0,
                    diferencia: recurso.cantidad,
                    precio_actual: recurso.precio_actual 
                };
                return acc;
            }, {});
           console.log('IMPRIMIENDO RECURSOS', newRecursosState);
            setRecursosState(newRecursosState);
            console.log('IMPRIMIENDO RECURSOS estado', recursosState);
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
            const recursosRecepcionados = Object.entries(recursosState)
                .filter(([_, estado]) => estado.cantidad_recibida > 0)
                .map(([id, estado]) => ({
                    ...estado,
                    recurso: transferenciaRecursos.find(r => r._id === id)
                }));
            
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
        detalle.transferencia_id.movimiento_id.nombre.toLowerCase().includes('salida')
    );
    //console.log('IMPRIMIENDO TRANSFERECIA DETALLE', transferenciaDetalles);
    //console.log('IMPRIMIENDO SELECT DETALLE id ', selectedDetalleId);

    const selectedDetalle = transferenciaDetalles?.find(d => d.id === selectedDetalleId);
     //console.log('IMPRIMIENDO SELECT DETALLE', selectedDetalle);

const recursosDelDetalle = selectedDetalleId && selectedDetalle 
        ? transferenciaRecursos.filter(recurso => recurso.transferencia_detalle_id.id === selectedDetalleId)
        : [];

    if (showGuiaTransfer && selectedDetalle) {
        return (
            <GuiaTransferencia
    numero={parseInt(selectedDetalle.transferencia_id.id)}
    solicita={`${selectedDetalle.transferencia_id.usuario_id.nombres} ${selectedDetalle.transferencia_id.usuario_id.apellidos}`}
    recibe={selectedDetalle.transferencia_id.movilidad_id?.denominacion || ''}
    fEmision={new Date(selectedDetalle.fecha)}
    obra={selectedDetalle.transferencia_id.movimiento_id.nombre}
    transferenciaId={selectedDetalle.transferencia_id.id}
    recursos={Object.values(recursosState).map(recurso => ({
        _id: recurso._id,
        codigo: recurso.codigo,
        nombre: recurso.nombre,
        descripcion: recurso.descripcion,
        cantidad_original: recurso.cantidad_original,
        cantidad_recibida: recurso.cantidad_recibida,
        diferencia: recurso.cantidad_recibida - recurso.cantidad_recibida,
        precio_actual: recurso.precio_actual
      }))}
    
    onClose={() => setShowGuiaTransfer(false)}
    estado={'PARCIAL'} 
    obra_destino={{
        _id: selectedDetalle.referencia_id.obra_destino_id?._id || '',
        nombre: selectedDetalle.referencia_id.obra_destino_id?.nombre || ''
    }}
    obra_origen={{
        _id: selectedDetalle.referencia_id.obra_origen_id?._id || '',
        nombre: selectedDetalle.referencia_id.obra_origen_id?.nombre || ''
    }}  
/>
        );
    }

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-[1200px] max-w-full min-w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            {validationErrors.length > 0 && <ValidationErrors errors={validationErrors} />}
            <div className="flex flex-1 min-h-0">
                <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
                    <div className="p-4 bg-white border-b">
                        <h3 className="text-sm font-medium text-gray-700">Detalles de Transferencia</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {JSON.stringify (Object.values (recursosState))}
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
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Código</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unidad</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cant.Solicitada</th>
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
