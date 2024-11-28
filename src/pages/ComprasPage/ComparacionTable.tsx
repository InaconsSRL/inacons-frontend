import React, { useState, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { RecursoItem, ProveedorCotizacion } from './CompararProveedores';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { addCotizacionProveedoresRecurso, fetchCotizacionesByProveedor } from '../../slices/cotizacionProveedoresRecursoSlice';

const TableSkeleton: React.FC<{ proveedoresCount: number }> = ({ proveedoresCount }) => {
    return (
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-16 bg-gray-200 rounded-t-lg mb-1" />
            <div className="h-12 bg-gray-200 mb-1" />

            {/* Rows Skeleton */}
            {[...Array(5)].map((_, idx) => (
                <div
                    key={idx}
                    className="flex items-center space-x-1 mb-1"
                >
                    {/* Columnas básicas */}
                    {[...Array(8)].map((_, colIdx) => (
                        <div
                            key={`basic-${colIdx}`}
                            className="h-10 bg-gray-100 flex-1"
                        />
                    ))}

                    {/* Columnas de proveedores */}
                    {[...Array(proveedoresCount)].map((_, provIdx) => (
                        <React.Fragment key={`prov-${provIdx}`}>
                            <div className="h-10 bg-gray-100 w-24" />
                            <div className="h-10 bg-gray-100 w-24" />
                            <div className="h-10 bg-gray-100 w-24" />
                        </React.Fragment>
                    ))}
                </div>
            ))}
        </div>
    );
};

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
    const dispatch = useDispatch<AppDispatch>();
    const [editingProveedor, setEditingProveedor] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState<{
        [key: string]: { cantidad: string; precio: string }[];
    }>({});

    const unidades = useSelector((state: RootState) => state.unidad.unidades);
    const cotizacionesRecursos = useSelector((state: RootState) =>
        state.cotizacionProveedoresRecurso.cotizacionProveedoresRecursos
    ) || [];
    const loading = useSelector((state: RootState) =>
        state.cotizacionProveedoresRecurso.loading
    );
    const formatCurrency = (value: number) =>
        `S/ ${value.toFixed(2)}`;

    useEffect(() => {
        // Cargar datos para cada proveedor
        proveedores.forEach(proveedor => {
            dispatch(fetchCotizacionesByProveedor(proveedor.id));
        });
    }, [dispatch, proveedores]);

    const handleEdit = (proveedorId: string) => {
        setEditingProveedor(proveedorId);
        setEditedValues(prev => ({
            ...prev,
            [proveedorId]: recursos.map(() => ({ cantidad: '', precio: '' }))
        }));
    };

    const handleSave = async (proveedorId: string) => {
        try {
            const editedRecursos = editedValues[proveedorId] || [];
            const savePromises = editedRecursos.map(async (editedData, index) => {
                const recurso = recursos[index];
                const cantidad = parseFloat(editedData.cantidad);
                const precio = parseFloat(editedData.precio);

                // Validaciones
                if (isNaN(cantidad) || cantidad <= 0) return null;
                if (cantidad > recurso.cantidad) {
                    throw new Error(`La cantidad no puede exceder ${recurso.cantidad} para ${recurso.recurso_id.nombre}`);
                }
                if (isNaN(precio) || precio <= 0) return null;

                // Preparar datos para guardar
                const data = {
                    cotizacion_proveedor_id: proveedorId,
                    recurso_id: recurso.recurso_id.id,
                    cantidad: cantidad,
                    costo: precio
                };

                // Guardar
                return dispatch(addCotizacionProveedoresRecurso(data)).unwrap();
            });

            // Esperar a que todas las promesas se resuelvan
            const results = await Promise.all(savePromises);
            const savedItems = results.filter(Boolean);

            if (savedItems.length > 0) {
                // Limpiar el estado de edición
                setEditingProveedor(null);
                setEditedValues(prev => {
                    const { [proveedorId]: _, ...rest } = prev;
                    console.log(_);
                    return rest;
                });
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(error || 'Error al guardar los cambios');
        }
    };

    const handleCancel = (proveedorId: string) => {
        setEditingProveedor(null);
        setEditedValues(prev => {
            const { [proveedorId]: _, ...rest } = prev;
            console.log(_);
            return rest;
        });
    };

    const handleInputChange = (
        proveedorId: string,
        recursoIndex: number,
        field: 'cantidad' | 'precio',
        value: string
    ) => {
        setEditedValues(prev => ({
            ...prev,
            [proveedorId]: prev[proveedorId].map((item, idx) =>
                idx === recursoIndex ? { ...item, [field]: value } : item
            )
        }));
    };

    const getRecursoValores = (proveedorId: string, recursoId: string) => {
        const cotizacion = cotizacionesRecursos.find((c: { cotizacion_proveedor_id: { id: string }; recurso_id: { id: string } }) =>
            c.cotizacion_proveedor_id.id === proveedorId &&
            c.recurso_id.id === recursoId
        );
        return {
            cantidad: cotizacion?.cantidad || '--',
            precio: cotizacion?.costo || '--',
            subTotal: cotizacion ? (cotizacion.cantidad * cotizacion.costo) : '--'
        };
    };

    const headers = ['Código', 'Nombre', 'Unidad', 'Notas', 'Cant.Ppto', 'Cant.Sol', 'PrecioP', 'SubTotalP'];

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto shadow-md rounded-lg mt-4"
            >
                <TableSkeleton proveedoresCount={proveedores.length} />
            </motion.div>
        );
    }

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
                        <th className="border p-2" colSpan={4}>Recursos Solicitados</th>
                        <th className="border p-2" colSpan={4}>Presupuestado</th>
                        {proveedores.map((prov, i) => (
                            <th
                                key={i}
                                colSpan={3}
                                className={`border p-2 ${prov.id === mejorProveedor.id ? 'bg-green-200' : 'bg-blue-100'}`}
                            >
                                <div className="flex items-center justify-between px-2">
                                    <span className="font-medium">{prov.nombre}</span>
                                    {editingProveedor === prov.id ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleSave(prov.id)}
                                                className="p-1 hover:bg-green-100 rounded-full transition-colors"
                                            >
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                            </button>
                                            <button
                                                onClick={() => handleCancel(prov.id)}
                                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                            >
                                                <FiX className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(prov.id)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4 text-gray-600" />
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-gray-100 text-xs">
                        {headers.map((header, i) => (
                            <th key={i} className="border p-2 text-gray-600">
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
                                    const isEditing = editingProveedor === prov.id;
                                    const editedData = editedValues[prov.id]?.[idx] || { cantidad: '', precio: '' };
                                    const savedValues = getRecursoValores(prov.id, recurso.recurso_id.id);
                                    return (
                                        <React.Fragment key={`provider-${prov.id}-row-${idx}`}>
                                            <td className={`border px-2 text-right ${isMejorPrecio ? 'bg-green-50' : ''}`}>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editedData.cantidad}
                                                        onChange={(e) => handleInputChange(prov.id, idx, 'cantidad', e.target.value)}
                                                        className="w-20 px-2 py-0.5 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">{savedValues.cantidad}</span>
                                                )}
                                            </td>
                                            <td className={`border px-2 text-right ${isMejorPrecio ? 'bg-green-50' : ''}`}>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editedData.precio}
                                                        onChange={(e) => handleInputChange(prov.id, idx, 'precio', e.target.value)}
                                                        className="w-24 px-2 py-0.5 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">
                                                        {savedValues.precio !== '--' ? formatCurrency(+savedValues.precio) : '--'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`border p-2 text-right ${isMejorPrecio ? 'bg-green-50' : ''}`}>
                                                <span className="text-gray-500">
                                                    {savedValues.subTotal !== '--' ? formatCurrency(+savedValues.subTotal) : '--'}
                                                </span>
                                            </td>
                                        </React.Fragment>
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