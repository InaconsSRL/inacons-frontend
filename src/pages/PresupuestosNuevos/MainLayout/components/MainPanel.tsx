
import React from 'react';
import { motion } from 'framer-motion';
import { ContextMenuItem } from '../ContextMenu';

interface MainPanelProps {
  renderMainContent: () => JSX.Element;
  setContextMenu: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>>;
  getContextMenuItems: (
    section: 'left' | 'rightTop' | 'rightBottom'
  ) => ContextMenuItem[];
}

const MainPanel: React.FC<MainPanelProps> = ({
  renderMainContent,
  setContextMenu,
  getContextMenuItems
}) => {
  return (
    <motion.div 
      className="flex-1 flex flex-col overflow-hidden bg-gray-800"
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          items: getContextMenuItems('left')
        });
      }}
    >
      <main className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderMainContent()}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default MainPanel;