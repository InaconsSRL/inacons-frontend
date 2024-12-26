import React from 'react';
import { FiX } from 'react-icons/fi';

interface GuiaCompraProps {
    numero: string;
    solicita: string;
    recibe: string;
    fEmision: Date;
    estado: string;
    proveedor: string;
    compraId: string;
    onSubmit: () => void;
    onClose: () => void;
}

const GuiaCompra: React.FC<GuiaCompraProps> = ({
    numero,
    solicita,
    recibe,
    fEmision,
    estado,
    proveedor,
    onSubmit,
    onClose
}) => {
    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">Guía de Compra</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <FiX className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <p className="text-sm text-gray-600">Número de Orden:</p>
                    <p className="font-medium">{numero}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Estado:</p>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                        estado === "Pendiente" 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                    }`}>
                        {estado}
                    </span>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Proveedor:</p>
                    <p className="font-medium">{proveedor}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Fecha de Emisión:</p>
                    <p className="font-medium">{fEmision.toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Solicitante:</p>
                    <p className="font-medium">{solicita}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Receptor:</p>
                    <p className="font-medium">{recibe}</p>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Recursos</h3>
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Código</th>
                            <th className="px-4 py-2 text-left">Descripción</th>
                            <th className="px-4 py-2 text-left">Cantidad</th>
                            <th className="px-4 py-2 text-left">Precio Unit.</th>
                            <th className="px-4 py-2 text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Aquí irían los recursos de la compra */}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cerrar
                </button>
                {estado === "Pendiente" && (
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Confirmar Recepción
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuiaCompra;
