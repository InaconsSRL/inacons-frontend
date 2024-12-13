import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdenCompraRecursosByOrdenId } from '../../../slices/ordenCompraRecursosSlice';
import { RootState } from '../../../store/store';
import { FiX } from 'react-icons/fi';

interface Props {
    ordenId: string;
    onClose: () => void;
}

const RecepcionCompra: React.FC<Props> = ({ ordenId, onClose }) => {
    const dispatch = useDispatch();
    const { ordenCompraRecursosByOrdenId: recursos } = useSelector((state: RootState) => state.ordenCompraRecursos);
    const [detalles, setDetalles] = useState<any[]>([]);

    useEffect(() => {
        console.log('ordenId recibido:', ordenId); // Para debugging
        if (ordenId) {
            dispatch(fetchOrdenCompraRecursosByOrdenId(ordenId));
        }
    }, [dispatch, ordenId]);

    useEffect(() => {
        console.log('recursos recibidos:', recursos); // Para debugging
        if (recursos) {
            setDetalles(recursos.map(recurso => ({
                ...recurso,
                cantidadRecibida: 0,
                diferencia: recurso.cantidad
            })));
        }
    }, [recursos]);

    const handleCantidadChange = (index: number, value: number) => {
        const newDetalles = [...detalles];
        newDetalles[index] = {
            ...newDetalles[index],
            cantidadRecibida: value,
            diferencia: newDetalles[index].cantidad - value
        };
        setDetalles(newDetalles);
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">Recepción de Compra</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <FiX className="w-6 h-6" />
                </button>
            </div>

            <div className="flex gap-6">
                {/* Panel izquierdo - Información de la orden */}
                <div className="w-[300px] space-y-4 border rounded-lg p-4">
                    <div>
                        <p className="text-sm text-gray-600">N° de Orden de Compra</p>
                        <p className="font-medium">{ordenId}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Destino</p>
                        <p className="font-medium">Almacén Principal</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Almacén de Salida</p>
                        <p className="font-medium">Almacén Central</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Estado</p>
                        <p className="font-medium">Pendiente</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Fecha</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Panel derecho - Tabla de recursos */}
                <div className="flex-1">
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cant. recibida</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diferencia</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {detalles.map((detalle, index) => (
                                    <tr key={detalle.id}>
                                        <td className="px-4 py-2">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="px-4 py-2 text-sm">{detalle.id_recurso.codigo}</td>
                                        <td className="px-4 py-2 text-sm">{detalle.id_recurso.nombre}</td>
                                        <td className="px-4 py-2 text-sm">{detalle.id_recurso.unidad_id}</td>
                                        <td className="px-4 py-2 text-sm">{detalle.cantidad}</td>
                                        <td className="px-4 py-2">
                                            <input 
                                                type="number" 
                                                value={detalle.cantidadRecibida} 
                                                onChange={(e) => handleCantidadChange(index, Number(e.target.value))}
                                                className="w-20 p-1 border border-gray-300 rounded text-sm" 
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={
                                                detalle.diferencia < 0 ? 'text-orange-600' :
                                                detalle.diferencia > 0 ? 'text-blue-600' : 
                                                'text-green-600'
                                            }>
                                                {detalle.diferencia}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button className="text-blue-600 hover:text-blue-800">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Generar reportes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecepcionCompra;
