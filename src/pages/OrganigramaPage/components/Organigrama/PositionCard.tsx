import React from 'react';
import { Position, Employee } from '../../types';

interface PositionCardProps {
    position: Position;
    projectId: string;
    employee: Employee | undefined;
    dragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    dragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    dragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    drop: (e: React.DragEvent<HTMLDivElement>) => void;
    onUnassign: (projectId: string, positionId: string, employeeId: string) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({ 
    position, 
    projectId, 
    employee, 
    dragStart, 
    dragEnd, 
    dragOver, 
    drop,
    onUnassign
}) => {
    return (
        <div
            id={`position-${projectId}-${position.id}`}
            className="drop-zone bg-gray-100 p-2 mb-2 rounded min-h-[60px]"
            onDragOver={dragOver}
            onDrop={drop}
        >
            <p className="font-medium">{position.name}</p>
            {employee && (
                <div className="flex justify-between items-center">
                    <div
                        id={`position-${projectId}-${position.id}`}
                        className="draggable bg-green-200 p-1 mt-1 rounded text-sm flex-grow"
                        draggable="true"
                        onDragStart={dragStart}
                        onDragEnd={dragEnd}
                    >
                        {employee.name}
                    </div>
                    <button
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => onUnassign(projectId, position.id, employee.id)}
                    >
                        X
                    </button>
                </div>
            )}
        </div>
    );
};

export default PositionCard;