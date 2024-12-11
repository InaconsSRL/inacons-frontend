import React from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { CostoUnitarioNode, Composicion } from './types';
import { getColorClass } from '../../components/Utils/colorUtils';
import { db } from "./utils"
import { getAbreviaturaUnidad } from './utils';

export interface DataBase {
    unidad: { id_unidad: string; abreviatura_unidad: string }[];
    subtotal_costounitario: {
        id_subtotal: string;
        id_costounitario: string;
        cantidad_composicion: number;
        costo_composicion: number;
        parcial_composicion: number;
        descripcion_composicion: string;
    }[];
    composicion_costounitario: {
        id_composicion: string;
        id_subtotal: string;
        cantidad_composicion: number;
        costo_composicion: number;
        parcial_composicion: number;
        descripcion_composicion: string;
    }[];
}

interface RightTopPanelProps {
    data: CostoUnitarioNode[];
    expandedNodes: Set<string>;
    onNodeToggle: (nodeId: string, node: CostoUnitarioNode) => void;
    setComposiciones: React.Dispatch<React.SetStateAction<Composicion[]>>;
    selectedNode: CostoUnitarioNode | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<CostoUnitarioNode | null>>;
}

const RightTopPanel: React.FC<RightTopPanelProps> = ({ 
    data, 
    expandedNodes, 
    onNodeToggle, 
    selectedNode,
    setComposiciones 
}) => {

    const buscarComposicionesParaCostoUnitario = (idCostoUnitario: string) => {
        
        // Buscar subtotales relacionados con el id_costounitario
        const subtotalesRelacionados = db.subtotal_costounitario.filter(
            subtotal => subtotal.id_costounitario === idCostoUnitario
        );

        // Buscar composiciones relacionadas con los subtotales encontrados
        const composicionesRelacionadas = subtotalesRelacionados.flatMap(subtotal => {
            return db.composicion_costounitario.filter(
                composicion => composicion.id_subtotal === subtotal.id_subtotal
            );
        }) as Composicion[]; // Aseguramos que el tipo sea el correcto

        setComposiciones(composicionesRelacionadas);
    };

    const renderNode = (node: CostoUnitarioNode) => {
        const paddingLeftValue = node.level * 1;
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id_costounitario);
        const textColor = getColorClass(node.level, node.estado_expandido);

        return (
            <div key={node.id_costounitario}>
                <div
                    className={`flex items-center w-full py-0 px-2 hover:bg-gray-50/70 cursor-pointer transition-colors ${
                        selectedNode?.id_costounitario === node.id_costounitario ? 'bg-blue-50/50' : ''
                    }`}
                    style={{ paddingLeft: `${paddingLeftValue}rem` }}
                    onClick={() => {
                        if (hasChildren) {
                            onNodeToggle(node.id_costounitario, node);
                        }
                        buscarComposicionesParaCostoUnitario(node.id_costounitario);
                    }}
                >
                    <div className="flex flex-1 items-center text-sm">
                        {hasChildren ? (
                            <span className="mr-1.5 w-4 h-4 text-gray-400">
                                {isExpanded ? <FiChevronDown className="w-3 h-3" /> : <FiChevronRight className="w-3 h-3" />}
                            </span>
                        ) : (
                            <span className="mr-1.5 w-4" />
                        )}
                        <div className="flex flex-1 items-center justify-between border-b border-gray-200">
                            <div className="flex gap-3">
                                <span className={`text-[9px] font-medium ${textColor} text-center w-auto`}>{node.numeracion_costo}</span>
                                <span className={`text-[9px] ${textColor} text-center w-full`}>{node.descripcion_costo}</span>
                            </div>
                            <div className="flex gap-3 ml-auto">
                                <span className={`text-[9px] font-medium ${textColor} text-center w-6`}>
                                    {getAbreviaturaUnidad(node.id_unidad)}
                                </span>
                                <span className={`text-[9px] font-medium ${textColor} text-center w-6`}>
                                    {node.cantidad === 0 ? '' : node.cantidad}
                                </span>
                                <span className={`text-[9px] font-medium ${textColor} text-center w-16`}>
                                   {node.costo_unitario === 0 ? '' : `S/. ${node.costo_unitario.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                                </span>
                                <span className={`text-[9px] font-medium ${textColor} text-center w-20`}>
                                    S/. {node.parcial_costo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {hasChildren && isExpanded && (
                    <div className="transition-all duration-150">
                        {node.children.map(child => renderNode(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-[calc(40vh-65px)] border-b border-gray-200 overflow-y-auto overflow-x-auto bg-white">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 min-w-[600px]">
                <h2 className="text-sm font-medium text-gray-700">Detalle de Costos</h2>
            </div>
            <div className="p-2 min-w-[600px]">
                {data.map(node => renderNode(node))}
            </div>
        </div>
    );
};

export default RightTopPanel;