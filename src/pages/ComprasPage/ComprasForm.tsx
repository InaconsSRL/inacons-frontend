import React from 'react';

interface Requerimiento {
    id: string;
    usuario: string;
    fecha_solicitud: string;
    estado_atencion: string;
    sustento: string;
    codigo: string;

}
interface RecursoSeleccionado {
    Recurso: Recurso;
    cantidadCompra: number;

}

interface Recurso {
    id: string;
    requerimiento_id: string;
    codigo: string;
    nombre: string;
    unidad: string;
    precio_actual: number;
    cantidad: number;
    cantidad_total?: number; // Nueva propiedad para almacenar la suma total
}

interface ModalProps {
    onClose: () => void;
    onSave: (recursos: RecursoSeleccionado[]) => void;
    requerimientos: Requerimiento[];
    recursos: Recurso[];
}

const ComprasForm: React.FC<ModalProps> = ({ onClose, onSave, requerimientos, recursos }) => {
    const [requerimientoSeleccionado, setRequerimientoSeleccionado] = React.useState<Requerimiento | null>(null);
    const [recursosSeleccionados, setRecursosSeleccionados] = React.useState<Recurso[]>([]);

    // Calcular la cantidad total por recurso
    const recursosTotalizados = React.useMemo(() => {
        const totales = new Map<string, number>();
        
        // Agrupar por código de recurso y sumar cantidades
        recursos.forEach(recurso => {
            const codigoRecurso = recurso.codigo;
            totales.set(
                codigoRecurso, 
                (totales.get(codigoRecurso) || 0) + recurso.cantidad
            );
        });
        
        // Agregar el total a cada recurso
        return recursos.map(recurso => ({
            ...recurso,
            cantidad_total: totales.get(recurso.codigo) || 0
        }));
    }, [recursos]);

    const recursosFiltrados = React.useMemo(() => {
        if (!requerimientoSeleccionado) return recursosTotalizados;
        return recursosTotalizados.filter(r => r.requerimiento_id === requerimientoSeleccionado.id);
    }, [requerimientoSeleccionado, recursosTotalizados]);

    return (
            <div className="bg-white rounded-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Selección de Recursos</h2>
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
                                onClick={() => setRequerimientoSeleccionado(req)}
                                className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${requerimientoSeleccionado?.id === req.id
                                    ? 'bg-blue-50 border-blue-500 border'
                                    : 'hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <div className="font-medium text-gray-800">{req.codigo}</div>
                                <div className="text-sm text-gray-600">{req.sustento}</div>
                                <div className="text-xs text-gray-500 mt-1">{req.fecha_solicitud}</div>
                            </div>
                        ))}
                    </div>

                    {/* Columna Derecha - Recursos */}
                    <div className="w-3/4 p-4 overflow-y-auto">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-700">
                                Recursos {requerimientoSeleccionado ? `- ${requerimientoSeleccionado.codigo}` : ''}
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

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 px-6 py-3">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setRecursosSeleccionados(recursosFiltrados);
                                                } else {
                                                    setRecursosSeleccionados([]);
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Código
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantidad Requerida
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantidad Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recursosFiltrados.map((recurso) => (
                                    <tr key={recurso.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={recursosSeleccionados.some(r => r.id === recurso.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setRecursosSeleccionados([...recursosSeleccionados, recurso]);
                                                    } else {
                                                        setRecursosSeleccionados(recursosSeleccionados.filter(r => r.id !== recurso.id));
                                                    }
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {recurso.codigo}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {recurso.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {recurso.unidad}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            S/ {recurso.precio_actual.toFixed(2)}
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
                                            {recurso.cantidad_total}
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
                            const recursosFormateados: RecursoSeleccionado[] = recursosSeleccionados.map(recurso => ({
                                Recurso: recurso,
                                cantidadCompra: 1
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
}

export default ComprasForm;