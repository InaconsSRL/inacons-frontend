import { useCallback } from 'react';
import { Employee, Project } from '../types';

export const useDragAndDrop = (
    employees: Employee[],
    projects: Project[],
    assignPersonToRole: (projectId: string, roleId: string, personId: string) => Promise<void>,
    unassignPersonFromRole: (projectId: string, roleId: string, personId: string) => Promise<void>,
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
    showNotification: (message: string, type: 'error' | 'success' | 'info') => void
) => {
    const findEmployeeById = (id: string): Employee | undefined => {
        return employees.find(emp => emp.id === id);
    };

    const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
        const [type, ...rest] = e.currentTarget.id.split('-');
        const data = type === 'employee' ? e.currentTarget.id : `${type}-${rest.join('-')}`;
        e.dataTransfer.setData('text/plain', data);
        e.currentTarget.classList.add('opacity-50');
    };

    const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50');
    };

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const drop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text');
        const [sourceType, sourceId] = draggedId.split('-');
        const [targetType, projectId, positionId] = e.currentTarget.id.split('-');

        let employee: Employee | undefined;
        let sourceProjectId: string | undefined;
        let sourcePositionId: string | undefined;

        if (sourceType === 'employee') {
            employee = findEmployeeById(sourceId);
        } else if (sourceType === 'position') {
            [sourceProjectId, sourcePositionId] = sourceId.split('-');
            const sourceProject = projects.find(p => p.id === sourceProjectId);
            if (sourceProject) {
                const sourcePosition = sourceProject.positions.find(p => p.id === sourcePositionId);
                if (sourcePosition && sourcePosition.employeeId) {
                    employee = findEmployeeById(sourcePosition.employeeId);
                }
            }
        }

        if (!employee) {
            showNotification('No se pudo encontrar el empleado', 'error');
            return;
        }

        if (targetType === 'position') {
            const targetProject = projects.find(p => p.id === projectId);
            if (!targetProject) {
                showNotification('No se pudo encontrar el proyecto destino', 'error');
                return;
            }

            const targetPosition = targetProject.positions.find(p => p.id === positionId);

            if (targetPosition && !targetPosition.employeeId) {
                if (sourceType === 'position' && sourceProjectId && sourcePositionId) {
                    await unassignPersonFromRole(sourceProjectId, sourcePositionId, employee.id);
                }
                await assignPersonToRole(targetProject.id, targetPosition.id, employee.id);
                if (sourceType === 'employee') {
                    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employee!.id));
                }
                showNotification('Empleado asignado correctamente', 'success');
            } else {
                showNotification('No se puede asignar el empleado a esta posición', 'error');
            }
        } else if (targetType === 'employees') {
            if (sourceType === 'position' && sourceProjectId && sourcePositionId) {
                await unassignPersonFromRole(sourceProjectId, sourcePositionId, employee.id);
                setEmployees(prevEmployees => [...prevEmployees, employee!]);
                showNotification('Empleado devuelto a la lista de disponibles', 'success');
            }
        }
    }, [employees, projects, assignPersonToRole, unassignPersonFromRole, setEmployees, showNotification]);

    return { dragStart, dragEnd, dragOver, drop };
};