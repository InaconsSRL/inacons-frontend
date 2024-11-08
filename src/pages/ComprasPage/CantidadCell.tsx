// Nuevo componente CantidadCell.tsx
import React, { useCallback } from "react";

interface CantidadCellProps {
  id: string;
  cantidad: number;
  onCantidadChange: (id: string, cantidad: number) => void;
}

const CantidadCell = React.memo(({ id, cantidad, onCantidadChange }: CantidadCellProps) => {
  console.log("CantidadCell render", id);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onCantidadChange(id, Number(e.target.value));
  }, [id, onCantidadChange]);

  return (
    <input
      type="number"
      value={cantidad}
      onChange={handleChange}
      className="w-24 px-2 py-1 border rounded-md"
      min="1"
    />
  );
});

export default CantidadCell;