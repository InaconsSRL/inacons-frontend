import React from "react";


interface TRequerimiento {
    id: string;
    usuario: string;
    fecha_solicitud: string;
    estado: string;
    codigo: string;
}

interface TRecurso {
    id: string;
    requerimiento_id: string;
    codigo: string;
    nombre: string;
    unidad: string;
    precio_actual: string;
    cantidad: number;
    cantidad_total?: number;
    metrado?: number;
    flimite?: string;
    bodega?: string;
}

interface RecursoTSeleccionado {
    Recurso: TRecurso;
    cantidadTransfers: number;
}

interface ModalProps {
    onClose: () => void;
    onSave: (recursos: RecursoTSeleccionado[]) => void;
    requerimientos: TRequerimiento[];
    recursos: TRecurso[];
}

const TransfersForms: React.FC<ModalProps> = ({ onClose, onSave, requerimientos, recursos }) => {
    const [requerimientoTSeleccionado, setRequerimientoTSeleccionado] = React.useState<TRequerimiento | null>(null);
    const [recursosSeleccionados, setRecursosSeleccionados] = React.useState<TRecurso[]>([]);

    // CANTIDAD DE RECURSOS
    const totalRecursos = React.useMemo(() => {
        const totales = new Map<string, number>();

        // Agrupar recursos y sumar cantidades
        recursos.forEach(recurso => {
            const codigoRecurso = recurso.codigo;
            totales.set(
                codigoRecurso,
                (totales.get(codigoRecurso) || 0) + recurso.cantidad
            );
        });

        // Total de cada recurso
        return recursos.map(recurso => ({
            ...recurso,
            cantidad_total: totales.get(recurso.codigo) || 0
        }));
    }, [recursos]);

    const recursosFiltrados = React.useMemo(() => {
        if (!requerimientoTSeleccionado) return totalRecursos;
        return totalRecursos.filter(r => r.requerimiento_id === requerimientoTSeleccionado.id);
    }, [requerimientoTSeleccionado, totalRecursos]);

    const handleCheckboxChange = (recurso: TRecurso, isChecked: boolean) => {
        setRecursosSeleccionados(prevState => {
            if (isChecked) {
                return [...prevState, recurso];
            } else {
                return prevState.filter(r => r.id !== recurso.id);
            }
        });
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setRecursosSeleccionados(recursosFiltrados);
        } else {
            setRecursosSeleccionados([]);
        }
    };

    return (
        <div className="bg-white rounded-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Solicitudes de Transferencias</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="flex h-[calc(90vh-12rem)]">
                {/* Columna Izquierda - Requerimientos */}
                <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
                    <h3 className="text-lg font-medium mb-4 text-gray-700">Requerimientos</h3>
                    {requerimientos.map(req => (
                        <div
                            key={req.id}
                            onClick={() => setRequerimientoTSeleccionado(req)}
                            className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${requerimientoTSeleccionado?.id === req.id
                                ? 'bg-blue-50 border-blue-500 border'
                                : 'hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <div className="font-medium text-gray-800">{req.codigo}</div>
                            <div className="text-sm text-gray-600">{req.estado}</div>
                            <div className="text-xs text-gray-500 mt-1">{req.fecha_solicitud}</div>
                        </div>
                    ))}
                </div>

                {/* Columna Derecha - Recursos */}
                <div className="w-3/4 p-4 overflow-y-auto">
                    <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">
                            Recursos {requerimientoTSeleccionado ? `- ${requerimientoTSeleccionado.codigo}` : ''}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setRecursosSeleccionados([])}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Limpiar selección
                            </button>
                        </div>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="p-2 border">Codigo</th>
                                <th className="p-2 border">Nombre</th>
                                <th className="p-2 border">Unidad</th>
                                <th className="p-2 border">Metrado</th>
                                <th className="p-2 border">F.limite</th>
                                <th className="p-2 border">Precio</th>
                                <th className="p-2 border">Cant. Trasferida</th>
                                <th className="p-2 border">Bodega</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recursosFiltrados.map((recurso) => (
                                <tr key={recurso.id} className="hover:bg-gray-50">
                                    <td className="p-2 border">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxChange(recurso, e.target.checked)}
                                            checked={recursosSeleccionados.some(r => r.id === recurso.id)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="p-2 border">{recurso.codigo}</td>
                                    <td className="p-2 border">{recurso.nombre}</td>
                                    <td className="p-2 border">{recurso.unidad}</td>
                                    <td className="p-2 border">{recurso.metrado}</td>
                                    <td className="p-2 border">{recurso.flimite}</td>
                                    <td className="p-2 border">
                                        S/ {parseFloat(recurso.precio_actual).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            {recurso.cantidad}
                                        </span>
                                        {recurso.cantidad_total && recurso.cantidad_total > recurso.cantidad && (
                                            <span className="text-sm text-gray-500 ml-2">
                                                / {recurso.cantidad_total}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {recurso.bodega}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => {
                        const recursosFormateados: RecursoTSeleccionado[] = recursosSeleccionados.map(recurso => ({
                            Recurso: recurso,
                            cantidadTransfers: 1
                        }));
                        onSave(recursosFormateados);
                        onClose();
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Guardar Selección
                </button>
            </div>
        </div>
    );
};

export default TransfersForms;
