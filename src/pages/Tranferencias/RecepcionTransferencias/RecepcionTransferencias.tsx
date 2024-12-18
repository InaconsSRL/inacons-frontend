import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransferencias, addTransferencia } from '../../../slices/transferenciaSlice';
import { fetchTransferenciaRecursosById } from '../../../slices/transferenciaRecursoSlice';
import ValidationErrors from '../RecepcionCompras/components/ValidationErrors';
import { RootState, AppDispatch } from '../../../store/store';

interface Transferencia {
    id: number;
    usuario_id: {
        id: number;
        nombres: string;
        apellidos: string;
    };
    fecha: string;
    movimiento_id: {
        id: number;
    };
    movilidad_id: {
        id: number;
    };
    estado: string;
}

const RecepcionTransferencia: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [selectedTransferencia, setSelectedTransferencia] = useState<Transferencia | null>(null);
    const [cantidadRecibida, setCantidadRecibida] = useState(0);
    const { transferencias, loading, error } = useSelector((state: RootState) => state.transferencia);
    const { recursos } = useSelector((state: RootState) => state.transferenciaRecurso);

    useEffect(() => {
        dispatch(fetchTransferencias());
    }, [dispatch]);

    useEffect(() => {
        if (selectedTransferencia) {
            dispatch(fetchTransferenciaRecursosById(selectedTransferencia.id)); // Cargar recursos de la transferencia seleccionada
        }
    }, [selectedTransferencia, dispatch]);

    const handleConfirmarRecepcion = () => {
        if (cantidadRecibida <= 0) {
            return;
        }
        const transferenciaData = {
            usuario_id: selectedTransferencia?.usuario_id.id,
            fecha: new Date(),
            movimiento_id: selectedTransferencia?.movimiento_id.id,
            movilidad_id: selectedTransferencia?.movilidad_id.id,
            estado: selectedTransferencia?.estado,
        };
        dispatch(addTransferencia(transferenciaData));
        setShowConfirmDialog(false);
        setSelectedTransferencia(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full">Cargando...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-full h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-white">
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-blue-800">Recepción de Transferencias</h2>
                    <button onClick={() => setShowConfirmDialog(false)} className="text-2xl text-red-500 hover:text-red-600">
                        <FiX />
                    </button>
                </div>
            </div>
            {validationErrors.length > 0 && <ValidationErrors errors={validationErrors} />}
            <div className="flex flex-1 min-h-0">
                <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
                    <div className="p-4 bg-white border-b">
                        <h3 className="text-sm font-medium text-gray-700">Transferencias Pendientes</h3>
                    </div>
                    <div className="bg-gray-50 p-4 space-y-3">
                        {transferencias.map((transferencia) => (
                            <div key={transferencia.id} onClick={() => setSelectedTransferencia(transferencia)} className="bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md">
                                <div className="p-3">
                                    <div className="text-sm font-medium text-gray-900">N° Transferencia: {transferencia.id}</div>
                                    <div className="text-xs text-gray-500 mt-1">Fecha: {new Date(transferencia.fecha).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 bg-white overflow-y-auto">
                    {selectedTransferencia && (
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">Detalles de Transferencia</h3>
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Usuario: {selectedTransferencia.usuario_id.nombres} {selectedTransferencia.usuario_id.apellidos}</p>
                                <p>Fecha: {new Date(selectedTransferencia.fecha).toLocaleDateString()}</p>
                            </div>
                            <h4 className="mt-4 text-md font-semibold text-gray-700">Recursos:</h4>
                            <ul className="list-disc pl-5">
                                {recursos.map((recurso) => (
                                    <li key={recurso.id} className="text-sm text-gray-600">{recurso.nombre}</li>
                                ))}
                            </ul>
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button onClick={() => setShowConfirmDialog(true)} className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Confirmar Recepción</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecepcionTransferencia;
