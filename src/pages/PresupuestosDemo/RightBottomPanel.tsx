import React from 'react';
import { CostoUnitarioNode, Composicion, UnidadTipoCosto, TipoCosto } from './types';
import { db, getAbreviaturaUnidad } from './utils';
import { FaUser, FaBoxOpen, FaClock, FaTools, FaFileAlt, FaFolderOpen } from 'react-icons/fa';

interface RightBottomPanelProps {
    selectedNode: CostoUnitarioNode | null;
    composiciones: Composicion[];
}

const RightBottomPanel: React.FC<RightBottomPanelProps> = ({ selectedNode, composiciones }) => {

    const unidadTipoCosto = db.unidad_tipocostonew;
    const tipoCosto = db.tipo_costo;

    const getIconByTipoCosto = (id_unidad: string) => {
        // Buscar el tipo de costo asociado a la unidad
        const tiposCostoUnidad = unidadTipoCosto.filter((utc: UnidadTipoCosto) => utc.id_unidad === id_unidad);
        if (tiposCostoUnidad.length === 0) return <FaClock className="inline mr-2 text-gray-600" size={12} />;

        // Tomar el primer tipo de costo encontrado
        const tipoCostoInfo = tipoCosto.find((tc: TipoCosto) => tc.id_tipocosto === tiposCostoUnidad[0].id_tipocosto);
        
        switch (tipoCostoInfo?.descripcion_tipocosto) {
            case 'MANO DE OBRA':
                return <FaUser className="inline mr-2 text-green-600" size={12} />;
            case 'MATERIALES':
                return <FaBoxOpen className="inline mr-2 text-red-600" size={12} />;
            case 'EQUIPO':
                return <FaTools className="inline mr-2 text-blue-600" size={12} />;
            case 'SUB-CONTRATOS':
                return <FaFileAlt className="inline mr-2 text-emerald-400" size={12} />;
            case 'SUB-PARTIDAS':
                return <FaBoxOpen className="inline mr-2 text-rose-500" size={12} />;
            default:
                return <FaFolderOpen className="inline mr-2 text-gray-600" size={12} />;
        }
    };

    return (
        <div className="h-[calc(60vh-65px)] overflow-y-auto overflow-x-auto bg-white border-t border-gray-200">
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
                                        <tbody className='overflow-auto'>
                                            {composiciones.map((comp, index) => (
                                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50/50 ">
                                                    <td className="px-3 py-1 text-gray-800">
                                                        {getIconByTipoCosto(comp.id_unidad)}
                                                        {comp.descripcion_composicion}
                                                    </td>
                                                    <td className="px-3 py-1 text-center text-gray-800">{getAbreviaturaUnidad(comp.id_unidad)}</td>
                                                    <td className="px-3 py-1 text-center text-gray-800">{comp.magnitud_unidadcomposicion}</td>
                                                    <td className="px-3 py-1 text-center text-gray-800">{comp.cantidad_composicion}</td>
                                                    <td className="px-3 py-1 text-center text-gray-800">
                                                        S/. {comp.costo_composicion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-3 py-1 text-center font-medium text-gray-900">
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