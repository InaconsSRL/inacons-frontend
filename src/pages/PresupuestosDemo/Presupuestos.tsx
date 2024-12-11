import React, { useState, useEffect } from 'react';
import { CostoUnitario, CostoUnitarioNode, Composicion } from './types';
import LeftPanel from './LeftPanel';
import RightTopPanel from './RightTopPanel';
import RightBottomPanel from './RightBottomPanel';
import { db, buscarComposicionesParaCostoUnitario } from './utils';

const Presupuestos: React.FC = () => {
  const [treeData, setTreeData] = useState<CostoUnitarioNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<CostoUnitarioNode | null>(null);
  const [composiciones, setComposiciones] = useState<Composicion[]>([]);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<string | null>(null);

  const buildTree = (items: CostoUnitario[], presupuestos: Array<{ id_presupuesto: string, nombre_presupuesto: string }>): CostoUnitarioNode[] => {
    const itemMap = new Map<string, CostoUnitarioNode>();

    // Creamos un mapa de id_presupuesto a nombre_presupuesto para búsqueda rápida
    const presupuestoMap = new Map(
      presupuestos.map(p => [p.id_presupuesto, p.nombre_presupuesto])
    );

    // Crear nodos raíz para cada presupuesto
    const presupuestoNodes: CostoUnitarioNode[] = presupuestos.map(p => ({
      id_costounitario: `presupuesto_${p.id_presupuesto}`,
      id_costopadre: null,
      id_presupuesto: p.id_presupuesto,
      numeracion_costo: '',
      descripcion_costo: p.nombre_presupuesto,
      id_unidad: '',
      cantidad: 0,
      costo_unitario: 0,
      parcial_costo: 0,
      estado_expandido: '',
      children: [],
      level: 0,
      nombre_presupuesto: p.nombre_presupuesto,
      isPresupuestoRoot: true // Nueva propiedad para identificar nodos raíz de presupuesto
    }));

    // Crear el mapa de nodos de presupuesto
    const presupuestoNodesMap = new Map(
      presupuestoNodes.map(p => [p.id_presupuesto, p])
    );

    // Convertimos todos los items a nodos
    items.forEach(item => {
      const nombrePresupuesto = presupuestoMap.get(item.id_presupuesto) || 'Sin presupuesto';
      itemMap.set(item.id_costounitario, {
        ...item,
        children: [],
        level: 1, // Empezamos en nivel 1 porque el presupuesto es nivel 0
        nombre_presupuesto: nombrePresupuesto // Añadimos el nombre del presupuesto al nodo
      });
    });

    // Construimos el árbol
    items.forEach(item => {
      const node = itemMap.get(item.id_costounitario)!;
      const presupuestoNode = presupuestoNodesMap.get(item.id_presupuesto);

      if (item.id_costopadre === null && presupuestoNode) {
        presupuestoNode.children.push(node);
      } else {
        if (item.id_costopadre !== null) {
          const parent = itemMap.get(item.id_costopadre);
          if (parent) {
            parent.children.push(node);
            node.level = parent.level + 1;
          }
        }
      }
    });

    return presupuestoNodes;
  };

  useEffect(() => {
    const { costo_unitario: costosUnitarios, presupuesto: presupuestos } = db;
    const tree = buildTree(costosUnitarios, presupuestos);
    setTreeData(tree);
  }, []);

  const toggleNode = (nodeId: string, node: CostoUnitarioNode) => {
    setSelectedNode(node);
    if (!node.isPresupuestoRoot) {
      const composiciones = buscarComposicionesParaCostoUnitario(node.id_costounitario);
      setComposiciones(composiciones);
    }
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

  const getFilteredTreeData = () => {
    if (!selectedPresupuesto) return [];
    return treeData.find(node => node.id_presupuesto === selectedPresupuesto)?.children || [];
  };

  return (
    <div className="flex h-[calc(100vh-155px)]">
      <LeftPanel
        data={treeData}
        expandedNodes={expandedNodes}
        selectedNode={selectedNode}
        onNodeToggle={toggleNode}
        setSelectedPresupuesto={setSelectedPresupuesto}
        selectedPresupuesto={selectedPresupuesto}
      />
      <div className="w-2/3 flex flex-col">
        <RightTopPanel
          data={getFilteredTreeData()}
          expandedNodes={expandedNodes}
          onNodeToggle={toggleNode}
          setComposiciones={setComposiciones}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
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