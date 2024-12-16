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

interface RecepcionesListaProps {
    recepciones: {
        orden: OrdenCompra;
        detalles: RecursoDetalle[];
    }[];
}

const RecepcionesLista: React.FC<RecepcionesListaProps> = ({ recepciones }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                    Recepciones Completadas
                </h3>
            </div>

            <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">N° OC</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Descripción</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Fecha</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Recursos</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recepciones.map(({ orden, detalles }) => (
                            <tr key={orden.id}>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                    {orden.codigo_orden}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-500">
                                    {orden.descripcion}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-500">
                                    {new Date(orden.fecha_ini).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-500">
                                    {detalles.length} recursos
                                </td>
                                <td className="px-3 py-2">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Completada
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {recepciones.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                                    No hay recepciones registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecepcionesLista;
