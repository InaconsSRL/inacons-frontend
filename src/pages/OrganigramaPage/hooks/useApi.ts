import { useState, useCallback } from 'react';
import { Employee, Project } from '../types';
import * as api from '../utils/api';

export const useApi = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchProjects = useCallback(async () => {
        try {
            const data = await api.fetchProjects();
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }, []);

    const fetchPeople = useCallback(async () => {
        try {
            const data = await api.fetchPeople();
            setEmployees(data || []);
        } catch (error) {
            console.error('Error fetching people:', error);
            throw error;
        }
    }, []);

    const assignPersonToRole = useCallback(async (projectId: string, roleId: string, personId: string) => {
        try {
            await api.assignPersonToRole(projectId, roleId, personId);
            await fetchProjects();
        } catch (error) {
            console.error('Error assigning person to role:', error);
            throw error;
        }
    }, [fetchProjects]);

    const unassignPersonFromRole = useCallback(async (projectId: string, roleId: string, personId: string) => {
        try {
            await api.unassignPersonFromRole(projectId, roleId, personId);
            await fetchProjects();
        } catch (error) {
            console.error('Error unassigning person from role:', error);
            throw error;
        }
    }, [fetchProjects]);

    return {
        employees,
        projects,
        fetchProjects,
        fetchPeople,
        assignPersonToRole,
        unassignPersonFromRole,
    };
};