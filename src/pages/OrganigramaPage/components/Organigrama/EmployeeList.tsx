import React, { useMemo } from 'react';
import { Employee, Project } from '../../types';

interface EmployeeListProps {
    employees: Employee[];
    projects: Project[];
    dragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    dragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    dragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    drop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
    employees, 
    projects,
    dragStart, 
    dragEnd, 
    dragOver, 
    drop 
}) => {
    const availableEmployees = useMemo(() => {
        const assignedEmployeeIds = new Set();
        projects.forEach(project => {
            project.positions.forEach(position => {
                if (position.employeeId) {
                    assignedEmployeeIds.add(position.employeeId);
                }
            });
        });
        return employees.filter(employee => !assignedEmployeeIds.has(employee.id));
    }, [employees, projects]);

    return (
        <div 
            id="employees" 
            className="w-1/4 p-4 bg-white shadow-lg overflow-y-auto drop-zone" 
            onDragOver={dragOver} 
            onDrop={drop}
        >
            <h2 className="text-2xl font-bold mb-4">Empleados Disponibles</h2>
            {availableEmployees.map(employee => (
                <div
                    key={employee.id}
                    id={`employee-${employee.id}`}
                    className="draggable bg-blue-100 p-2 mb-2 rounded cursor-move"
                    draggable="true"
                    onDragStart={dragStart}
                    onDragEnd={dragEnd}
                >
                    <p className="font-semibold">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                </div>
            ))}
        </div>
    );
};

export default EmployeeList;