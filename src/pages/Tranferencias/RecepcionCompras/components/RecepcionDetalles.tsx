import React from 'react';
import { OrdenCompra } from '../../../../services/ordenCompraService';

interface RecursoDetalle {
    id: string;
    id_recurso: {
        id: string;
        codigo: string;
        nombre: string;
        unidad_id: string;
    };
    cantidad: number;
    cantidadRecibida: number;
    diferencia: number;
}

interface RecepcionDetallesProps {
    orden: OrdenCompra;
    detalles: RecursoDetalle[];
    fechaRecepcion: string;
    movilidadId: string;
    observaciones: string;
    onFechaChange: (fecha: string) => void;
    onMovilidadChange: (id: string) => void;
    onObservacionesChange: (obs: string) => void;
    onCantidadChange: (index: number, cantidad: number) => void;
    movilidades: any[];
}

const RecepcionDetalles: React.FC<RecepcionDetallesProps> = ({
    orden,
    detalles,
    fechaRecepcion,
    movilidadId,
    observaciones,
    onFechaChange,
    onMovilidadChange,
    onObservacionesChange,
    onCantidadChange,
    movilidades
}) => {
    return (
        <div className="flex-1 bg-white overflow-y-auto">
            {/* Información de la orden */}
            <div className="p-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                    Orden de Compra #{orden.codigo_orden}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                    <p>Descripción: {orden.descripcion}</p>
                    <p>Fecha: {new Date(orden.fecha_ini).toLocaleDateString()}</p>
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
                            onChange={e => onFechaChange(e.target.value)}
                            min={new Date(orden.fecha_ini).toISOString().split('T')[0]}
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
                            onChange={e => onMovilidadChange(e.target.value)}
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
                                        onChange={(e) => onCantidadChange(index, parseInt(e.target.value))}
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

            {/* Observaciones */}
            <div className="p-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                </label>
                <textarea
                    value={observaciones}
                    onChange={e => onObservacionesChange(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingrese sus observaciones aquí..."
                />
            </div>
        </div>
    );
};

export default RecepcionDetalles;
