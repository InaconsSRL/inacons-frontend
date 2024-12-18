import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdenCompras } from '../../../slices/ordenCompraSlice';
import { addTransferencia, TransferenciaData } from '../../../slices/transferenciaSlice';
import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import ValidationErrors from './components/ValidationErrors';
import { ValidationError } from './utils/validaciones';
import { fetchOrdenCompraRecursosByOrdenId } from '../../../slices/ordenCompraRecursosSlice';
import { fetchMovilidades } from '../../../slices/movilidadSlice';
import { fetchMovimientos } from '../../../slices/movimientoSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { OrdenCompra } from '../../../services/ordenCompraService';
import { EstadoTransferencia } from '../types';

interface RecursoDetalle {
    id: string;
    id_recurso: {
        id: string;
        codigo: string;
        nombre: string;
        unidad_id: string;
        costo?: number;
    };
    cantidad: number;
    cantidadRecibida: number;
    diferencia: number;
    costo: number;
}

interface RecepcionesCompraProps {
    onClose: () => void;
    onComplete: (orden: OrdenCompra, detalles: RecursoDetalle[]) => void;
}

const RecepcionCompra: React.FC<RecepcionesCompraProps> = ({ onClose, onComplete }) => {
    const dispatch = useDispatch<AppDispatch>();

    // Estados
    const [selectedOrdenId, setSelectedOrdenId] = useState<string | null>(null);
    const [selectedOrden, setSelectedOrden] = useState<OrdenCompra | null>(null);
    const [ordenesCompletadas, setOrdenesCompletadas] = useState<OrdenCompra[]>([]);
    const [fechaRecepcion, setFechaRecepcion] = useState(new Date().toISOString().split('T')[0]);
    const [movilidadId, setMovilidadId] = useState('');

    const [detalles, setDetalles] = useState<RecursoDetalle[]>([]);
    const userId = useSelector((state: RootState) => state.user.id);

    // Selectores
    const { ordenCompras, loading: ordenesLoading } = useSelector((state: RootState) => state.ordenCompra);
    const { ordenCompraRecursosByOrdenId: recursos, loading: recursosLoading } = useSelector((state: RootState) => state.ordenCompraRecursos);
    const movilidades = useSelector((state: RootState) => state.movilidad.movilidades);
    const movimientos = useSelector((state: RootState) => state.movimiento.movimientos);

    // Efectos
    useEffect(() => {
        dispatch(fetchOrdenCompras());
        dispatch(fetchMovilidades());
        dispatch(fetchMovimientos());
    }, [dispatch]);

    useEffect(() => {
        if (selectedOrdenId) {
            dispatch(fetchOrdenCompraRecursosByOrdenId(selectedOrdenId));
        }
    }, [dispatch, selectedOrdenId]);

    useEffect(() => {
        if (recursos) {
            const nuevosDetalles: RecursoDetalle[] = recursos.map(recurso => ({
                id: recurso.id,
                id_recurso: {
                    id: recurso.id_recurso.id,
                    codigo: recurso.id_recurso.codigo,
                    nombre: recurso.id_recurso.nombre,
                    unidad_id: recurso.id_recurso.unidad_id,
                    
                },
                cantidad: recurso.cantidad,
                cantidadRecibida: 0,
                diferencia: recurso.cantidad,
                costo: recurso.costo_real
            }));
            setDetalles(nuevosDetalles);
        }
    }, [recursos]);

    // Handlers
    const handleOrdenClick = (orden: OrdenCompra) => {
        setSelectedOrdenId(orden.id);
        setSelectedOrden(orden);
    };

    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [advertencias, setAdvertencias] = useState<string[]>([]);

    const handleRecepcionComplete = async () => {
        if (!selectedOrden) {
            setValidationErrors([{ field: 'general', message: 'No se ha seleccionado una orden' }]);
            return;
        }

        // Generar advertencias para cantidades parciales
        const warnings = detalles
            .filter(d => d.cantidadRecibida > 0 && d.cantidadRecibida < d.cantidad)
            .map(d => `Recepción parcial: Faltan ${d.cantidad - d.cantidadRecibida} unidades de ${d.id_recurso.nombre}`);

        if (warnings.length > 0) {
            setAdvertencias(warnings);
            setShowConfirmDialog(true);
            return;
        }

        await procesarRecepcion();
    };

    const procesarRecepcion = async () => {
        try {
            // Validaciones iniciales
            const hayRecepcion = detalles.some(d => d.cantidadRecibida > 0);
            if (!hayRecepcion) {
                setValidationErrors([{ field: 'general', message: 'Debe ingresar al menos una cantidad recibida' }]);
                return;
            }

            const movimientoEntrada = movimientos.find(m => m.nombre === 'compra');
            if (!movimientoEntrada) {
                throw new Error('No se encontró el tipo de movimiento de entrada');
            }

            // Determinar el estado
            const todosCompletos = detalles.every(detalle => detalle.cantidadRecibida === detalle.cantidad);
            const estado: EstadoTransferencia = todosCompletos ? 'COMPLETO' : 'PARCIAL';

            // 1. Crear la transferencia principal
            const transferenciaData: TransferenciaData = {
                usuario_id: userId || '',
                fecha: new Date(),
                movimiento_id: movimientoEntrada.id,
                movilidad_id: movilidadId,
                estado
            };

            const transferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

            //  Crear el detalle de transferencia
            const detalleData = {
                transferencia_id: transferencia.id,
                referencia_id: selectedOrden!.id,
                fecha: new Date(),
                tipo: 'RECEPCION_COMPRA',
                referencia: `Recepción de compra - Orden ${selectedOrden!.id}`,
                recursos: detalles
                    .filter(detalle => detalle.cantidadRecibida > 0)
                    .map(detalle => ({
                        recurso_id: detalle.id_recurso.id,
                        cantidad: detalle.cantidadRecibida,
                        
                    }))
                };
                console.log(detalles);

            const detalleTransferencia = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

            // 3. Crear los registros de recursos para la transferencia
            const recursosPromises = detalles
                .filter(detalle => detalle.cantidadRecibida > 0)
                .map(detalle => {
                    const transferenciaRecursoData = {
                        transferencia_detalle_id: detalleTransferencia.id,
                        recurso_id: detalle.id_recurso.id,
                        cantidad: detalle.cantidadRecibida,
                        costo: detalle.costo
                    };
                    return dispatch(addTransferenciaRecurso(transferenciaRecursoData)).unwrap();
                });

            // Esperar a que todos los recursos se guarden
            await Promise.all(recursosPromises);

            // Completar el proceso
            onComplete(selectedOrden!, detalles);
            setOrdenesCompletadas(prev => [...prev, selectedOrden!] as OrdenCompra[]);
            handleCloseRecepcion();
            setValidationErrors([]);

        } catch (error) {
            console.error('Error detallado:', error);
            let errorMessage = 'Error desconocido';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                errorMessage = JSON.stringify(error);
            }

            setValidationErrors([{
                field: 'general',
                message: 'Error al guardar la recepción: ' + errorMessage
            }]);
        }
    };

    const handleCloseRecepcion = () => {
        setSelectedOrdenId(null);
        setSelectedOrden(null);
        setDetalles([]);
        setFechaRecepcion(new Date().toISOString().split('T')[0]);
        setMovilidadId('');
    };

    const handleFechaChange = (fecha: string) => {
        setFechaRecepcion(fecha);
    };

    const handleMovilidadChange = (id: string) => {
        setMovilidadId(id);
    };

    const handleCantidadChange = (index: number, value: number) => {
        const newDetalles = [...detalles];
        const cantidadRecibida = Math.max(0, value);
        newDetalles[index] = {
            ...newDetalles[index],
            cantidadRecibida,
            diferencia: newDetalles[index].cantidad - cantidadRecibida
        };
        setDetalles(newDetalles);
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
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-full h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="border-b border-gray-100 bg-white">
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-blue-800">Recepción de Compras</h2>
                    <button onClick={onClose} className="text-2xl text-red-500 hover:text-red-600">
                        <FiX />
                    </button>
                </div>
            </div>

            {/* Errores de validación */}
            {validationErrors.length > 0 && (
                <ValidationErrors errors={validationErrors} />
            )}

            {/* Main Content */}
            <div className="flex flex-1 min-h-0">
                {/* Panel izquierdo - Lista de órdenes */}
                <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
                    <div className="p-4 bg-white border-b">
                        <h3 className="text-sm font-medium text-gray-700">Órdenes de Compra Pendientes</h3>
                    </div>
                    <div className="bg-gray-50 p-4 space-y-3">
                        {ordenesPendientes.map((oc: OrdenCompra) => (
                            <div
                                key={oc.id}
                                onClick={() => handleOrdenClick(oc)}
                                className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${selectedOrdenId === oc.id
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <div className="p-3">
                                    <div className="text-sm font-medium text-gray-900">N° OC: {oc.codigo_orden}</div>
                                    <div className="text-xs text-gray-500 mt-1">Descripción: {oc.descripcion}</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Fecha: {new Date(oc.fecha_ini).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${oc.estado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {oc.estado ? 'Activo' : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel derecho - Recursos y Detalles */}
                <div className="flex-1 bg-white overflow-y-auto">
                    {selectedOrden ? (
                        <>
                            {/* Información de la orden */}
                            <div className="p-4 bg-gray-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Orden de Compra #{selectedOrden.codigo_orden}
                                </h3>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Descripción: {selectedOrden.descripcion}</p>
                                    <p>Fecha: {new Date(selectedOrden.fecha_ini).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Formulario de recepción */}
                            <div className="p-4 border-b">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fecha de Recepción
                                        </label>
                                        <input
                                            type="date"
                                            value={fechaRecepcion}
                                            onChange={e => handleFechaChange(e.target.value)}
                                            min={new Date(selectedOrden.fecha_ini).toISOString().split('T')[0]}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tipo de Transporte
                                        </label>
                                        <select
                                            value={movilidadId}
                                            onChange={e => handleMovilidadChange(e.target.value)}
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccione un tipo de transporte</option>
                                            {movilidades?.map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.denominacion}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de recursos */}
                            <div className="p-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Código</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unidad</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cantidad</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cant. Recibida</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Diferencia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {detalles.map((detalle, index) => (
                                            <tr key={detalle.id}>
                                                <td className="px-3 py-2 text-sm text-gray-900">{detalle.id_recurso.codigo}</td>
                                                <td className="px-3 py-2 text-sm text-gray-900">{detalle.id_recurso.nombre}</td>
                                                <td className="px-3 py-2 text-sm text-gray-500">{detalle.id_recurso.unidad_id}</td>
                                                <td className="px-3 py-2 text-sm text-gray-900">{detalle.cantidad}</td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={detalle.cantidad}
                                                        value={detalle.cantidadRecibida}
                                                        onChange={(e) => handleCantidadChange(index, parseInt(e.target.value))}
                                                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    <span className={detalle.diferencia > 0 ? 'text-yellow-600' : 'text-green-600'}>
                                                        {detalle.diferencia}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <p className="text-lg">Seleccione una orden de compra</p>
                                <p className="text-sm mt-2">Para ver los recursos disponibles</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-white">
                <div className="text-sm text-gray-600">
                    Total Órdenes: {ordenCompras.length} |
                    Pendientes: {ordenesPendientes.length} |
                    Completadas: {ordenesCompletadas.length}
                </div>
            </div>
            {/* Footer con botones */}
            <div className="p-4 border-t bg-white">
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleCloseRecepcion}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleRecepcionComplete}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Guardar Recepción
                    </button>
                </div>
            </div>
            {/* Diálogo de confirmación */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Confirmación de Recepción Parcial
                        </h3>
                        <div className="max-h-60 overflow-y-auto mb-4 bg-yellow-50 p-4 rounded-lg">
                            <p className="text-gray-700 mb-3">Se han detectado las siguientes diferencias:</p>
                            {advertencias.map((warning, index) => (
                                <p key={index} className="text-yellow-700 mb-2 pl-4 border-l-4 border-yellow-400">
                                    {warning}
                                </p>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    setShowConfirmDialog(false);
                                    await procesarRecepcion();
                                }}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                            >
                                Confirmar Recepción Parcial
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecepcionCompra;