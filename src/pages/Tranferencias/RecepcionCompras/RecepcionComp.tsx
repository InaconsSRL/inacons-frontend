import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { fetchOrdenCompraRecursosByOrdenId } from '../../../slices/ordenCompraRecursosSlice';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';
import { fetchMovilidades } from '../../../slices/movilidadSlice';
import { fetchMovimientos } from '../../../slices/movimientoSlice';
import { RootState } from '../../../store/store';
import { FiSave } from 'react-icons/fi';
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
        let mounted = true;
        let controller = new AbortController();

        const cargarDatos = async () => {
            if (!ordenId) return;
            
            try {
                const promises = [];
                
                // Cargar recursos siempre que cambie ordenId
                promises.push(dispatch(fetchOrdenCompraRecursosByOrdenId(ordenId)));
                
                // Cargar datos maestros solo si no están cargados
                if (!movilidades?.length) {
                    promises.push(dispatch(fetchMovilidades()));
                }
                if (!movimientos?.length) {
                    promises.push(dispatch(fetchMovimientos()));
                }

                if (promises.length > 0) {
                    await Promise.all(promises);
                }
            } catch (error) {
                if (mounted && error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error al cargar datos:', error);
                    setValidationErrors([{
                        field: 'general',
                        message: 'Error al cargar datos: ' + error.message,
                        type: 'error'
                    }]);
                }
            }
        };

        cargarDatos();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [dispatch, ordenId, movilidades?.length, movimientos?.length]); // Solo dependemos de las longitudes

    useEffect(() => {
        if (recursos) {
            const recursosFiltrados = recursos.filter(recurso => recurso.cantidad > 0);
            if (recursosFiltrados.length > 0) {
                setDetalles(recursosFiltrados.map(recurso => ({
                    ...recurso,
                    cantidadRecibida: 0,
                    diferencia: recurso.cantidad,
                    observaciones: ''
                })));
            } else {
                // Si no hay recursos con cantidad mayor a 0, no se establece detalles
                setDetalles([]);
            }
        }
    }, [recursos]);

    // Manejo de la cantidad recibida
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

    // Obtener ID del movimiento de entrada
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
            //  Validar los datos
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

            //  Obtener el ID del movimiento de entrada por compra
            const movimientoId = getMovimientoEntradaId();
            if (!movimientoId) {
                throw new Error('No se encontró el tipo de movimiento de entrada. Verifica que exista un movimiento de tipo "entrada" para compras.');
            }

            //  Determinar el estado de la transferencia
            const estado = determinarEstadoTransferencia();

            //  Crear la transferencia
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

            //  Guardar los detalles y recursos
            for (const detalle of detalles.filter(d => d.cantidadRecibida > 0)) {
                // Crear el detalle de transferencia
                const detalleData = {
                    transferencia_id: transferencia.id,
                    referencia_id: detalle.id_recurso.id,
                    fecha: new Date(fechaRecepcion),
                    tipo: 'RECEPCION_COMPRA',
                    referencia: `Recepción de compra - Orden ${ordenId}`
                };
                console.log('Guardando detalle:', detalleData);
                const detalleGuardado = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

                // Guardar el recurso asociado al detalle
                const recursoData = {
                    transferencia_detalle_id: detalleGuardado.id,
                    recurso_id: detalle.id_recurso.id,
                    cantidad: detalle.cantidadRecibida,
                    costo: detalle.precio_unitario || 0
                };
                console.log('Guardando recurso:', recursoData);
                await dispatch(addTransferenciaRecurso(recursoData)).unwrap();
            }
            console.log('Detalles y recursos guardados');

            // 6. Si la recepción está completa o parcial y existe onComplete, notificar
            if ((estado === 'COMPLETO' || estado === 'PARCIAL') && onComplete) {
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
        <div className="h-full flex flex-col">
            <ValidationErrors errors={validationErrors} />

            <div className="flex-1 overflow-auto">
                {/* Información de la compra */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
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

                {/* Tabla de recursos */}
                <div className="flex-1 overflow-auto border rounded-lg bg-white">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0 shadow-sm">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Código</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Nombre</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Unidad</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cantidad</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cant. Recibida</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Diferencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {detalles.map((detalle, index) => (
                                <tr key={detalle.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 text-sm">{detalle.id_recurso.codigo}</td>
                                    <td className="px-3 py-2 text-sm">{detalle.id_recurso.nombre}</td>
                                    <td className="px-3 py-2 text-sm">{detalle.id_recurso.unidad_id}</td>
                                    <td className="px-3 py-2 text-sm">{detalle.cantidad}</td>
                                    <td className="px-3 py-2">
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
                                    <td className="px-3 py-2 text-sm">
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
            <div className="p-4 border-t mt-auto bg-white">
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardarRecepcion}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
                        disabled={guardando || validationErrors.length > 0}
                    >
                        {guardando ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                        ) : (
                            <FiSave className="w-4 h-4" />
                        )}
                        {guardando ? 'Guardando...' : 'Guardar Recepción'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecepcionComp;
