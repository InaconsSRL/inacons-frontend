import React, { useState, useEffect } from 'react';
import { RecepcionTransferencia, TransferenciaDetalle } from '../interfaces/Recepciones';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransferenciaRecursos } from '../../../slices/transferenciaRecursoSlice';

interface Props {
    onClose: () => void;
}

const Recepciones: React.FC<Props> = ({ onClose }) => {
    const dispatch = useDispatch();
    const { transferenciaRecursos } = useSelector((state: any) => state.transferenciaRecurso);
    
    const [recepcion, setRecepcion] = useState<RecepcionTransferencia>({
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
        const fetchData = async () => {
            await dispatch(fetchTransferenciaRecursos()); // Obtener recursos de transferencia
            setRecepcion(prev => ({
                ...prev,
                detalles: transferenciaRecursos.map(item => ({
                    ...item,
                    cantidadRecibida: 0,
                    observaciones: 'ninguna',
                })),
            }));
        };

        fetchData();
    }, [dispatch, transferenciaRecursos]);

    const handleCantidadChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const cantidadRecibida = parseInt(e.target.value);
        const updatedDetalles = [...recepcion.detalles];
        updatedDetalles[index].cantidadRecibida = cantidadRecibida;
        setRecepcion({ ...recepcion, detalles: updatedDetalles });
    };

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
                            <label className="block text-sm text-gray-700 mb-1">N° de oden de Transferencia</label>
                            <input
                                type="text"
                            />
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
