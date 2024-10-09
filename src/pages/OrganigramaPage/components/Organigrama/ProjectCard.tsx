import React from 'react';
import { Project, Employee } from '../../types';
import PositionCard from './PositionCard';

interface ProjectCardProps {
    project: Project;
    findEmployeeById: (id: string) => Employee | undefined;
    dragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    dragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    dragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    drop: (e: React.DragEvent<HTMLDivElement>) => void;
    onUnassign: (projectId: string, positionId: string, employeeId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
    project, 
    findEmployeeById, 
    dragStart, 
    dragEnd, 
    dragOver, 
    drop,
    onUnassign
}) => {
    return (
        <div className="flex-none w-64 bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">{project.name}</h3>
            {project.positions.map(position => (
                <PositionCard
                    key={position.id}
                    position={position}
                    projectId={project.id}
                    employee={position.employeeId ? findEmployeeById(position.employeeId) : undefined}
                    dragStart={dragStart}
                    dragEnd={dragEnd}
                    dragOver={dragOver}
                    drop={drop}
                    onUnassign={onUnassign}
                />
            ))}
        </div>
    );
};

export default ProjectCard;