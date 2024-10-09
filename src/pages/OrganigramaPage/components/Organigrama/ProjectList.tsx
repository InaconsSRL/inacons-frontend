import React from 'react';
import { Project, Employee } from '../../types';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
    projects: Project[];
    findEmployeeById: (id: string) => Employee | undefined;
    dragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    dragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    dragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    drop: (e: React.DragEvent<HTMLDivElement>) => void;
    onUnassign: (projectId: string, positionId: string, employeeId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
    projects, 
    findEmployeeById, 
    dragStart, 
    dragEnd, 
    dragOver, 
    drop,
    onUnassign
}) => {
    return (
        <div className="flex-1 p-4 overflow-x-auto">
            <div className="flex space-x-4">
                {projects.map(project => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        findEmployeeById={findEmployeeById}
                        dragStart={dragStart}
                        dragEnd={dragEnd}
                        dragOver={dragOver}
                        drop={drop}
                        onUnassign={onUnassign}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectList;