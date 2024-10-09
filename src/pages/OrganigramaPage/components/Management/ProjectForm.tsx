// ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import { Project, ProjectRole } from './types';

interface ProjectFormProps {
  project: Project | null;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Project>({ name: '', start_date: '', end_date: '', roles: [] });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({ name: '', start_date: '', end_date: '', roles: [] });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (index: number, field: keyof ProjectRole, value: string) => {
    const updatedRoles = [...(formData.roles || [])];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    setFormData({ ...formData, roles: updatedRoles });
  };

  const addRole = () => {
    setFormData({ ...formData, roles: [...(formData.roles || []), { role_id: '', role: '', person_id: null }] });
  };

  const removeRole = (index: number) => {
    const updatedRoles = [...(formData.roles || [])];
    updatedRoles.splice(index, 1);
    setFormData({ ...formData, roles: updatedRoles });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', start_date: '', end_date: '', roles: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Project Name"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <h3 className="font-bold mt-4 mb-2">Roles</h3>
      {formData.roles?.map((role, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            value={role.role_id}
            onChange={(e) => handleRoleChange(index, 'role_id', e.target.value)}
            placeholder="Role ID"
            className="w-1/4 p-2 mr-2 border rounded"
            required
          />
          <input
            type="text"
            value={role.role}
            onChange={(e) => handleRoleChange(index, 'role', e.target.value)}
            placeholder="Role Name"
            className="w-1/2 p-2 mr-2 border rounded"
            required
          />
          <button type="button" onClick={() => removeRole(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addRole} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
        Add Role
      </button>
      <div className="flex justify-end">
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {project ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

