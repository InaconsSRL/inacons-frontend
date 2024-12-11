import React, { useState } from 'react';
import { RecepcionTransferencia, TransferenciaDetalle } from '../interfaces/Recepciones';

interface Props {
    onClose: () => void;
}

const Recepciones: React.FC<Props> = ({ onClose }) => {
    const [recepcion, setRecepcion] = useState<RecepcionTransferencia>({
        ordenTransferencia: '',
        numeroSolicitud: '',
        almacenSalida: '',
        almacenDestino: '',
        estado: 'En recepcion',
        tipoTransporte: '',
        observaciones: '',
        fechaEmision: new Date().toLocaleDateString(),
        detalles: [
            {
                id: 1,
                codigo: '6985234',
                nombre: 'ATL MOUSE LOGITECH M170 / INA-MOU-025 Henry Godiño',
                unidad: 'UND',
                cantidadTransferida: 1,
                fechaLimite: '22/11/2024',
            },
            {
                id: 2,
                codigo: '6985234',
                nombre: 'ATL MOUSE LOGITECH M170 / INA-MOU-025 Henry Godiño',
                unidad: 'UND',
                cantidadTransferida: 1,
                fechaLimite: '22/11/2024',
            },
            {
                id: 3,
                codigo: '6985234',
                nombre: 'ATL MOUSE LOGITECH M170 / INA-MOU-025 Henry Godiño',
                unidad: 'UND',
                cantidadTransferida: 1,
                fechaLimite: '22/11/2024',
            },
            {
                id: 4,
                codigo: '6985234',
                nombre: 'ATL MOUSE LOGITECH M170 / INA-MOU-025 Henry Godiño',
                unidad: 'UND',
                cantidadTransferida: 1,
                fechaLimite: '22/11/2024',
            }
        ]
    });

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
                                value={recepcion.ordenTransferencia}
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Número de Solicitud</label>
                            <input
                                type="text"
                                value={recepcion.numeroSolicitud}
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Almacen de Salida</label>
                            <input
                                type="text"
                                value={recepcion.almacenSalida}
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Almacen de Destino</label>
                            <input
                                type="text"
                                value={recepcion.almacenDestino}
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Estado: En recepcion</label>
                            <input
                                type="text"
                                value={recepcion.estado}
                                className="w-full p-1.5 border border-gray-300 rounded text-sm bg-gray-100"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Tipo de transporte</label>
                            <input
                                type="text"
                                value={recepcion.tipoTransporte}
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">observaciones:</label>
                            <textarea
                                value={recepcion.observaciones}
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                rows={3}
                                readOnly
                            ></textarea>
                        </div>

                        <div className="text-right">
                            <span className="text-sm text-gray-600">
                                Fecha de Emision: {recepcion.fechaEmision}
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
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">F.limite</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Cant. recibida</th>
                                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Imagen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {recepcion.detalles.map((detalle) => (
                                        <tr key={detalle.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                            </td>
                                            <td className="px-3 py-2 text-sm">{detalle.codigo}</td>
                                            <td className="px-3 py-2 text-sm">{detalle.nombre}</td>
                                            <td className="px-3 py-2 text-sm">{detalle.unidad}</td>
                                            <td className="px-3 py-2 text-sm">{detalle.cantidadTransferida}</td>
                                            <td className="px-3 py-2 text-sm">{detalle.fechaLimite}</td>
                                            <td className="px-3 py-2">
                                                <input type="text" className="w-20 p-1 border border-gray-300 rounded text-sm" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <button className="p-1 bg-[#0A4BAC] text-white rounded hover:bg-blue-700">
                                                    ↑
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Botón Generar reportes */}
                        <div className="mt-4 text-right">
                            <button className="bg-[#0A4BAC] text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
                                Generar reportes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recepciones;

