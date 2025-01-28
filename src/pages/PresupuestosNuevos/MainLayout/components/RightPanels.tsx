
import React from 'react';
import { motion } from 'framer-motion';
import { DragHandle } from '../DragHandle';
import { ContextMenuItem } from '../ContextMenu';

interface RightPanelsProps {
  rightPanelWidth: number;
  rightPanelTopHeight: number;
  handleRightPanelResize: (movement: number) => void;
  handleRightPanelVerticalResize: (movement: number) => void;
  renderRightTopContent: () => JSX.Element | null;
  renderRightBottomContent: () => JSX.Element | null;
  setContextMenu: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>>;
  getContextMenuItems: (
    section: 'left' | 'rightTop' | 'rightBottom'
  ) => ContextMenuItem[];
}

const RightPanels: React.FC<RightPanelsProps> = ({
  rightPanelWidth,
  rightPanelTopHeight,
  handleRightPanelResize,
  handleRightPanelVerticalResize,
  renderRightTopContent,
  renderRightBottomContent,
  setContextMenu,
  getContextMenuItems
}) => {
  return (
    <motion.div 
      className="bg-gray-800 border-l border-gray-700 relative"
      style={{ width: rightPanelWidth }}
    >
      <motion.div
        className="overflow-y-auto border-b border-gray-700"
        style={{ height: rightPanelTopHeight }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            items: getContextMenuItems('rightTop')
          });
        }}
      >
        <div className="p-4">
          {renderRightTopContent()}
        </div>
      </motion.div>

      <div className="absolute left-0 right-0" style={{ top: rightPanelTopHeight }}>
        <DragHandle onDrag={handleRightPanelVerticalResize} isVertical />
      </div>

      <motion.div
        className="overflow-y-auto"
        style={{ height: `calc(100% - ${rightPanelTopHeight}px)` }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            items: getContextMenuItems('rightBottom')
          });
        }}
      >
        <div className="p-4">
          {renderRightBottomContent()}
        </div>
      </motion.div>

      <div className="absolute left-0 top-0 h-full">
        <DragHandle onDrag={handleRightPanelResize} />
      </div>
    </motion.div>
  );
};

export default RightPanels;