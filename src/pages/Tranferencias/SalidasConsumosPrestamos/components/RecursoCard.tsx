import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { RecursoCardProps } from './bodega.types';

const RecursoCard: React.FC<RecursoCardProps> = ({
    recurso,
    isSelected,
    onAdd
}) => {
    const [cantidad, setCantidad] = useState(1);

    const handleAdd = () => {
        if (cantidad > 0 && cantidad <= recurso.cantidad) {
            onAdd(recurso, cantidad);
            setCantidad(1);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 w-80"> {/* Added w-80 for fixed width */}
            <div className="flex justify-between items-start">
                <div className="overflow-hidden"> {/* Added overflow-hidden */}
                    <p className="text-sm font-semibold truncate">{recurso.recurso_id.codigo}</p>
                    <p className="text-xs text-gray-600 ">{recurso.recurso_id.nombre}</p>
                    <p className="text-xs text-gray-500 truncate">Bodega: {recurso.obra_bodega_id.nombre}</p>
                    <p className="text-xs text-gray-500">Disponible: {recurso.cantidad}</p>
                </div>
                {!isSelected && (
                    <div className="flex items-center gap-2 ml-2"> {/* Added ml-2 for spacing */}
                        <input
                            type="number"
                            min="1"
                            max={recurso.cantidad}
                            value={cantidad}
                            onChange={(e) => setCantidad(Number(e.target.value))}
                            className="w-16 p-1 text-sm border rounded"
                        />
                        <button
                            onClick={handleAdd}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            disabled={isSelected}
                        >
                            <FiPlusCircle size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecursoCard;
