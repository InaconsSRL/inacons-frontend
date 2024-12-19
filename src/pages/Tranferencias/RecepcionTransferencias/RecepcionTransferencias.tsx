import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransferencias, addTransferencia, TransferenciaData } from '../../../slices/transferenciaSlice';
import { addTransferenciaRecurso, fetchTransferenciaRecursosById } from '../../../slices/transferenciaRecursoSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import ValidationErrors from '../RecepcionCompras/components/ValidationErrors';
import { ValidationError } from '../RecepcionCompras/utils/validaciones';
import { fetchMovimientos } from '../../../slices/movimientoSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { EstadoTransferencia } from '../types';
import { RecepcionTransferenciasProps } from '../interfaces';

interface RecursoDetalle {
    id: string;
    id_recurso: {
        id: string;
        codigo: string;
        nombre: string;
        unidad_id: string;
        precio_actual: number;
    };
    cantidad: number;
    cantidad_recibida: number;
    diferencia: number;
    costo: number;
}

interface Transferencia {
    id: number;
    usuario_id: {
        id: number;
        nombres: string;
        apellidos: string;
    };
    fecha: string;
    movimiento_id: {
        id: number;
    };
    movilidad_id: {
        id: number;
    };
    estado: string;
}

const RecepcionTransferencia: React.FC<RecepcionTransferenciasProps> = ({ onClose, transferenciasId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedTransferenciaId, setSelectedTransferenciaId] = useState<string | null>(null);
    const [selectedTransferencia, setSelectedTransferencia] = useState<Transferencia | null>(null);
    const [transferenciaData, setTransferenciaData] = useState<TransferenciaData[]>([]);
    const [fechaRecepcion, setFechaRecepcion] = useState(new Date().toISOString().split('T')[0]);
    const [movilidadId, setMovilidadId] = useState('');
    const [detalles, setDetalles] = useState<RecursoDetalle[]>([]);
    const userId = useSelector((state: RootState) => state.user?.id);
    const { transferencias, loading, error } = useSelector((state: RootState) => state.transferencia);
    const { TransferenciaRecursosById: recursos } = useSelector((state: RootState) => state.transferenciaRecurso);
    const movimiento = useSelector((state: RootState) => state.movimiento.movimientos);
    const unidades = useSelector((state: RootState) => state.unidad.unidades);

    useEffect(() => {
        dispatch(fetchTransferencias());
        dispatch(fetchMovimientos());
    }, [dispatch]);

    useEffect(() => {
        if (selectedTransferenciaId) {
            dispatch(fetchTransferenciaRecursosById(selectedTransferenciaId));
        }
    }, [selectedTransferenciaId, dispatch]);

    useEffect(() => {
        console.log('Recursos:', recursos); // Agrega este log para verificar los recursos
        if (recursos && recursos.length > 0) {
            const nuevoDetalles: RecursoDetalle[] = recursos.map((recurso) => ({
                id: recurso.id,
                id_recurso: {
                    id: recurso.recurso_id.id,
                    codigo: recurso.recurso_id.codigo,
                    nombre: recurso.recurso_id.nombre,
                    unidad_id: recurso.recurso_id.unidad_id,
                    precio_actual: recurso.recurso_id.precio_actual,
                },
                cantidad: recurso.cantidad,
                cantidad_recibida: 0,
                diferencia: recurso.cantidad,
                costo: recurso.costo,
            }));
            setDetalles(nuevoDetalles);
        }
    }, [recursos]);

    const handleOrdenClick = (transferencia: TransferenciaData) => {
        setSelectedTransferenciaId(transferencia.id);
        setSelectedTransferencia(transferencia);
    };

    return (
        <div className="flex flex-1 min-h-0">
            <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
                <div className="p-4 bg-white border-b">
                    <h3 className="text-sm font-medium text-gray-700">Transferencias Pendientes</h3>
                </div>
                <div className="bg-gray-50 p-4 space-y-3">
                    {transferencias.map((transferencia) => (
                        <div
                            key={transferencia.id}
                            onClick={() => handleOrdenClick(transferencia)}
                            className="bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md"
                        >
                            <div className="p-3">
                                <div className="text-sm font-medium text-gray-900">
                                    N° Transferencia: {transferencia.id}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Fecha: {new Date(transferencia.fecha).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white overflow-y-auto">
                {selectedTransferencia ? (
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Detalles de Transferencia</h3>
                        <div className="mt-2 text-sm text-gray-600">
                            <p>
                                Usuario: {selectedTransferencia.usuario_id.nombres}{' '}
                                {selectedTransferencia.usuario_id.apellidos}
                            </p>
                            <p>Fecha: {new Date(selectedTransferencia.fecha).toLocaleDateString()}</p>
                        </div>
                        <h4 className="mt-4 text-md font-semibold text-gray-700">Recursos:</h4>
                        {recursos && recursos.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {recursos.map((recurso: RecursoDetalle) => (
                                    <li key={recurso.id} className="text-sm text-gray-600">
                                        {recurso.id_recurso.nombre}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-red-600 text-sm">No se encontraron recursos para esta transferencia.</div>
                        )}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={() => setShowConfirmDialog(true)}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Confirmar Recepción
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-600">Selecciona una transferencia para ver los detalles.</div>
                )}
            </div>
        </div>
    );
};

export default RecepcionTransferencia;