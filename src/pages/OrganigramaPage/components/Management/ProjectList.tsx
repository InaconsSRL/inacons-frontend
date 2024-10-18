/* // ProjectList.tsx
import React from 'react';
import { Project } from './types';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {projects.map((project) => (
        <li key={project.id} className="py-4 flex justify-between">
          <div>
            <p className="font-bold">{project.name}</p>
            <p className="text-sm text-gray-500">{project.start_date} - {project.end_date}</p>
          </div>
          <div>
            <button onClick={() => onEdit(project)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
            <button onClick={() => project.id && onDelete(project.id)} className="text-red-600 hover:text-red-800">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};


 */