
import React, { useState, useEffect } from 'react';
import dataBase from './data.json';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { CostoUnitario, CostoUnitarioNode } from './types';

interface DatabaseType {
    presupuesto: Array<{
        nombre_presupuesto: string;
    }>;
    costo_unitario: CostoUnitario[];
}

interface Props {
    presupuestoNombre: string;
}

const PresupuestosArbolito: React.FC<Props> = () => {
    const [treeData, setTreeData] = useState<CostoUnitarioNode[]>([]);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const presupuestoNombre = (dataBase as DatabaseType).presupuesto[1].nombre_presupuesto;
    const costosUnitarios: CostoUnitario[] = (dataBase as DatabaseType).costo_unitario;

    const buildTree = (items: CostoUnitario[]): CostoUnitarioNode[] => {
        const itemMap = new Map<string, CostoUnitarioNode>();

        // Primero convertimos todos los items a nodos
        items.forEach(item => {
            itemMap.set(item.id_costounitario, {
                ...item,
                children: [],
                level: 0
            });
        });

        const rootNodes: CostoUnitarioNode[] = [];

        // Construimos el árbol
        items.forEach(item => {
            const node = itemMap.get(item.id_costounitario)!;

            if (item.id_costopadre === null) {
                rootNodes.push(node);
            } else {
                const parent = itemMap.get(item.id_costopadre);
                if (parent) {
                    parent.children.push(node);
                    node.level = parent.level + 1;
                }
            }
        });

        return rootNodes;
    };

    useEffect(() => {
        const tree = buildTree(costosUnitarios);
        setTreeData(tree);
    }, [costosUnitarios]);

    const toggleNode = (nodeId: string) => {
        setExpandedNodes(prevExpanded => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(nodeId)) {
                newExpanded.delete(nodeId);
            } else {
                newExpanded.add(nodeId);
            }
            return newExpanded;
        });
    };

    const renderNode = (node: CostoUnitarioNode) => {
        const paddingLeftValue = node.level * 1.25;
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id_costounitario);

        // Función para determinar el color según el nivel
        const getColorClass = (level: number, estado: string) => {
            if (estado === 'N') return 'text-gray-900';

            switch (level) {
                case 0: return 'text-red-600'; // Padre
                case 1: return 'text-blue-600'; // Hijo
                case 2: return 'text-orange-500'; // Nieto
                case 3: return 'text-green-600'; // Bisnieto
                case 4: return 'text-purple-600'; // Tataranieto
                default: return 'text-indigo-600'; // Niveles adicionales
            }
        };

        const textColor = getColorClass(node.level, node.estado_expandido);

        return (
            <div key={node.id_costounitario}>
                <div
                    className={`flex items-center w-full p-2 hover:bg-gray-50 cursor-pointer`}
                    style={{ paddingLeft: `${paddingLeftValue}rem` }}
                    onClick={() => hasChildren && toggleNode(node.id_costounitario)}
                >
                    <div className="flex flex-1 items-center">
                        {hasChildren && (
                            <span className="mr-2 w-5 h-5">
                                {isExpanded ? (
                                    <FiChevronDown className="w-4 h-4" />
                                ) : (
                                    <FiChevronRight className="w-4 h-4" />
                                )}
                            </span>
                        )}
                        {!hasChildren && <span className="mr-2 w-5" />}
                        <div className="flex flex-1 items-center justify-between">
                            <div className="flex gap-4">
                                <span className={`font-medium ${textColor}`}>{node.numeracion_costo}</span>
                                <span className={textColor}>{node.descripcion_costo}</span>
                            </div>
                            <span className={textColor}>S/. {node.parcial_costo.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                {hasChildren && isExpanded && (
                    <div className="transition-all duration-200">
                        {node.children.map(child => renderNode(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
                <h2 className="text-xl font-semibold text-gray-800">{presupuestoNombre}</h2>
            </div>
            <div className="p-4">
                {treeData.map(node => renderNode(node))}
            </div>
        </div>
    );
};

export default PresupuestosArbolito;