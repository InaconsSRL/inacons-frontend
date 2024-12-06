import React from 'react';
import { CostoUnitarioNode } from './types';

interface RightBottomPanelProps {
    selectedNode: CostoUnitarioNode | null;
    composiciones: any[];
}

const RightBottomPanel: React.FC<RightBottomPanelProps> = ({ selectedNode, composiciones }) => {
    return (
        <div className="h-[calc(50vh-65px)] overflow-y-auto overflow-x-auto bg-white border-t border-gray-200">
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50/50 min-w-[600px]">
                <h2 className="text-[10px] font-semibold text-gray-800 uppercase tracking-wide">Detalles Adicionales</h2>
            </div>
            <div className="p-4 min-w-[600px]">
                {selectedNode ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-medium text-gray-600">Identificador</p>
                                <p className="text-[10px] font-semibold text-gray-900">{selectedNode.id_costounitario}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-medium text-gray-600">Descripción</p>
                                <p className="text-[10px] text-gray-800">{selectedNode.descripcion_costo}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-medium text-gray-600">Costo Parcial</p>
                                <p className="text-[10px] font-semibold text-gray-900">
                                    S/. {selectedNode.parcial_costo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                        
                        {composiciones.length > 0 && (
                            <div className="mt-6">
                                <div className="overflow-x-auto border border-gray-200 rounded-md">
                                    <table className="min-w-full text-[10px]">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Descripción</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Unidad</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Magnitud</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Cantidad</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Costo</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Parcial</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {composiciones.map((comp, index) => (
                                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50/50">
                                                    <td className="px-3 py-2 text-gray-800">{comp.descripcion_composicion}</td>
                                                    <td className="px-3 py-2 text-center text-gray-800">{comp.id_unidad}</td>
                                                    <td className="px-3 py-2 text-center text-gray-800">{comp.magnitud_unidadcomposicion}</td>
                                                    <td className="px-3 py-2 text-center text-gray-800">{comp.cantidad_composicion}</td>
                                                    <td className="px-3 py-2 text-center text-gray-800">
                                                        S/. {comp.costo_composicion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-medium text-gray-900">
                                                        S/. {comp.parcial_composicion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-[10px] text-gray-500">Seleccione un elemento para ver sus detalles</p>
                )}
            </div>
        </div>
    );
};

export default RightBottomPanel;