import { useCallback, useEffect, useState } from "react";

interface DragHandleProps {
    onDrag: (movement: number) => void;
    isVertical?: boolean;
  }
  
  export const DragHandle: React.FC<DragHandleProps> = ({ onDrag, isVertical = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Solo para click izquierdo
      setIsDragging(true);
      document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
    }
  }, [isVertical]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onDrag(isVertical ? e.movementY : e.movementX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onDrag, isVertical]);

  return (
    <div
      className={`${
        isVertical 
          ? 'cursor-row-resize h-2 w-full hover:bg-blue-500/20' 
          : 'cursor-col-resize w-2 h-full hover:bg-blue-500/20'
      } bg-gray-700/50 transition-colors`}
      onMouseDown={handleMouseDown}
    />
  );
};