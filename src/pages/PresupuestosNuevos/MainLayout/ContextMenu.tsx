import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

// Nuevas interfaces
export interface ContextMenuItem {
  icon: React.ElementType;
  label: string;
  action: () => void;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}


export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return createPortal(
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed z-50 bg-gray-800 shadow-lg rounded-lg border border-gray-700 py-1 w-56"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <motion.button
            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-700 text-gray-200"
            onClick={() => {
              item.action();
              onClose();
            }}
            whileHover={{ x: 4 }}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </motion.button>
          {item.divider && <div className="my-1 border-t border-gray-700" />}
        </React.Fragment>
      ))}
    </motion.div>,
    document.body
  );
};