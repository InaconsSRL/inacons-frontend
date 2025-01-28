import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  FiDatabase, 
  FiFileText, 
  FiSettings,
  FiMaximize,
  FiCopy,
  FiSave,
  FiEdit
} from 'react-icons/fi';
import { ContextMenu, ContextMenuItem } from './ContextMenu';
import DepartamentoPage from '../Departamento/DepartamentoPage';
import DistritoPage from '../Distrito/DistritoPage';
import LocalidadPage from '../Localidad/LocalidadPage';
import PresupuestosPage from '../Presupuesto/PresupuestosPage';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import RightPanels from './components/RightPanels';
import ListaPresupuestos from '../DatosGenerales/ListaProyectos';

interface MainLayoutProps {
  proyecto: {
    nombre_proyecto: string;
  };
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  proyecto,
  onLogout,
}) => {
  // Estados existentes
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('presupuestos');
  
  // Nuevos estados
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [rightPanelWidth, setRightPanelWidth] = useState(384); // 96 * 4 = 384px (w-96)
  const [rightPanelTopHeight, setRightPanelTopHeight] = useState(300);
  const [activeItem, setActiveItem] = useState('lista');

  const handleContextMenu = (e: React.MouseEvent, panelType: string) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      {
        icon: FiMaximize,
        label: 'Maximizar',
        action: () => console.log('Maximizar', panelType),
        divider: true
      },
      {
        icon: FiCopy,
        label: 'Copiar contenido',
        action: () => console.log('Copiar contenido'),
      },
      {
        icon: FiSave,
        label: 'Guardar vista',
        action: () => console.log('Guardar vista'),
      }
    ];

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items
    });
  };

  const handleSidebarResize = useCallback((movement: number) => {
    setSidebarWidth(prev => Math.min(Math.max(prev + movement, 64), 400));
  }, []);

  const handleRightPanelResize = useCallback((movement: number) => {
    setRightPanelWidth(prev => Math.min(Math.max(prev - movement, 256), 768));
  }, []);

  const handleRightPanelVerticalResize = useCallback((movement: number) => {
    setRightPanelTopHeight(prev => Math.min(Math.max(prev + movement, 200), window.innerHeight - 300));
  }, []);

  const getContextMenuItems = (
    section: 'sidebar' | 'left' | 'rightTop' | 'rightBottom'
  ): ContextMenuItem[] => {
    switch (section) {
      case 'sidebar':
        return [
          {
            icon: FiEdit,
            label: 'Renombrar Proyecto',
            action: () => console.log('Renombrar en sidebar'),
          },
          {
            icon: FiMaximize,
            label: 'Expandir Barra Lateral',
            action: () => console.log('Expandir sidebar'),
            divider: true
          },
        ];
      case 'left':
        return [
          {
            icon: FiCopy,
            label: 'Copiar Contenido',
            action: () => console.log('Copiar en panel principal'),
          },
          {
            icon: FiSave,
            label: 'Guardar Cambios',
            action: () => console.log('Guardar en panel principal'),
          },
        ];
      case 'rightTop':
        return [
          {
            icon: FiFileText,
            label: 'Exportar Vista Superior',
            action: () => console.log('Exportar vista superior'),
          },
          {
            icon: FiSettings,
            label: 'Configurar Panel Superior',
            action: () => console.log('Configurar panel superior'),
            divider: true
          },
        ];
      case 'rightBottom':
        return [
          {
            icon: FiSave,
            label: 'Respaldar Vista Inferior',
            action: () => console.log('Respaldar vista inferior'),
          },
          {
            icon: FiMaximize,
            label: 'Maximizar Panel Inferior',
            action: () => console.log('Maximizar panel inferior'),
          },
        ];
      default:
        return [];
    }
  };

  const renderMainContent = () => {
    switch (activeItem) {
      case 'lista':
        return <ListaPresupuestos />;
      case 'nuevo':
        return <DepartamentoPage />;
      case 'materiales':
        return <DistritoPage />;
      case 'mano-obra':
        return <LocalidadPage />;
      case 'equipos':
        return <PresupuestosPage />;
      default:
        return <div className="text-gray-500">Seleccione una opción del menú</div>;
    }
  };

  const renderRightTopContent = () => {
    switch (activeItem) {
      case 'lista':
        return <div>Detalles del presupuesto seleccionado</div>;
      case 'nuevo':
        return <div>Resumen del nuevo presupuesto</div>;
      // ...más casos según necesites
      default:
        return null;
    }
  };

  const renderRightBottomContent = () => {
    switch (activeItem) {
      case 'lista':
        return <div>Historial de cambios</div>;
      case 'nuevo':
        return <div>Validaciones y advertencias</div>;
      // ...más casos según necesites
      default:
        return null;
    }
  };

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const navigationItems = [
    {
      id: 'presupuestos',
      label: 'Presupuestos',
      icon: FiFileText,
      items: [
        { id: 'lista', label: 'Lista de Presupuestos', onClick: () => handleItemClick('lista') },
        { id: 'nuevo', label: 'Nuevo Presupuesto', onClick: () => handleItemClick('nuevo') },
        { id: 'materiales', label: 'Materiales', onClick: () => handleItemClick('materiales') },
        { id: 'mano-obra', label: 'Mano de Obra', onClick: () => handleItemClick('mano-obra') },
        { id: 'equipos', label: 'Equipos', onClick: () => handleItemClick('equipos') }
    ]
  },
  {
    id: 'recursos',
    label: 'Recursos',
    icon: FiDatabase,
    items: [
      { id: 'materiales-db', label: 'Base de Materiales', onClick: () => handleItemClick('materiales-db') },
      { id: 'mano-obra-db', label: 'Base de Mano de Obra', onClick: () => handleItemClick('mano-obra-db') },
      { id: 'equipos-db', label: 'Base de Equipos', onClick: () => handleItemClick('equipos-db') }
    ]
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: FiSettings,
    items: [
      { id: 'perfil', label: 'Perfil del Proyecto', onClick: () => handleItemClick('perfil') },
      { id: 'usuarios', label: 'Usuarios', onClick: () => handleItemClick('usuarios') },
      { id: 'ajustes', label: 'Ajustes', onClick: () => handleItemClick('ajustes') }
    ]
  }
];

  return (
    <div className="h-[calc(100vh-6rem)] flex overflow-hidden bg-gray-900">
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sidebarWidth={sidebarWidth}
        handleSidebarResize={handleSidebarResize}
        handleContextMenu={handleContextMenu}
        proyecto={proyecto}
        onLogout={onLogout}
        navigationItems={navigationItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <MainPanel 
        renderMainContent={renderMainContent}
        setContextMenu={setContextMenu}
        getContextMenuItems={getContextMenuItems}
      />
      <RightPanels
        rightPanelWidth={rightPanelWidth}
        rightPanelTopHeight={rightPanelTopHeight}
        handleRightPanelResize={handleRightPanelResize}
        handleRightPanelVerticalResize={handleRightPanelVerticalResize}
        renderRightTopContent={renderRightTopContent}
        renderRightBottomContent={renderRightBottomContent}
        setContextMenu={setContextMenu}
        getContextMenuItems={getContextMenuItems}
      />
      {/* Menú contextual */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={contextMenu.items}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>      
    </div>
  );
};

export default MainLayout;