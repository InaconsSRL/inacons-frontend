import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransferenciaRecursosById } from '../../../slices/transferenciaRecursoSlice';
import { RootState } from '../../../store/store';
import { TransferenciaDetalleData } from '../../../slices/transferenciaDetalleSlice';

interface Props {
    onClose: () => void;
    detalleId: string;
    recursos: RecursoDetalle[];
    detalle: TransferenciaDetalleData;
    transferenciaId: string;
    onComplete: () => void;
}

interface RecursoDetalle {
    id: string;
    codigo: string;
    nombre: string;
    unidad: string;
    cantidadTransferida: number;
    cantidadRecibida: number;
    fechaLimite: string;
}

const Recepciones: React.FC<Props> = ({ onClose, detalleId, recursos, detalle, transferenciaId, onComplete }) => {
    const dispatch = useDispatch();
    const unidades = useSelector((state: RootState) => state.unidad.unidades);

    const [recepcion, setRecepcion] = useState<{
        ordenTransferencia: string;
        numeroSolicitud: string;
        almacenSalida: string;
        almacenDestino: string;
        estado: string;
        tipoTransporte: string;
        observaciones: string;
        fechaEmision: string;
        detalles: RecursoDetalle[];
    }>({
        ordenTransferencia: '',
        numeroSolicitud: '',
        almacenSalida: '',
        almacenDestino: '',
        estado: 'En recepcion',
        tipoTransporte: '',
        observaciones: '',
        fechaEmision: new Date().toLocaleDateString(),
        detalles: [],
    });

    useEffect(() => {
        if (recursos.length > 0) {
            setRecepcion(prev => ({
                ...prev,
                ordenTransferencia: `TRA-${detalle.referencia_id}`,
                numeroSolicitud: detalle.referencia,
                tipoTransporte: detalle.tipo,
                detalles: recursos.map(item => ({
                    id: item.id,
                    codigo: item.codigo,
                    nombre: item.nombre,
                    unidad: unidades?.find(u => u.id === item.unidad)?.nombre || 'UND',
                    cantidadTransferida: item.cantidadTransferida,
                    cantidadRecibida: item.cantidadRecibida,
                    fechaLimite: item.fechaLimite,
                })),
            }));
        }
    }, [recursos, unidades, detalle]);

    const handleCantidadChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const cantidadRecibida = parseInt(e.target.value);
        const updatedDetalles = [...recepcion.detalles];
        updatedDetalles[index].cantidadRecibida = cantidadRecibida;
        setRecepcion({ ...recepcion, detalles: updatedDetalles });
    };

    const handleCompleteRecepcion = () => {
        // Completar la recepción y llamar a onComplete para mostrar la guía de transferencias
        onComplete();
    };

    // Agregar logs de depuración
    console.log('Detalle:', detalle);
    console.log('Recursos:', recursos);
    console.log('Unidades:', unidades);
    console.log('Recepción:', recepcion);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
            <div className="flex justify-between items-center bg-[#0A4BAC] text-white p-3">
                <h2 className="text-lg font-semibold">Recepcion de transferencia</h2>
                <button onClick={onClose} className="text-white hover:text-red-500 font-bold text-xl">
                    ×
                </button>
            </div>

            <div className="p-4">
                <div className="flex gap-4">
                    {/* Panel izquierdo - Formulario */}
                    <div className="w-[30%] space-y-3">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">N° de orden de Transferencia</label>
                            <input
                                type="text"
                                value={recepcion.ordenTransferencia}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Número de Solicitud</label>
                            <input
                                type="text"
                                value={recepcion.numeroSolicitud}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Almacen de Salida</label>
                            <input
                                type="text"
                                value={recepcion.almacenSalida}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Almacen de Destino</label>
                            <input
                                type="text"
                                value={recepcion.almacenDestino}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Estado</label>
                            <input
                                type="text"
                                value={recepcion.estado}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Tipo de transporte</label>
                            <input
                                type="text"
                                value={recepcion.tipoTransporte}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Observaciones</label>
                            <textarea
                                value={recepcion.observaciones}
                                onChange={(e) => setRecepcion({ ...recepcion, observaciones: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                rows={3}
                            />
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-gray-600">
                                Fecha de Emisión: {recepcion.fechaEmision}
                            </span>
                        </div>
                    </div>

                    {/* Panel derecho - Tabla */}
                    <div className="w-[70%]">
                        <div className="overflow-x-auto border border-gray-200 rounded">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Codigo</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Nombre</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Unidad</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Cant. Trasferida</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Cant. recibida</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Diferencia</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">F.limite</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Imagen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {recepcion.detalles.map((detalle, index) => (
                                        <tr key={detalle.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                            </td>
                                            <td className="px-3 py-2 text-sm">{detalle.codigo}</td>
                                            <td className="px-3 py-2 text-sm">{detalle.nombre}</td>
                                            <td className="px-3 py-2 text-sm">{detalle.unidad}</td>
                                            <td className="px-3 py-2 text-sm">{detalle.cantidadTransferida}</td>
                                            <td className="px-3 py-2">
                                                <input 
                                                    type="number" 
                                                    value={detalle.cantidadRecibida || ''} 
                                                    onChange={(e) => handleCantidadChange(index, e)} 
                                                    className="w-20 p-1 border border-gray-300 rounded text-sm" 
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-sm">
                                                {detalle.cantidadRecibida !== undefined && (
                                                    <span className={
                                                        detalle.cantidadRecibida < detalle.cantidadTransferida ? 'text-orange-600' :
                                                        detalle.cantidadRecibida > detalle.cantidadTransferida ? 'text-blue-600' : 
                                                        'text-green-600'
                                                    }>
                                                        {detalle.cantidadTransferida - detalle.cantidadRecibida}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-sm">{detalle.fechaLimite}</td>
                                            <td className="px-3 py-2 text-sm">Imagen</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recepciones;