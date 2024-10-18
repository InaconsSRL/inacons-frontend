/* // ProjectRoles.tsx
import React, { useState, useEffect } from 'react';
import { ProjectRole, Person } from './types';
import { api } from './api';

interface ProjectRolesProps {
  projectId: number;
}

export const ProjectRoles: React.FC<ProjectRolesProps> = ({ projectId }) => {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
    fetchPeople();
  }, [projectId]);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await api.getProjectRoles(projectId);
      setRoles(response.data);
    } catch (err) {
      setError('Error fetching project roles');
    }
    setIsLoading(false);
  };

  const fetchPeople = async () => {
    try {
      const response = await api.getPeople();
      setPeople(response.data);
    } catch (err) {
      setError('Error fetching people');
    }
  };

  const handleAssignPerson = async (roleId: string, personId: number | null) => {
    try {
      await api.updateProjectRole({ project_id: projectId, role_id: roleId, person_id: personId } as ProjectRole);
      fetchRoles();
    } catch (err) {
      setError('Error assigning person to role');
    }
  };

  if (isLoading) return <div>Loading roles...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Project Roles</h3>
      <ul className="divide-y divide-gray-200">
        {roles.map((role) => (
          <li key={role.role_id} className="py-2">
            <div className="flex justify-between items-center">
              <span>{role.role}</span>
              <select
                value={role.person_id || ''}
                onChange={(e) => handleAssignPerson(role.role_id, e.target.value ? Number(e.target.value) : null)}
                className="border rounded p-1"
              >
                <option value="">Unassigned</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; */