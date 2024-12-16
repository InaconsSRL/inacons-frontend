import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { fetchOrdenCompraRecursosByOrdenId } from '../../../slices/ordenCompraRecursosSlice';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { fetchMovilidades } from '../../../slices/movilidadSlice';
import { fetchMovimientos } from '../../../slices/movimientoSlice';
import { RootState } from '../../../store/store';
import { FiX, FiSave } from 'react-icons/fi';
import { EstadoTransferencia } from '../types';
import { validateAll, ValidationError } from './utils/validaciones';
import ValidationErrors from './components/ValidationErrors';
import { OrdenCompra } from '../../../services/ordenCompraService';

interface RecepcionCompProps {
    ordenId: string;
    ordenCompra: OrdenCompra;
    onClose: () => void;
    onComplete?: (orden: OrdenCompra) => void;
}

const RecepcionComp: React.FC<RecepcionCompProps> = ({ 
    ordenId, 
    ordenCompra, 
    onClose, 
    onComplete 
}) => {
    // Estados
    const [detalles, setDetalles] = useState<any[]>([]);
    const [fechaRecepcion, setFechaRecepcion] = useState(new Date().toISOString().split('T')[0]);
    const [guardando, setGuardando] = useState(false);
    const [movilidadId, setMovilidadId] = useState('');
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    // Selectores
    const dispatch = useDispatch<AppDispatch>();
    const { ordenCompraRecursosByOrdenId: recursos, loading, error } = useSelector((state: RootState) => state.ordenCompraRecursos);
    const movilidades = useSelector((state: RootState) => state.movilidad.movilidades);
    const movimientos = useSelector((state: RootState) => state.movimiento.movimientos);

    // Efectos
    useEffect(() => {
        const cargarDatos = async () => {
            if (ordenId) {
                try {
                    console.log('Iniciando carga de datos...');
                    await Promise.all([
                        dispatch(fetchOrdenCompraRecursosByOrdenId(ordenId)),
                        dispatch(fetchMovilidades()),
                        dispatch(fetchMovimientos())
                    ]);
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                    setValidationErrors([{
                        field: 'general',
                        message: 'Error al cargar datos: ' + (error as Error).message,
                        type: 'error'
                    }]);
                }
            }
        };
    
        cargarDatos();
    }, [dispatch, ordenId]);

    useEffect(() => {
        if (recursos) {
            setDetalles(recursos.map(recurso => ({
                ...recurso,
                cantidadRecibida: 0,
                diferencia: recurso.cantidad,
                observaciones: ''
            })));
        }
    }, [recursos]);

    // Handlers
    const handleCantidadChange = (index: number, value: number) => {
        const newDetalles = [...detalles];
        const cantidadRecibida = Math.max(0, value);
        newDetalles[index] = {
            ...newDetalles[index],
            cantidadRecibida,
            diferencia: newDetalles[index].cantidad - cantidadRecibida
        };
        setDetalles(newDetalles);

        setValidationErrors(prev => 
            prev.filter(error => !error.field.startsWith('cantidad_'))
        );
    };

    const handleFechaChange = (fecha: string) => {
        setFechaRecepcion(fecha);
        setValidationErrors(prev => 
            prev.filter(error => error.field !== 'fecha')
        );
    };

    const handleMovilidadChange = (id: string) => {
        setMovilidadId(id);
        setValidationErrors(prev => 
            prev.filter(error => error.field !== 'movilidad')
        );
    };

    const getMovimientoEntradaId = () => {
        const movimientoEntrada = movimientos.find(m => 
            m.tipo === 'entrada' || (
                m.nombre.toLowerCase().includes('entrada') && 
                m.nombre.toLowerCase().includes('compra')
            )
        );

        if (!movimientoEntrada) {
            console.error('No se encontró movimiento de entrada. Movimientos disponibles:', movimientos);
        } else {
            console.log('Movimiento de entrada encontrado:', movimientoEntrada);
        }

        return movimientoEntrada?.id;
    };

    const determinarEstadoTransferencia = (): EstadoTransferencia => {
        const todosCompletos = detalles.every(detalle => 
            detalle.cantidadRecibida === detalle.cantidad
        );
        return todosCompletos ? 'COMPLETO' : 'PARCIAL';
    };

    const handleGuardarRecepcion = async () => {
        try {
            // 1. Validar los datos
            const errors = validateAll(
                detalles,
                fechaRecepcion,
                ordenCompra.fecha_ini,
                movilidadId
            );

            if (errors.length > 0) {
                setValidationErrors(errors);
                return;
            }

            setGuardando(true);

            // 2. Obtener el ID del movimiento de entrada por compra
            const movimientoId = getMovimientoEntradaId();
            if (!movimientoId) {
                throw new Error('No se encontró el tipo de movimiento de entrada. Verifica que exista un movimiento de tipo "entrada" para compras.');
            }

            // 3. Determinar el estado de la transferencia
            const estado = determinarEstadoTransferencia();

            // 4. Crear la transferencia
            const transferenciaData = {
                usuario_id: "1", // TODO: Obtener el usuario actual
                fecha: new Date(fechaRecepcion),
                movimiento_id: movimientoId,
                movilidad_id: movilidadId,
                estado
            };

            console.log('Guardando transferencia:', transferenciaData);
            const transferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();
            console.log('Transferencia guardada:', transferencia);

            // 5. Guardar los detalles
            const detallesPromises = detalles
                .filter(detalle => detalle.cantidadRecibida > 0)
                .map(detalle => {
                    const detalleData = {
                        transferencia_id: transferencia.id,
                        referencia_id: detalle.id_recurso.id,
                        fecha: new Date(fechaRecepcion),
                        tipo: 'RECEPCION_COMPRA',
                        referencia: `Recepción de compra - Orden ${ordenId}`
                    };
                    console.log('Guardando detalle:', detalleData);
                    return dispatch(addTransferenciaDetalle(detalleData)).unwrap();
                });

            await Promise.all(detallesPromises);
            console.log('Detalles guardados');

            // 6. Si la recepción está completa, notificar
            if (estado === 'COMPLETO' && onComplete) {
                onComplete(ordenCompra);
            }

            // 7. Cerrar el formulario
            onClose();
        } catch (error) {
            console.error('Error al guardar:', error);
            setValidationErrors([{
                field: 'general',
                message: 'Error al guardar la recepción: ' + (error as Error).message,
                type: 'error'
            }]);
        } finally {
            setGuardando(false);
        }
    };

    // Loading y Error states
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4">
                Error al cargar los recursos: {error}
            </div>
        );
    }

    // Render
    return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-2xl font-bold text-[#0A3977]">Compra</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
                    <FiX className="w-5 h-5" />
                </button>
            </div>

            <ValidationErrors errors={validationErrors} />

            <div className="grid grid-cols-[300px,1fr] gap-8">
                {/* Left Panel */}
                <div className="space-y-6 bg-gray-50 rounded-lg p-6">
                    <div>
                        <p className="text-sm font-medium text-gray-700">N° de Orden de Compra</p>
                        <p className="mt-1 text-lg">{ordenCompra.codigo_orden}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Fecha de Recepción</p>
                        <input
                            type="date"
                            value={fechaRecepcion}
                            onChange={e => handleFechaChange(e.target.value)}
                            min={new Date(ordenCompra.fecha_ini).toISOString().split('T')[0]}
                            max={new Date().toISOString().split('T')[0]}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Tipo de Transporte</p>
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
                    <div>
                        <p className="text-sm font-medium text-gray-700">Estado de Recepción</p>
                        <p className="mt-1 text-lg font-semibold">
                            {determinarEstadoTransferencia()}
                        </p>
                    </div>
                </div>

                {/* Right Panel - Table */}
                <div className="bg-white rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unidad</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cant. Recibida</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Diferencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {detalles.map((detalle, index) => (
                                <tr key={detalle.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{detalle.id_recurso.codigo}</td>
                                    <td className="px-4 py-3 text-sm">{detalle.id_recurso.nombre}</td>
                                    <td className="px-4 py-3 text-sm">{detalle.id_recurso.unidad_id}</td>
                                    <td className="px-4 py-3 text-sm">{detalle.cantidad}</td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            min="0"
                                            max={detalle.cantidad}
                                            value={detalle.cantidadRecibida}
                                            onChange={(e) => handleCantidadChange(index, parseInt(e.target.value))}
                                            className={`w-24 p-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                validationErrors.some(error => error.field === `cantidad_${index}`)
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`${
                                            detalle.diferencia > 0 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                            {detalle.diferencia}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleGuardarRecepcion}
                    className="px-6 py-2 bg-[#4086F4] text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
                    disabled={guardando || validationErrors.length > 0}
                >
                    {guardando ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    ) : (
                        <FiSave className="w-4 h-4" />
                    )}
                    {guardando ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </div>
    );
};

export default RecepcionComp;
