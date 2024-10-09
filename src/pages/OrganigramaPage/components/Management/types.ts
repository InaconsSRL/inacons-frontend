s// types.ts
export interface Person {
    id?: number;
    name: string;
    profile: string;
    position: string;
  }
  
  export interface Project {
    id?: number;
    name: string;
    start_date: string;
    end_date: string;
    roles?: ProjectRole[];
  }
  
  export interface ProjectRole {
    id?: string;
    project_id?: number;
    role_id: string;
    role: string;
    person_id: number | null;
  }
  
  // api.ts
  import axios from 'axios';
  import { Person, Project, ProjectRole } from './types';
  
  const API_URL = 'https://your-api-url.com/api.php';
  
  export const api = {
    // People
    getPeople: () => axios.get<Person[]>(`${API_URL}?table=people`),
    createPerson: (person: Person) => axios.post<{id: number}>(`${API_URL}`, { table: 'people', ...person }),
    updatePerson: (person: Person) => axios.put(`${API_URL}`, { table: 'people', ...person }),
    deletePerson: (id: number) => axios.delete(`${API_URL}?table=people&id=${id}`),
  
    // Projects
    getProjects: () => axios.get<Project[]>(`${API_URL}?table=projects`),
    createProject: (project: Project) => axios.post<{id: number}>(`${API_URL}`, { table: 'projects', ...project }),
    updateProject: (project: Project) => axios.put(`${API_URL}`, { table: 'projects', ...project }),
    deleteProject: (id: number) => axios.delete(`${API_URL}?table=projects&id=${id}`),
  
    // Project Roles
    getProjectRoles: (projectId: number) => axios.get<ProjectRole[]>(`${API_URL}?table=project_roles&project_id=${projectId}`),
    createProjectRole: (role: ProjectRole) => axios.post<{id: string}>(`${API_URL}`, { table: 'project_roles', ...role }),
    updateProjectRole: (role: ProjectRole) => axios.put(`${API_URL}`, { table: 'project_roles', ...role }),
    deleteProjectRole: (projectId: number, roleId: string) => axios.delete(`${API_URL}?table=project_roles&project_id=${projectId}&role_id=${roleId}`),
  };