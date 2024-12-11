import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import GuiaTransfer from './GuiaTransfer';
import Recepciones from './Recepciones';

interface Transferencia {
    id: number;
    almacenSalida: string;
    estado: string;
    observaciones: string;
    tipoTransporte: string;
    obra: string;
    solicitante: string;
    receptor: string;
    fechaEmision: Date;
}

const RecepcionTransferencia = () => {
    const [showGuia, setShowGuia] = useState(false);
    const [showRecepcion, setShowRecepcion] = useState(false);
    const [selectedTransferencia, setSelectedTransferencia] = useState<Transferencia | null>(null);
    
    const transferencias: Transferencia[] = [
        {
            id: 1,
            almacenSalida: "Almacén Central",
            estado: "En camino",
            observaciones: "",
            tipoTransporte: "Terrestre",
            obra: "Obra Norte",
            solicitante: "Juan Pérez",
            receptor: "María García",
            fechaEmision: new Date()
        },
        {
            id: 2,
            almacenSalida: "Almacén Sur",
            estado: "Completado",
            observaciones: "",
            tipoTransporte: "Terrestre",
            obra: "Obra Sur",
            solicitante: "Pedro López",
            receptor: "Ana Martínez",
            fechaEmision: new Date()
        },
        {
            id: 3,
            almacenSalida: "Almacén Norte",
            estado: "Completado",
            observaciones: "",
            tipoTransporte: "Terrestre",
            obra: "Obra Este",
            solicitante: "Carlos Ruiz",
            receptor: "Laura Torres",
            fechaEmision: new Date()
        }
    ];

    const handleVerDetalles = (transferencia: Transferencia) => {
        setSelectedTransferencia(transferencia);
        setShowGuia(true);
    };

    const handleRecepcionar = (transferencia: Transferencia) => {
        setSelectedTransferencia(transferencia);
        setShowRecepcion(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-blue-900 mb-8">TRANSFERENCIAS A OTRAS OBRAS</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transferencias.map((transferencia) => (
                    <div key={transferencia.id} className="border rounded-lg overflow-hidden">
                        {/* Cabecera azul */}
                        <div className="bg-blue-900 text-white p-4">
                            <h2 className="font-medium">N° de orden de Transferencia: {transferencia.id}</h2>
                        </div>
                        
                        {/* Contenido */}
                        <div className="p-4 space-y-3">
                            <div className="border-b pb-2">
                                <p className="text-sm">Almacen de Salida:</p>
                                <p className="font-medium">{transferencia.almacenSalida}</p>
                            </div>
                            
                            <div className="border-b pb-2">
                                <p className="text-sm">Estado:</p>
                                <p className="font-medium">{transferencia.estado}</p>
                            </div>
                            
                            <div className="border-b pb-2">
                                <p className="text-sm">observaciones:</p>
                                <p className="font-medium">{transferencia.observaciones}</p>
                            </div>
                            
                            <div className="border-b pb-2">
                                <p className="text-sm">Tipo de transporte:</p>
                                <p className="font-medium">{transferencia.tipoTransporte}</p>
                            </div>
                            
                            {/* Botones */}
                            <div className="flex justify-center gap-4 pt-2">
                                {transferencia.estado === "En camino" && (
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
                            numero={selectedTransferencia.id}
                            solicita={selectedTransferencia.solicitante}
                            recibe={selectedTransferencia.receptor}
                            fEmision={selectedTransferencia.fechaEmision}
                            estado={selectedTransferencia.estado}
                            obra={selectedTransferencia.obra}
                            transferenciaId={selectedTransferencia.id.toString()}
                            onSubmit={() => {}}
                            onClose={() => setShowGuia(false)}
                        />
                    </div>
                </div>
            )}

            {/* Modal para Recepciones */}
            {showRecepcion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
                        <Recepciones onClose={() => setShowRecepcion(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecepcionTransferencia;
