import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransferencias, addTransferencia } from "../../slices/transferenciaSlice";
import { fetchTransferenciaRecursos, addTransferenciaRecurso } from "../../slices/transferenciaRecursoSlice";
import { RootState, AppDispatch } from '../../store/store';


export interface Transferencia {
    id: string;
    usuario_id: string;
    fecha: Date;
    movimiento_id: string;
  }
  
  export interface SolicitudTransferencia extends Transferencia {
    requerimiento_id: {
      codigo: string;
      fecha_solicitud: string;
      estado: string;
    };
  }
  
  export interface TransferenciaRecurso {
    id: string;
    cantidad: number;
    recurso_id: string;
    codigo: string;
    nombre: string;
    unidad: string;
    precio_actual: number;
  }
  
  export interface RecursoTransferencia {
    id: string;
    cantidad: number;
    cantidadSeleccionada?: number;
    recurso_id: {
      id: string;
      codigo: string;
      nombre: string;
      unidad: string;
      precio_actual: number;
    };
  }
  
  export interface Obra {
    id: string;
    nombre: string;
  }
  
  interface ModalProps {
    onClose: () => void;
    onSave: (recursos: RecursoTransferencia[]) => void;
}


interface ModalProps {
    onClose: () => void;
    onSave: (recursos: RecursoTransferencia[]) => void;
}

const RecursoTransfer: React.FC<ModalProps> = ({ onClose, onSave }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedSolicitud, setSelectedSolicitud] = useState<string | null>(null);
    const [selectedRecursos, setSelectedRecursos] = useState<RecursoTransferencia[]>([]);
    const [selectedObra, setSelectedObra] = useState<string>('');

    const solicitudes = useSelector((state: RootState) => state.transferencia.transferencias as SolicitudTransferencia[]);
    const recursos = useSelector((state: RootState) => state.transferenciaRecurso.transferenciaRecursos as TransferenciaRecurso[]);
    const obras = useSelector((state: RootState) => state.obra.obras as Obra[]);
    

    const filteredTransferencias = useMemo(() => {
        if (!selectedObra) return solicitudes;
        return solicitudes.filter((solicitud) =>
            solicitud.requerimiento_id.codigo === selectedObra
        );
    }, [solicitudes, selectedObra]);

    useEffect(() => {
        if (solicitudes.length === 0) {
            dispatch(fetchTransferencias());
        }
    }, [dispatch, solicitudes.length]);

    useEffect(() => {
        if (selectedSolicitud) {
            dispatch(fetchTransferenciaRecursos());
        }
    }, [selectedSolicitud, dispatch]);

    const handleCheckboxChange = useCallback((recurso: RecursoTransferencia, checked: boolean) => {
        setSelectedRecursos(prev => checked
            ? [...prev, { ...recurso, cantidadSeleccionada: recurso.cantidad }]
            : prev.filter(r => r.id !== recurso.id)
        );
    }, []);

    const handleCantidadChange = (recursoId: string, valor: number) => {
        setSelectedRecursos(prevRecursos =>
            prevRecursos.map(recurso =>
                recurso.id === recursoId
                    ? { ...recurso, cantidadSeleccionada: valor }
                    : recurso
            )
        );
    };

    const total = useMemo(() => {
        return selectedRecursos.reduce((total, recurso) =>
            total + (recurso.recurso_id.precio_actual * (recurso.cantidadSeleccionada || 0)), 0);
    }, [selectedRecursos]);

    const handleSaveSelection = async () => {
        try {
            if (!selectedSolicitud) return;
            const transferenciaData: Transferencia = {
                id: `TRA-${Date.now()}`,
                usuario_id: 'user123', // Replace with actual user ID
                fecha: new Date(),
                movimiento_id: selectedSolicitud,
            };

            const nuevaTransferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

            for (const recurso of selectedRecursos) {
                const transferenciaRecursoData = {
                    transferencia_detalle_id: `DET-${Date.now()}`,
                    recurso_id: recurso.recurso_id.id,
                    cantidad: recurso.cantidadSeleccionada || 0,
                };
                
                await dispatch(addTransferenciaRecurso(transferenciaRecursoData)).unwrap();
            }

            onSave(selectedRecursos);
            onClose();
        } catch (error) {
            console.error('Error al guardar la transferencia', error);
        }
    };

    return (
        <div className="bg-white rounded-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Solicitudes de Transferencias</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="w-56">
                <select
                    value={selectedObra}
                    onChange={(e) => setSelectedObra(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
                >
                    <option value="">Todas las obras</option>
                    {obras.map((obra) => (
                        <option key={obra.id} value={obra.id}>
                            {obra.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex h-[calc(90vh-12rem)]">
                <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
                    <h3 className="text-lg font-medium mb-4 text-gray-700">Requerimientos</h3>
                    {filteredTransferencias.map(req => (
                        <div
                            key={req.id}
                            onClick={() => setSelectedSolicitud(req.id)}
                            className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${selectedSolicitud === req.id
                                ? 'bg-blue-50 border-blue-500 border'
                                : 'hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <div className="font-medium text-gray-800">{req.requerimiento_id.codigo}</div>
                            <div className="text-sm text-gray-600">{req.requerimiento_id.estado}</div>
                            <div className="text-xs text-gray-500 mt-1">{req.requerimiento_id.fecha_solicitud}</div>
                        </div>
                    ))}
                </div>

                <div className="w-3/4 p-4 overflow-y-auto">
                    <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">
                            Recursos {selectedSolicitud ? `- ${selectedSolicitud}` : ''}
                        </h3>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Seleccionar</th>
                                <th className="p-2 border">Codigo</th>
                                <th className="p-2 border">Nombre</th>
                                <th className="p-2 border">Unidad</th>
                                <th className="p-2 border">Cantidad</th>
                                <th className="p-2 border">Precio</th>
                                <th className="p-2 border">Cantidad Transferida</th>
                                <th className="p-2 border">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recursos.map((recurso) => {
                                const recursoTransferencia: RecursoTransferencia = {
                                    id: recurso.id,
                                    cantidad: recurso.cantidad,
                                    recurso_id: {
                                        id: recurso.recurso_id,
                                        codigo: recurso.codigo,
                                        nombre: recurso.nombre,
                                        unidad: recurso.unidad,
                                        precio_actual: recurso.precio_actual
                                    }
                                };
                                const isSelected = selectedRecursos.some(r => r.id === recursoTransferencia.id);
                                const selectedRecurso = selectedRecursos.find(r => r.id === recursoTransferencia.id);
                                const subtotal = (selectedRecurso?.cantidadSeleccionada || 0) * recursoTransferencia.recurso_id.precio_actual;

                                return (
                                    <tr key={recursoTransferencia.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                                checked={isSelected}
                                                onChange={(e) => handleCheckboxChange(recursoTransferencia, e.target.checked)}
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{recursoTransferencia.recurso_id.codigo}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{recursoTransferencia.recurso_id.nombre}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{recursoTransferencia.recurso_id.unidad}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{recursoTransferencia.cantidad}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">S/ {recursoTransferencia.recurso_id.precio_actual.toFixed(2)}</td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max={recursoTransferencia.cantidad}
                                                value={selectedRecurso?.cantidadSeleccionada || 0}
                                                onChange={(e) => handleCantidadChange(recursoTransferencia.id, Math.min(parseInt(e.target.value), recursoTransferencia.cantidad))}
                                                disabled={!isSelected}
                                                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-600">
                                            S/ {subtotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-800">
                    Total: S/ {total.toFixed(2)}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveSelection}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Guardar Selección
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecursoTransfer;

