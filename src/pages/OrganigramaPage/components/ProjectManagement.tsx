import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Definición de interfaces
interface Person {
  id?: number;
  dni: string;
  nombres: string;
  apellidos: string;
  correo: string;
  perfil: string;
  posicion: string;
  sexo: 'M' | 'F';
  telefonoMovil: string;
  telefonoTrabajo: string;
  departamento: string;
  habilidades: string;
}

interface Project {
  id?: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  direccion: string;
  cliente: string;
  estatus: 'Activo' | 'Completado' | 'EnEspera';
  prioridad: 'alta' | 'media' | 'baja';
}

interface Role {
  id?: number;
  nombre: string;
  descripcion: string;
  carrerasAfines: string;
}

interface ProjectRole {
  id?: string;
  project_id: number;
  role_id: number;
  person_id: number | null;
}

// Componente principal
const ProjectManagement: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const peopleResponse = await axios.get('https://offline.smartaccesorios.shop/.organiobra/newAPI.php?action=getPeople');
      setPeople(peopleResponse.data);

      const projectsResponse = await axios.get('https://offline.smartaccesorios.shop/.organiobra/newAPI.php?action=getProjects');
      setProjects(projectsResponse.data);

      const rolesResponse = await axios.get('https://offline.smartaccesorios.shop/.organiobra/newAPI.php?action=getRoles');
      setRoles(rolesResponse.data);

      const projectRolesResponse = await axios.get('https://offline.smartaccesorios.shop/.organiobra/newAPI.php?action=getProjectRoles');
      setProjectRoles(projectRolesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Funciones CRUD para Person
  const addPerson = async (person: Person) => {
    try {
      const response = await axios.post('https://offline.smartaccesorios.shop/.organiobra/newAPI.php', { action: 'addPerson', ...person });
      setPeople([...people, response.data]);
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const updatePerson = async (person: Person) => {
    try {
      await axios.put('https://offline.smartaccesorios.shop/.organiobra/newAPI.php', { action: 'updatePerson', ...person });
      setPeople(people.map(p => p.id === person.id ? person : p));
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  const deletePerson = async (id: number) => {
    try {
      await axios.delete(`https://offline.smartaccesorios.shop/.organiobra/newAPI.php?action=deletePerson&id=${id}`);
      setPeople(people.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  // Funciones CRUD para Project
  const addProject = async (project: Project) => {
    try {
      const response = await axios.post('https://offline.smartaccesorios.shop/.organiobra/newAPI.php', { action: 'addProject', ...project });
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (project: Project) => {
    try {
      await axios.put('https://offline.smartaccesorios.shop/.organiobra/newAPI.php', { action: 'updateProject', ...project });
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await axios.delete(`https://offline.smartaccesorios.shop/.organiobra/newAPI.php?action=deleteProject&id=${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Funciones CRUD para Role
  const addRole = async (role: Role) => {
    try {
      const response = await axios.post('https://offline.smartaccesorios.shop/.organiobra/newAPI.php', { action: 'addRole', ...role });
      setRoles([...roles, response.data]);
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const updateRole = async (role: Role) => {
    try {
      await axios.put('https://offline.smartaccesorios.shop/.organiobra/newAPI.php', { action: 'updateRole', ...role });
      setRoles(roles.map(r => r.id === role.id ? role : r));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const deleteRole = async (id: number) => {
    try {
      await axios.delete(`https://offline.smartaccesorios.shop/.organiobra/newAPI.php?action=deleteRole&id=${id}`);
      setRoles(roles.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  // Función para inicializar ProjectRole
  const initializeProjectRole = async (projectId: number, roleId: number) => {
    try {
      const response = await axios.post('https://offline.smartaccesorios.shop/.organiobra/newAPI.php', {
        action: 'addProjectRole',
        project_id: projectId,
        role_id: roleId,
        person_id: null
      });
      setProjectRoles([...projectRoles, response.data]);
    } catch (error) {
      console.error('Error initializing project role:', error);
    }
  };

  // Renderizado del componente
  return (
    <div>
      <h1>Project Management</h1>
      
      {/* Sección de Personas */}
      <section>
        <h2>People</h2>
        <ul>
          {people.map(person => (
            <li key={person.id}>
              {person.nombres} {person.apellidos}
              <button onClick={() => setSelectedPerson(person)}>Edit</button>
              <button onClick={() => person.id && deletePerson(person.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={() => setSelectedPerson({ dni: '', nombres: '', apellidos: '', correo: '', perfil: '', posicion: '', sexo: 'M', telefonoMovil: '', telefonoTrabajo: '', departamento: '', habilidades: '' })}>Add Person</button>
      </section>

      {/* Sección de Proyectos */}
      <section>
        <h2>Projects</h2>
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              {project.nombre}
              <button onClick={() => setSelectedProject(project)}>Edit</button>
              <button onClick={() => project.id && deleteProject(project.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={() => setSelectedProject({ nombre: '', fechaInicio: '', fechaFin: '', direccion: '', cliente: '', estatus: 'Activo', prioridad: 'media' })}>Add Project</button>
      </section>

      {/* Sección de Roles */}
      <section>
        <h2>Roles</h2>
        <ul>
          {roles.map(role => (
            <li key={role.id}>
              {role.nombre}
              <button onClick={() => setSelectedRole(role)}>Edit</button>
              <button onClick={() => role.id && deleteRole(role.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={() => setSelectedRole({ nombre: '', descripcion: '', carrerasAfines: '' })}>Add Role</button>
      </section>

      {/* Formularios para editar/añadir (pueden ser componentes separados) */}
      {selectedPerson && (
        <PersonForm
          person={selectedPerson}
          onSubmit={(person) => {
            person.id ? updatePerson(person) : addPerson(person);
            setSelectedPerson(null);
          }}
          onCancel={() => setSelectedPerson(null)}
        />
      )}

      {selectedProject && (
        <ProjectForm
          project={selectedProject}
          onSubmit={(project) => {
            project.id ? updateProject(project) : addProject(project);
            setSelectedProject(null);
          }}
          onCancel={() => setSelectedProject(null)}
        />
      )}

      {selectedRole && (
        <RoleForm
          role={selectedRole}
          onSubmit={(role) => {
            role.id ? updateRole(role) : addRole(role);
            setSelectedRole(null);
          }}
          onCancel={() => setSelectedRole(null)}
        />
      )}

      {/* Sección para inicializar ProjectRole */}
      <section>
        <h2>Initialize Project Role</h2>
        <select onChange={(e) => setSelectedProject(projects.find(p => p.id === parseInt(e.target.value)) || null)}>
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.nombre}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedRole(roles.find(r => r.id === parseInt(e.target.value)) || null)}>
          <option value="">Select a role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.nombre}</option>
          ))}
        </select>
        <button onClick={() => selectedProject && selectedRole && initializeProjectRole(selectedProject.id!, selectedRole.id!)}>
          Initialize Project Role
        </button>
      </section>
    </div>
  );
};

// Componentes de formulario (estos pueden ser definidos en archivos separados)
const PersonForm: React.FC<{ person: Person, onSubmit: (person: Person) => void, onCancel: () => void }> = ({ person, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(person);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <input name="dni" value={formData.dni} onChange={handleChange} placeholder="DNI" required />
      <input name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Nombres" required />
      <input name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Apellidos" required />
      <input name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo" required type="email" />
      <input name="perfil" value={formData.perfil} onChange={handleChange} placeholder="Perfil" />
      <input name="posicion" value={formData.posicion} onChange={handleChange} placeholder="Posición" required />
      <select name="sexo" value={formData.sexo} onChange={handleChange as any} required>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>
      <input name="telefonoMovil" value={formData.telefonoMovil} onChange={handleChange} placeholder="Teléfono Móvil" />
      <input name="telefonoTrabajo" value={formData.telefonoTrabajo} onChange={handleChange} placeholder="Teléfono Trabajo" />
      <input name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Departamento" />
      <input name="habilidades" value={formData.habilidades} onChange={handleChange} placeholder="Habilidades" />
      <button type="submit">{person.id ? 'Update' : 'Add'} Person</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

const ProjectForm: React.FC<{ project: Project, onSubmit: (project: Project) => void, onCancel: () => void }> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(project);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} placeholder="Fecha Inicio" required type="date" />
      <input name="fechaFin" value={formData.fechaFin} onChange={handleChange} placeholder="Fecha Fin" required type="date" />
      <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" />
      <input name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Cliente" />
      <select name="estatus" value={formData.estatus} onChange={handleChange} required>
        <option value="Activo">Activo</option>
        <option value="Completado">Completado</option>
        <option value="EnEspera">En Espera</option>
      </select>
      <select name="prioridad" value={formData.prioridad} onChange={handleChange} required>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
      <button type="submit">{project.id ? 'Update' : 'Add'} Project</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

const RoleForm: React.FC<{ role: Role, onSubmit: (role: Role) => void, onCancel: () => void }> = ({ role, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(role);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" />
        <textarea name="carrerasAfines" value={formData.carrerasAfines} onChange={handleChange} placeholder="Carreras Afines" />
        <button type="submit">{role.id ? 'Update' : 'Add'} Role</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    );
  };

  export default ProjectManagement