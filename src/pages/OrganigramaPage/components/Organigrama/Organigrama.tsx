import React, { useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useOrganigramaContext } from '../../context/OrganigramaContext';
import EmployeeList from './EmployeeList';
import ProjectList from './ProjectList';

const Organigrama: React.FC = () => {
    const { notification, showNotification } = useOrganigramaContext();
    const {
        employees,
        projects,
        fetchProjects,
        fetchPeople,
        assignPersonToRole,
        unassignPersonFromRole,
    } = useApi();


    const { dragStart, dragEnd, dragOver, drop } = useDragAndDrop(
        employees,
        projects,
        assignPersonToRole,
        unassignPersonFromRole,
        (newEmployees) => {/* setEmployees function */ },
        showNotification
    );

    useEffect(() => {
        fetchProjects();
        fetchPeople();
    }, [fetchProjects, fetchPeople]);

    const findEmployeeById = useCallback((id: string) => employees.find(emp => emp.id === id), [employees]);

    const handleUnassign = useCallback(async (projectId: string, positionId: string, employeeId: string) => {
        try {
            await unassignPersonFromRole(projectId, positionId, employeeId);
            showNotification('Empleado liberado correctamente', 'success');
        } catch (error) {
            console.error('Error al liberar el empleado:', error);
            showNotification('Error al liberar el empleado', 'error');
        }
    }, [unassignPersonFromRole, showNotification]);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {notification && (
                <div className={`fixed top-0 left-0 right-0 p-4 text-white text-center ${notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                    {notification.message}
                </div>
            )}
            <div className="flex flex-1 overflow-hidden">
                <EmployeeList
                    employees={employees}
                    projects={projects}  // Añade esta línea
                    dragStart={dragStart}
                    dragEnd={dragEnd}
                    dragOver={dragOver}
                    drop={drop}
                />
                <ProjectList
                    projects={projects}
                    findEmployeeById={findEmployeeById}
                    dragStart={dragStart}
                    dragEnd={dragEnd}
                    dragOver={dragOver}
                    drop={drop}
                    onUnassign={handleUnassign}
                />
            </div>
        </div>
    );
};

export default Organigrama;