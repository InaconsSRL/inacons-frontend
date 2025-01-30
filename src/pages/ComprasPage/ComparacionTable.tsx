import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { RecursoItem, ProveedorCotizacion } from './CompararProveedores';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { addCotizacionProveedoresRecurso, fetchCotizacionesByProveedor, updateCotizacionProveedoresRecurso, deleteCotizacionProveedoresRecurso } from '../../slices/cotizacionProveedoresRecursoSlice';
import { updateCotizacionProveedor, deleteCotizacionProveedor } from '../../slices/cotizacionProveedorSlice';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Buttons/Button';
import { updateCotizacion } from '../../slices/cotizacionSlice';
import { fetchDivisas } from '../../slices/divisaSlice';

//Todo Ok

interface CotizacionRecurso {
    id: string;
    cotizacion_proveedor_id: { id: string };
    recurso_id: { id: string };
    cantidad: number;
    costo: number;
}

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
    estadoCotizacion: string;
    cotizacion_id: string;  // Añadimos esta prop
}

const ComparacionTable: React.FC<ComparacionTableProps> = ({
    recursos,
    proveedores,
    mejorProveedor,
    estadoCotizacion,
    cotizacion_id
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { divisas } = useSelector((state: RootState) => state.divisa);
    const [editingProveedor, setEditingProveedor] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState<{[key: string]: { cantidad: string; precio: string }[];}>({});
    const [notasProveedores, setNotasProveedores] = useState<{ [key: string]: string }>({});
    const [editedDivisas, setEditedDivisas] = useState<{ [key: string]: string }>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState<{
        id: string;
        nombre: string;
        action: 'buenaProAdjudicada' | 'noAdjudicada';
    } | null>(null);

    const unidades = useSelector((state: RootState) => state.unidad.unidades);
    const cotizacionesRecursos = useSelector((state: RootState) =>
        state.cotizacionProveedoresRecurso.cotizacionProveedoresRecursos
    ) || [];
    const loading = useSelector((state: RootState) =>
        state.cotizacionProveedoresRecurso.loading
    );
    const getDivisaSymbol = (proveedorId: string): string => {
        const proveedor = proveedores.find(p => p.id === proveedorId);
        return proveedor?.divisa_id?.simbolo || '';
    };

    const formatCurrency = (value: number | string | null | undefined, proveedorId?: string) => {
        if (value === null || value === undefined || isNaN(Number(value))) {
            return '--';
        }
        const symbol = proveedorId ? getDivisaSymbol(proveedorId) : '';
        return `${symbol}${Number(value).toFixed(2)}`;
    };

    useEffect(() => {
        dispatch(fetchDivisas());
    }, [dispatch]);
    
    useEffect(() => {
        // Cargar datos para cada proveedor
        proveedores.forEach(proveedor => {
            dispatch(fetchCotizacionesByProveedor(proveedor.id));
        });
    }, [dispatch, proveedores]);

    useEffect(() => {
        // Inicializar las notas con los valores existentes
        const initialNotas = proveedores.reduce((acc, prov) => ({
            ...acc,
            [prov.id]: prov.notas || ''
        }), {});
        setNotasProveedores(initialNotas);
    }, [proveedores]);

    const handleEdit = (proveedorId: string) => {
        setEditingProveedor(proveedorId);

        // Preparar los valores iniciales basados en las cotizaciones existentes
        const initialValues = recursos.map(recurso => {
            const cotizacionExistente = cotizacionesRecursos.find(
                (c: CotizacionRecurso) =>
                    c.cotizacion_proveedor_id.id === proveedorId &&
                    c.recurso_id.id === recurso.recurso_id.id
            );

            return {
                cantidad: cotizacionExistente ? String(cotizacionExistente.cantidad) : '',
                precio: cotizacionExistente ? String(cotizacionExistente.costo) : ''
            };
        });

        setEditedValues(prev => ({
            ...prev,
            [proveedorId]: initialValues
        }));

        setEditedDivisas(prev => ({
            ...prev,
            [proveedorId]: proveedores.find(p => p.id === proveedorId)?.divisa_id?.id || ''
        }));
    };

    const handleSave = async (proveedorId: string) => {
        try {
            const editedRecursos = editedValues[proveedorId] || [];
            const savePromises = editedRecursos.map(async (editedData, index) => {
                const recurso = recursos[index];
                const cantidad = parseFloat(editedData.cantidad);
                const precio = parseFloat(editedData.precio);

                // Buscar si ya existe una cotización para este recurso y proveedor
                const cotizacionExistente = cotizacionesRecursos.find(
                    (c: CotizacionRecurso) =>
                        c.cotizacion_proveedor_id.id === proveedorId &&
                        c.recurso_id.id === recurso.recurso_id.id
                );

                // Si la cantidad es 0 y existe una cotización, eliminarla
                if (cantidad === 0 && cotizacionExistente) {
                    return dispatch(deleteCotizacionProveedoresRecurso(cotizacionExistente.id)).unwrap();
                }

                // Validaciones para nuevos registros o actualizaciones
                if (isNaN(cantidad) || cantidad <= 0) return null;
                if (cantidad > recurso.cantidad) {
                    throw new Error(`La cantidad no puede exceder ${recurso.cantidad} para ${recurso.recurso_id.nombre}`);
                }
                if (isNaN(precio) || precio <= 0) return null;

                const data = {
                    cotizacion_proveedor_id: proveedorId,
                    recurso_id: recurso.recurso_id.id,
                    cantidad: cantidad,
                    costo: precio
                };

                if (cotizacionExistente) {
                    if (cotizacionExistente.cantidad !== cantidad ||
                        cotizacionExistente.costo !== precio) {
                        return dispatch(updateCotizacionProveedoresRecurso({
                            id: cotizacionExistente.id,
                            ...data
                        })).unwrap();
                    }
                    return null;
                } else {
                    return dispatch(addCotizacionProveedoresRecurso(data)).unwrap();
                }
            });

            // Añadir la actualización de notas al array de promesas
            if (notasProveedores[proveedorId] !== undefined) {
                savePromises.push(
                    dispatch(updateCotizacionProveedor({
                        id: proveedorId,
                        observaciones: notasProveedores[proveedorId],
                        estado: "proformaRecibida",
                        divisa_id: editedDivisas[proveedorId]
                    })).unwrap()
                );
            }

            // Esperar a que todas las promesas se resuelvan
            const results = await Promise.all(savePromises);
            const savedItems = results.filter(Boolean);

            if (savedItems.length > 0) {
                // Actualizar estado de la cotización si está "iniciada"
                if (estadoCotizacion === "iniciada") {
                    await dispatch(updateCotizacion({
                        id: cotizacion_id,
                        estado: "cotizada"
                    })).unwrap();
                }

                setEditingProveedor(null);
                setEditedValues(prev => {
                    const { [proveedorId]: _, ...rest } = prev;
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
            return rest;
        });
        // Restaurar las notas al valor original del proveedor
        setNotasProveedores(prev => ({
            ...prev,
            [proveedorId]: proveedores.find(p => p.id === proveedorId)?.notas || ''
        }));
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

    const handleNotasChange = (proveedorId: string, value: string) => {
        setNotasProveedores(prev => ({
            ...prev,
            [proveedorId]: value
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

    // Función para calcular totales
    const calculateTotals = () => {
        const presupuestoTotal = recursos.reduce((sum, recurso) => sum + recurso.total, 0);

        const proveedoresTotales = proveedores.reduce((acc, prov) => {
            const total = recursos.reduce((sum, recurso) => {
                const valores = getRecursoValores(prov.id, recurso.recurso_id.id);
                return sum + (valores.subTotal !== '--' ? +valores.subTotal : 0);
            }, 0);

            return { ...acc, [prov.id]: total };
        }, {} as { [key: string]: number });

        return {
            presupuestoTotal,
            proveedoresTotales
        };
    };



    const handleSelectProveedor = (proveedor: typeof selectedProveedor) => {
        setSelectedProveedor(proveedor);
        setShowConfirmModal(true);
    };

    const handleConfirmSelection = async () => {
        if (!selectedProveedor) return;

        try {
            await dispatch(updateCotizacionProveedor({
                id: selectedProveedor.id,
                estado: selectedProveedor.action
            })).unwrap();

            if (selectedProveedor.action === 'buenaProAdjudicada') {
                // Actualizar otros proveedores
                const updatePromises = proveedores
                    .filter(p => p.id !== selectedProveedor.id)
                    .map(p => dispatch(updateCotizacionProveedor({
                        id: p.id,
                        estado: 'noAdjudicada'
                    })).unwrap());

                await Promise.all(updatePromises);

                // Actualizar estado de la cotización
                await dispatch(updateCotizacion({
                    id: cotizacion_id,
                    estado: 'adjudicada',
                    fecha: new Date()
                })).unwrap();
            }

            setShowConfirmModal(false);
            setSelectedProveedor(null);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert('Error al actualizar el estado del proveedor');
        }
    };

    // Añadir esta función para verificar si el proveedor tiene recursos
    const proveedorTieneRecursos = (proveedorId: string) => {
        return cotizacionesRecursos.some(
            (c: CotizacionRecurso) => c.cotizacion_proveedor_id.id === proveedorId
        );
    };

    // Añadir función para manejar la eliminación
    const handleDeleteProveedor = async (proveedorId: string, nombre: string) => {
        if (window.confirm(`¿Está seguro que desea eliminar al proveedor ${nombre}?`)) {
            try {
                await dispatch(deleteCotizacionProveedor(proveedorId)).unwrap();
                
                // Verificar si era el último proveedor
                if (proveedores.length === 1) {
                    await dispatch(updateCotizacion({
                        id: cotizacion_id,
                        estado: "pendiente"
                    })).unwrap();
                }
            } catch (error) {
                console.error('Error al eliminar proveedor:', error);
                alert('Error al eliminar el proveedor');
            }
        }
    };

    const headers = ['Código', 'Nombre', 'Unidad', 'Notas', 'Cant.Ppto', 'Cant.Sol', 'PrecioP', 'SubTotalP'];

    // Añade esta función helper para obtener el color de fondo del proveedor
    const getProveedorBgColor = (provIndex: number) => {
        const colors = [
            'bg-blue-50/50',
            'bg-purple-50/50',
            'bg-pink-50/50',
            'bg-indigo-50/50',
            'bg-cyan-50/50'
        ];
        return colors[provIndex % colors.length];
    };

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

    const estadosProveedor = [
        "respuestaPendiente",
        "proformaRecibida",
        "enEvaluacion",
        "buenaProAdjudicada",
        "noAdjudicada",
    ];

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case estadosProveedor[0]:
                return 'bg-yellow-600';
            case estadosProveedor[1]:
                return 'bg-blue-600';
            case estadosProveedor[2]:
                return 'bg-purple-600';
            case estadosProveedor[3]:
                return 'bg-green-600';
            case estadosProveedor[4]:
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };
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
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr className="text-xs">
                        <th className="border-b border-gray-200 p-2 bg-gray-200" colSpan={4}>
                            <div className="font-bold text-xl font-poppins text-sky-800 drop-shadow-sm">Recursos Solicitados</div>
                        </th>
                        <th className="border-b border-gray-200 p-2 bg-slate-200" colSpan={4}>
                            <div className="ffont-bold text-xl font-poppins text-sky-800 drop-shadow-sm">Presupuestado</div>
                        </th>
                        {proveedores.map((prov) => (
                            <th
                                key={`provider-header-${prov.id}`}
                                colSpan={3}
                                className={`border-b border-gray-200 p-2 transition-all duration-200 
                                ${prov.id === mejorProveedor.id
                                        ? 'bg-gradient-to-r from-green-50 to-green-100 shadow-sm'
                                        : 'bg-gradient-to-r from-blue-50 to-blue-100'}`}
                            >
                                <div className="flex items-center justify-between px-2 w-full">
                                    <div className='flex flex-col gap-y-1.5 w-full'>
                                        <div className="flex flex-col items-center justify-between">
                                            <div className='mb-2'>
                                                {editingProveedor === prov.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleSave(prov.id)}
                                                            className="p-1.5 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            <FiCheck className="w-4 h-4 text-green-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(prov.id)}
                                                            className="p-1.5 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            <FiX className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-2 w-full">
                                                        <div className="flex gap-1">
                                                            {!['buenaProAdjudicada', 'noAdjudicada'].includes(prov.estado) && (
                                                                <>
                                                                    {
                                                                        estadoCotizacion !== 'enEvaluacion' &&  (<button
                                                                            onClick={() => handleEdit(prov.id)}
                                                                            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-1.5 rounded-lg text-[10px] 
                                                                    hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                        >
                                                                            Editar
                                                                        </button>)}
                                                                    {
                                                                        estadoCotizacion === 'enEvaluacion' && (<button
                                                                            onClick={() => handleSelectProveedor({
                                                                                id: prov.id,
                                                                                nombre: prov.nombre,
                                                                                action: 'buenaProAdjudicada'
                                                                            })}
                                                                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] 
                                                                        hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                        >
                                                                            Adjudicar
                                                                        </button>)
                                                                    }

                                                                    {!proveedorTieneRecursos(prov.id) && (
                                                                        <button
                                                                            onClick={() => handleDeleteProveedor(prov.id, prov.nombre)}
                                                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] 
                                                                        hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                        >
                                                                            Eliminar
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-bold text-xl font-poppins text-sky-800 drop-shadow-sm">{prov.nombre}</span>
                                            </div>
                                        </div>
                                        <div>
                                            {editingProveedor === prov.id ? (
                                                <select
                                                    value={editedDivisas[prov.id] || ''}
                                                    onChange={(e) => setEditedDivisas({ ...editedDivisas, [prov.id]: e.target.value })}
                                                    className="border rounded px-2 py-1 text-xs"
                                                >
                                                    <option value="">Seleccione divisa</option>
                                                    {divisas.map((div) => (
                                                        <option key={div.id} value={div.id}>
                                                            {div.abreviatura} - {div.simbolo}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-sm font-semibold">
                                                    {prov.divisa_id?.abreviatura} - {prov.divisa_id?.simbolo}
                                                </span>
                                            )}
                                        </div>                                        
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs ${getEstadoColor(prov.estado)} pt-2 rounded-lg px-2 py-0.5 text-white shadow-sm font-medium`}>
                                                {prov.estado}
                                            </span>
                                            <div className="grid grid-cols-1 gap-1">
                                                <div className="flex flex-col items-center gap-1 bg-stone-400 rounded-lg px-2 py-0.5 text-white shadow-sm">
                                                    {[
                                                        { label: 'Enviado', date: prov.fechaInicio },
                                                        { label: 'FinPlazo', date: prov.fechaFin },
                                                        { label: 'Entregó', date: prov.entrega }
                                                    ].map((item, index) => (
                                                        <div key={index} className='flex gap-1'>
                                                            <span className="text-xs font-medium">{item.label}:</span>
                                                            <span className="text-xs">{item.date.split('T')[0].split('-').reverse().join('-')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-50 text-xs">
                        {headers.map((header, i) => (
                            <th key={i} className="border-b border-gray-200 p-2.5 text-gray-700 font-semibold">
                                {header}
                            </th>
                        ))}
                        {proveedores.map((prov) => (
                            <React.Fragment key={`provider-columns-${prov.id}`}>
                                <th className="border-b border-gray-200 p-2.5 text-gray-700 font-semibold">Cant</th>
                                <th className="border-b border-gray-200 p-2.5 text-gray-700 font-semibold">Precio</th>
                                <th className="border-b border-gray-200 p-2.5 text-gray-700 font-semibold">SubTotal</th>
                            </React.Fragment>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white text-xs">
                    <AnimatePresence>
                        {recursos.map((recurso, idx) => (
                            <motion.tr
                                key={recurso.id}
                                initial={{ opacity: 0.5, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0.5, x: 20 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                whileHover={{ scale: 1.01, backgroundColor: '#F9F9F6' }}
                                className="hover:bg-slate-100"
                            >
                                <td className="border p-2">{recurso.recurso_id.codigo}</td>
                                <td className="border p-2">{recurso.recurso_id.nombre}</td>
                                <td className="border p-2">{unidades.find(unidad => unidad.id === recurso.recurso_id.unidad_id)?.nombre || 'N/A'}</td>
                                <td className="border p-2">{recurso.recurso_id.descripcion}</td>
                                <td className="border p-2 text-right">{recurso.recurso_id.cantidad}</td>
                                <td className="border p-2 text-right">{recurso.cantidad}</td>
                                <td className="border p-2 text-right">{formatCurrency(recurso.recurso_id.precio_actual)}</td>
                                <td className="border p-2 text-right">{formatCurrency(recurso.total)}</td>
                                {proveedores.map((prov, provIndex) => {
                                    const item = prov.items[idx];
                                    const isMejorPrecio = Math.min(...proveedores.map(p => p.items[idx].precio)) === item.precio;
                                    const isEditing = editingProveedor === prov.id;
                                    const editedData = editedValues[prov.id]?.[idx] || { cantidad: '', precio: '' };
                                    const savedValues = getRecursoValores(prov.id, recurso.recurso_id.id);
                                    const bgColor = getProveedorBgColor(provIndex);
                                    return (
                                        <React.Fragment key={`provider-${prov.id}-row-${idx}`}>
                                            <td className={`border px-2 text-right ${isMejorPrecio ? bgColor : 'bg-green-50'}`}>
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
                                            <td className={`border px-2 text-right ${isMejorPrecio ? bgColor : 'bg-green-50'}`}>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editedData.precio}
                                                        onChange={(e) => handleInputChange(prov.id, idx, 'precio', e.target.value)}
                                                        className="w-24 px-2 py-0.5 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">
                                                        {savedValues.precio !== '--' ? formatCurrency(+savedValues.precio, prov.id) : '--'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`border p-2 text-right ${isMejorPrecio ? bgColor : 'bg-green-50'}`}>
                                                <span className="text-gray-500">
                                                    {savedValues.subTotal !== '--' ? formatCurrency(+savedValues.subTotal, prov.id) : '--'}
                                                </span>
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
                <tfoot className="bg-gray-100 font-semibold text-xs">
                    <tr>
                        <td colSpan={6} className="border p-2 text-right"></td>
                        <td colSpan={1} className="border p-2 text-right">TOTAL</td>
                        <td className="border p-2 text-right">
                            {formatCurrency(calculateTotals().presupuestoTotal)}
                        </td>
                        {proveedores.map((prov) => {
                            const proveedorTotal = calculateTotals().proveedoresTotales[prov.id];
                            return (
                                <React.Fragment key={`total-section-${prov.id}`}>
                                    <td colSpan={2} className={`border p-2 text-right ${prov.id === mejorProveedor.id ? 'bg-green-200' : ''}`} >TOTAL</td>
                                    <td className={`border p-2 text-right ${prov.id === mejorProveedor.id ? 'bg-green-200' : ''}`}>
                                        {formatCurrency(proveedorTotal, prov.id)}
                                    </td>
                                </React.Fragment>
                            );
                        })}
                    </tr>
                    <tr>
                        <td colSpan={8} className="border p-2 text-right">Notas</td>
                        {proveedores.map((prov) => (
                            <td key={`notes-${prov.id}`} colSpan={3} className={`border p-2 ${prov.id === mejorProveedor.id ? 'bg-green-200' : ''}`}>
                                {editingProveedor === prov.id ? (
                                    <input
                                        type="text"
                                        value={notasProveedores[prov.id] || ''}
                                        onChange={(e) => handleNotasChange(prov.id, e.target.value)}
                                        placeholder="Añadir notas..."
                                        className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                                    />
                                ) : (
                                    <div className="text-gray-500 px-2">
                                        {notasProveedores[prov.id] || '--'}
                                    </div>
                                )}
                            </td>
                        ))}
                    </tr>
                </tfoot>
            </table>
            {showConfirmModal && selectedProveedor && (
                <Modal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title="Confirmar selección de proveedor"
                >
                    <div className="p-4">
                        <p className="mb-4">
                            ¿Está seguro que desea {selectedProveedor.action === 'buenaProAdjudicada' ? 'adjudicar' : 'descartar'} al proveedor {selectedProveedor.nombre}?
                        </p>
                        {selectedProveedor.action === 'buenaProAdjudicada' && (
                            <p className="text-sm text-gray-600 mb-4">
                                Esto marcará automáticamente a los demás proveedores como no adjudicados.
                            </p>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                text="Cancelar"
                                color="rojo"
                                onClick={() => setShowConfirmModal(false)}
                            />
                            <Button
                                text="Confirmar"
                                color="verde"
                                onClick={handleConfirmSelection}
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </motion.div>
    );
};

export default ComparacionTable;