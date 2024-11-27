import React from 'react';
import { FiFile } from 'react-icons/fi';
import { RecursoItem, ProveedorCotizacion } from './CompararProveedores';
//import { useDispatch, useSelector } from 'react-redux';
import { useSelector } from 'react-redux';
//import { AppDispatch, RootState } from '../../../store/store';
import { RootState } from '../../../store///store';
import { motion, AnimatePresence } from 'framer-motion';

interface ComparacionTableProps {
    recursos: RecursoItem[];
    proveedores: ProveedorCotizacion[];
    mejorProveedor: ProveedorCotizacion;
}

const ComparacionTable: React.FC<ComparacionTableProps> = ({
    recursos,
    proveedores,
    mejorProveedor,
}) => {
    const unidades = useSelector((state: RootState) => state.unidad.unidades);
    const formatCurrency = (value: number) =>
        `S/ ${value.toFixed(2)}`;

    const headers = ['Código', 'Nombre', 'Unidad', 'Notas', 'Cant.Ppto', 'Cant.Sol', 'Precio', 'SubTotal'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto shadow-md rounded-lg mt-4"
            role="region"
            aria-label="Comparación de proveedores"
        >
            <table className="min-w-full border rounded-lg overflow-hidden text-sm text-gray-700">
                <thead className="bg-gray-50">
                    <tr className="bg-gray-100 text-xs">
                        <th className="border p-2" colSpan={headers.length}></th>
                        {proveedores.map((prov) => (
                            <th
                                key={prov.id}
                                colSpan={3}
                                className={`border p-2 ${prov.id === mejorProveedor.id ? 'bg-green-200' : 'bg-blue-100'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{prov.nombre}</span>
                                    <FiFile className="w-5 h-5" />
                                </div>
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-gray-100 text-xs">
                        {headers.map(header => (
                            <th key={header} className="border p-2 text-gray-600">
                                {header}
                            </th>
                        ))}
                        {proveedores.map(() => (
                            <>
                                <th className="border p-2">Cant</th>
                                <th className="border p-2">Precio</th>
                                <th className="border p-2">SubTotal</th>
                            </>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white text-xs">
                    <AnimatePresence>
                        {recursos.map((recurso, idx) => (
                            <motion.tr
                                key={recurso.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
                                className="hover:bg-gray-50"
                            >
                                <td className="border p-2">{recurso.recurso_id.codigo}</td>
                                <td className="border p-2">{recurso.recurso_id.nombre}</td>
                                <td className="border p-2">{unidades.find(unidad => unidad.id === recurso.recurso_id.unidad_id)?.nombre || 'N/A'}</td>
                                <td className="border p-2">{recurso.recurso_id.descripcion}</td>
                                <td className="border p-2 text-right">{recurso.recurso_id.cantidad}</td>
                                <td className="border p-2 text-right">{recurso.cantidad}</td>
                                <td className="border p-2 text-right">{formatCurrency(recurso.recurso_id.precio_actual)}</td>
                                <td className="border p-2 text-right">{formatCurrency(recurso.total)}</td>
                                {proveedores.map((prov) => {
                                    const item = prov.items[idx];
                                    const isMejorPrecio = Math.min(...proveedores.map(p => p.items[idx].precio)) === item.precio;
                                    return (
                                        <>
                                            <td className={`border p-2 text-right ${isMejorPrecio ? 'bg-green-50' : ''}`}>
                                                {item.cantidad}
                                            </td>
                                            <td className={`border p-2 text-right ${isMejorPrecio ? 'bg-green-50' : ''}`}>
                                                {formatCurrency(item.precio)}
                                            </td>
                                            <td className={`border p-2 text-right ${isMejorPrecio ? 'bg-green-50' : ''}`}>
                                                {formatCurrency(item.subTotal)}
                                            </td>
                                        </>
                                    );
                                })}
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </motion.div>
    );
};

export default ComparacionTable;