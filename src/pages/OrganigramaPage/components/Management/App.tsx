/* // App.tsx
import React, { useState, useEffect } from 'react';
import { Person, Project, ProjectRole } from './types';
import { api } from './api';

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPeople();
    fetchProjects();
  }, []);

  const fetchPeople = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPeople();
      setPeople(response.data);
    } catch (err) {
      setError('Error fetching people');
    }
    setIsLoading(false);
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.getProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Error fetching projects');
    }
    setIsLoading(false);
  };

  const handleCreatePerson = async (person: Person) => {
    try {
      await api.createPerson(person);
      fetchPeople();
    } catch (err) {
      setError('Error creating person');
    }
  };

  const handleUpdatePerson = async (person: Person) => {
    try {
      await api.updatePerson(person);
      fetchPeople();
    } catch (err) {
      setError('Error updating person');
    }
  };

  const handleDeletePerson = async (id: number) => {
    try {
      await api.deletePerson(id);
      fetchPeople();
    } catch (err) {
      setError('Error deleting person');
    }
  };

  const handleCreateProject = async (project: Project) => {
    try {
      await api.createProject(project);
      fetchProjects();
    } catch (err) {
      setError('Error creating project');
    }
  };

  const handleUpdateProject = async (project: Project) => {
    try {
      await api.updateProject(project);
      fetchProjects();
    } catch (err) {
      setError('Error updating project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await api.deleteProject(id);
      fetchProjects();
    } catch (err) {
      setError('Error deleting project');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Project Management</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">People</h2>
            <PersonList 
              people={people} 
              onEdit={setSelectedPerson} 
              onDelete={handleDeletePerson} 
            />
            <PersonForm 
              person={selectedPerson} 
              onSubmit={selectedPerson ? handleUpdatePerson : handleCreatePerson} 
              onCancel={() => setSelectedPerson(null)} 
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Projects</h2>
            <ProjectList 
              projects={projects} 
              onEdit={setSelectedProject} 
              onDelete={handleDeleteProject} 
            />
            <ProjectForm 
              project={selectedProject} 
              onSubmit={selectedProject ? handleUpdateProject : handleCreateProject} 
              onCancel={() => setSelectedProject(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App; */