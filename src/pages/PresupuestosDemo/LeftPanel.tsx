import React from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { CostoUnitarioNode } from './types';
import { getColorClass } from '../../components/Utils/colorUtils';

interface LeftPanelProps {
    data: CostoUnitarioNode[];
    expandedNodes: Set<string>;
    selectedNode: CostoUnitarioNode | null;
    onNodeToggle: (nodeId: string, node: CostoUnitarioNode) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ data, expandedNodes, selectedNode, onNodeToggle }) => {
    const renderNode = (node: CostoUnitarioNode) => {
        const paddingLeftValue = node.level * 0.5;
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id_costounitario);
        const textColor = getColorClass(node.level, node.estado_expandido);

        return (
            <div key={node.id_costounitario}>
                <div
                    className={`flex items-center w-full py-0.5 px-2 hover:bg-gray-50/70 cursor-pointer transition-colors ${
                        selectedNode?.id_costounitario === node.id_costounitario ? 'bg-blue-50/50' : ''
                    }`}
                    style={{ paddingLeft: `${paddingLeftValue}rem` }}
                    onClick={() => onNodeToggle(node.id_costounitario, node)}
                >
                    <div className="flex items-center text-xs">
                        {hasChildren && (
                            <span className="mr-1.5 text-gray-400">
                                {isExpanded ? <FiChevronDown className="w-3 h-3" /> : <FiChevronRight className="w-3 h-3" />}
                            </span>
                        )}
                        <span className={`text-[10px] ${textColor}`}>
                            {node.numeracion_costo} - {node.descripcion_costo}
                        </span>
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
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto overflow-x-auto bg-white h-[calc(100vh-130px)]">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 min-w-[300px]">
                <h2 className="text-sm font-medium text-gray-700">Estructura</h2>
            </div>
            <div className="p-2 min-w-[300px]">
                {data.map(node => renderNode(node))}
            </div>
        </div>
    );
};

export default LeftPanel;