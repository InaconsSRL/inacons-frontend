import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import GuiaTransfer from './GuiaTransfer';
import Recepciones from './Recepciones';
import { fetchTransferencias } from '../../../slices/transferenciaSlice';

interface Transferencia {
    id: string;
    fecha: Date;
    movimiento_id: {
        id: string;
        nombre: string;
        descripcion: string;
        tipo: string;
    };
    movilidad_id: {
        id: string;
        denominacion: string;
        descripcion: string;
    };
    usuario_id: {
        id: string;
        nombres: string;
        apellidos: string;
    };
}

const RecepcionTransferencia = () => {
    const dispatch = useDispatch();
    const [showGuia, setShowGuia] = useState(false);
    const [showRecepcion, setShowRecepcion] = useState(false);
    const [selectedTransferencia, setSelectedTransferencia] = useState<Transferencia | null>(null);
    
    const { transferencias, loading, error } = useSelector((state: RootState) => state.transferencia);

    useEffect(() => {
        dispatch(fetchTransferencias() as any);
    }, [dispatch]);

    const handleVerDetalles = (transferencia: Transferencia) => {
        setSelectedTransferencia(transferencia);
        setShowGuia(true);
    };

    const handleRecepcionar = (transferencia: Transferencia) => {
        setSelectedTransferencia(transferencia);
        setShowRecepcion(true);
    };

    if (loading) {
        return <div className="p-6 text-center">Cargando transferencias...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-blue-900 mb-8">TRANSFERENCIAS A OTRAS OBRAS</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transferencias.map((transferencia) => (
                    <div key={transferencia.id} className="border rounded-lg overflow-hidden">
                     
                        <div className="bg-blue-900 text-white p-4">
                            <h2 className="font-medium">N° de orden de Transferencia: {transferencia.id}</h2>
                        </div>
                        
                        {/* Contenido */}
                        <div className="p-4 space-y-3">
                            <div className="border-b pb-2">
                                <p className="text-sm">Fecha:</p>
                                <p className="font-medium">{new Date(transferencia.fecha).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="border-b pb-2">
                                <p className="text-sm">Tipo de Movimiento:</p>
                                <p className="font-medium">{transferencia.movimiento_id.nombre}</p>
                            </div>
                            
                            <div className="border-b pb-2">
                                <p className="text-sm">Movilidad:</p>
                                <p className="font-medium">{transferencia.movilidad_id.denominacion}</p>
                            </div>
                            
                            <div className="border-b pb-2">
                                <p className="text-sm">Usuario:</p>
                                <p className="font-medium">{`${transferencia.usuario_id.nombres} ${transferencia.usuario_id.apellidos}`}</p>
                            </div>
                            
                            {/* Botones */}
                            <div className="flex justify-center gap-4 pt-2">
                                {transferencia.movimiento_id.tipo === "entrada" && (
                                    <button 
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={() => handleRecepcionar(transferencia)}
                                    >
                                        Recepcionar
                                    </button>
                                )}
                                <button 
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={() => handleVerDetalles(transferencia)}
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Modal para GuiaTransfer */}
            {showGuia && selectedTransferencia && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl">
                        <GuiaTransfer 
                            numero={parseInt(selectedTransferencia.id)}
                            solicita={`${selectedTransferencia.usuario_id.nombres} ${selectedTransferencia.usuario_id.apellidos}`}
                            recibe=""
                            fEmision={new Date(selectedTransferencia.fecha)}
                            estado={selectedTransferencia.movimiento_id.tipo}
                            obra=""
                            transferenciaId={selectedTransferencia.id}
                            onSubmit={() => {}}
                            onClose={() => setShowGuia(false)}
                        />
                    </div>
                </div>
            )}

            {/* Modal para Recepciones */}
            {showRecepcion && selectedTransferencia && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
                        <Recepciones 
                            onClose={() => setShowRecepcion(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecepcionTransferencia;
