import React, { useState, useEffect, useCallback } from 'react';

interface Employee {
    id: string;
    name: string;
    role: string;
}

interface Position {
    id: string;
    name: string;
    employeeId: string | null;
}

interface Project {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    positions: Position[];
}

interface Notification {
    message: string;
    type: 'error' | 'success' | 'info';
}

const Organigrama: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);

    const api = "https://offline.smartaccesorios.shop/.organiobra/api.php";

    const showNotification = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const fetchProjects = useCallback(async () => {
        try {
            const response = await fetch(`${api}?action=getProjects`);
            const data = await response.json();
            console.log(data);
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            showNotification('Error al cargar los proyectos', 'error');
        }
    }, [showNotification]);

    const fetchPeople = useCallback(async () => {
        try {
            const response = await fetch(`${api}?action=getPeople`);
            const data = await response.json();
            console.log(data);
            setEmployees(data || []);
        } catch (error) {
            console.error('Error fetching people:', error);
            showNotification('Error al cargar los empleados', 'error');
        }
    }, [showNotification]);

    useEffect(() => {
        fetchProjects();
        fetchPeople();
    }, [fetchProjects, fetchPeople]);

    const assignPersonToRole = async (projectId: string, roleId: string, personId: string) => {
        console.log(projectId, projectId, personId)
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'assignPersonToRole',
                    projectId,
                    roleId,
                    personId,
                }),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            showNotification('Empleado asignado correctamente', 'success');
        } catch (error) {
            console.error('Error assigning person to role:', error);
            showNotification('Error al asignar el empleado', 'error');
        }
    };

    const unassignPersonFromRole = async (projectId: string, roleId: string, personId: string) => {
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'unassignPersonFromRole',
                    projectId,
                    roleId,
                    personId,
                }),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            showNotification('Empleado desasignado correctamente', 'success');
        } catch (error) {
            console.error('Error unassigning person from role:', error);
            showNotification('Error al desasignar el empleado', 'error');
        }
    };

    const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
        const [type, ...rest] = e.currentTarget.id.split('-');
        const data = type === 'employee' ? e.currentTarget.id : `${type}-${rest.join('-')}`;
        e.dataTransfer.setData('text/plain', data);
        e.currentTarget.classList.add('opacity-50');
        console.log('Drag started:', data);
    };

    const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50');
    };

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const findEmployeeById = (id: string): Employee | undefined => {
        return employees.find(emp => emp.id === id);
    };

    const drop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text');
        const [sourceType, sourceId] = draggedId.split('-');
        const [targetType, projectId, positionId] = e.currentTarget.id.split('-');

        console.log('Drag source:', sourceType, sourceId);
        console.log('Drop target:', targetType, projectId, positionId);

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

        console.log('Employee being moved:', employee);

        if (!employee) {
            showNotification('No se pudo encontrar el empleado', 'error');
            return;
        }

        if (targetType === 'position') {

            console.log('Project ID:', projectId);
            console.log('Position ID:', positionId);


            const targetProject = projects.find(p => p.id === projectId);
            if (!targetProject) {
                showNotification('No se pudo encontrar el proyecto destino', 'error');
                return;
            }
            console.log('Target project found:', targetProject);

            const targetPosition = targetProject.positions.find(p => p.id === positionId);
            console.log('Target position found:', targetPosition);

            console.log('Target position:', targetPosition);

            if (targetPosition && !targetPosition.employeeId) {
                if (sourceType === 'position' && sourceProjectId && sourcePositionId) {
                    await unassignPersonFromRole(sourceProjectId, sourcePositionId, employee.id);
                }
                await assignPersonToRole(targetProject.id, targetPosition.id, employee.id);
                await fetchProjects(); // Recargar los proyectos para reflejar los cambios
                if (sourceType === 'employee') {
                    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employee!.id));
                }
                showNotification('Empleado asignado correctamente', 'success');
            } else {
                showNotification('No se puede asignar el empleado a esta posición', 'error');
            }
        } else if (targetType === 'employees') {
            console.log('Attempting to return employee to available list');
            if (sourceType === 'position' && sourceProjectId && sourcePositionId) {
                await unassignPersonFromRole(sourceProjectId, sourcePositionId, employee.id);
                await fetchProjects(); // Recargar los proyectos para reflejar los cambios
                setEmployees(prevEmployees => [...prevEmployees, employee!]);
                showNotification('Empleado devuelto a la lista de disponibles', 'success');
            } else {
                console.log('Employee is already in the available list');
            }
        }
    }, [employees, projects, showNotification, fetchProjects, assignPersonToRole, unassignPersonFromRole]);

    // useEffect(() => {
    //     const draggables = document.querySelectorAll('.draggable');
    //     const dropZones = document.querySelectorAll('.drop-zone');

    //     const dragStartHandler = (e: DragEvent) => dragStart(e as unknown as React.DragEvent<HTMLDivElement>);
    //     const dragEndHandler = (e: DragEvent) => dragEnd(e as unknown as React.DragEvent<HTMLDivElement>);
    //     const dragOverHandler = (e: DragEvent) => dragOver(e as unknown as React.DragEvent<HTMLDivElement>);
    //     const dropHandler = (e: DragEvent) => drop(e as unknown as React.DragEvent<HTMLDivElement>);

    //     draggables.forEach(draggable => {
    //         draggable.addEventListener('dragstart', dragStartHandler);
    //         draggable.addEventListener('dragend', dragEndHandler);
    //     });

    //     dropZones.forEach(zone => {
    //         zone.addEventListener('dragover', dragOverHandler);
    //         zone.addEventListener('drop', dropHandler);
    //     });

    //     return () => {
    //         draggables.forEach(draggable => {
    //             draggable.removeEventListener('dragstart', dragStartHandler);
    //             draggable.removeEventListener('dragend', dragEndHandler);
    //         });

    //         dropZones.forEach(zone => {
    //             zone.removeEventListener('dragover', dragOverHandler);
    //             zone.removeEventListener('drop', dropHandler);
    //         });
    //     };
    // }, [drop]);

    useEffect(() => {
        const draggables = document.querySelectorAll('.draggable');
        const dropZones = document.querySelectorAll('.drop-zone');
    
        const dragStartHandler = (e: DragEvent) => dragStart(e as unknown as React.DragEvent<HTMLDivElement>);
        const dragEndHandler = (e: DragEvent) => dragEnd(e as unknown as React.DragEvent<HTMLDivElement>);
        const dragOverHandler = (e: DragEvent) => dragOver(e as unknown as React.DragEvent<HTMLDivElement>);
        const dropHandler = (e: DragEvent) => drop(e as unknown as React.DragEvent<HTMLDivElement>);
    
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', dragStartHandler as unknown as EventListener);
            draggable.addEventListener('dragend', dragEndHandler as unknown as EventListener);
        });
    
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', dragOverHandler as unknown as EventListener);
            zone.addEventListener('drop', dropHandler as unknown as EventListener);
        });
    
        return () => {
            draggables.forEach(draggable => {
                draggable.removeEventListener('dragstart', dragStartHandler as unknown as EventListener);
                draggable.removeEventListener('dragend', dragEndHandler as unknown as EventListener);
            });
    
            dropZones.forEach(zone => {
                zone.removeEventListener('dragover', dragOverHandler as unknown as EventListener);
                zone.removeEventListener('drop', dropHandler as unknown as EventListener);
            });
        };
    }, [drop]);

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
                <div id="employees" className="w-1/4 p-4 bg-white shadow-lg overflow-y-auto drop-zone" onDragOver={dragOver} onDrop={drop}>
                    <h2 className="text-2xl font-bold mb-4">Empleados Disponibles</h2>
                    {employees.map(employee => (
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

                <div className="flex-1 p-4 overflow-x-auto">
                    <div className="flex space-x-4">
                        {projects.map(project => (
                            <div key={project.id} className="flex-none w-64 bg-white shadow-lg rounded-lg p-4">
                                <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                                {project.positions.map(position => (
                                    <div
                                        key={position.id}
                                        id={`position-${project.id}-${position.id}`}
                                        className="drop-zone bg-gray-100 p-2 mb-2 rounded min-h-[60px]"
                                        onDragOver={dragOver}
                                        onDrop={drop}
                                    >
                                        <p className="font-medium">{position.name}</p>
                                        {position.employeeId && (
                                            <div
                                                id={`position-${project.id}-${position.id}`}
                                                className="draggable bg-green-200 p-1 mt-1 rounded text-sm"
                                                draggable="true"
                                                onDragStart={dragStart}
                                                onDragEnd={dragEnd}
                                            >
                                                {findEmployeeById(position.employeeId)?.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Organigrama;