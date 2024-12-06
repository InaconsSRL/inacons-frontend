import React, { useState, useEffect } from 'react';
import dataBase from './data.json';
import { CostoUnitario, CostoUnitarioNode } from './types';
import LeftPanel from './LeftPanel';
import RightTopPanel from './RightTopPanel';
import RightBottomPanel from './RightBottomPanel';

interface DatabaseType {
  presupuesto: Array<{ nombre_presupuesto: string }>;
  costo_unitario: CostoUnitario[];
};

const Presupuestos: React.FC = () => {
  const [treeData, setTreeData] = useState<CostoUnitarioNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<CostoUnitarioNode | null>(null);
  const [composiciones, setComposiciones] = useState<any[]>([]);

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
    const costosUnitarios: CostoUnitario[] = (dataBase as DatabaseType).costo_unitario;
    const tree = buildTree(costosUnitarios);
    setTreeData(tree);
  }, []);

  const toggleNode = (nodeId: string, node: CostoUnitarioNode) => {
    setSelectedNode(node);
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

  return (
    <div className="flex h-[calc(100vh-155px]">
      <LeftPanel
        data={treeData}
        expandedNodes={expandedNodes}
        selectedNode={selectedNode}
        onNodeToggle={toggleNode}
      />
      <div className="w-2/3 flex flex-col">
        <RightTopPanel
          data={treeData}
          expandedNodes={expandedNodes}
          onNodeToggle={toggleNode}
          setComposiciones={setComposiciones}
        />
        <RightBottomPanel 
          selectedNode={selectedNode} 
          composiciones={composiciones}
        />
      </div>
    </div>
  );
};

export default Presupuestos;