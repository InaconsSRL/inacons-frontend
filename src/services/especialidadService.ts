import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ESPECIALIDADES_QUERY = gql`
  query ListEspecialidades {
    listEspecialidades {
      id_especialidad
      nombre
      descripcion
    }
  }
`;

const GET_ESPECIALIDAD_QUERY = gql`
  query GetEspecialidad($idEspecialidad: String!) {
    getEspecialidad(id_especialidad: $idEspecialidad) {
      id_especialidad
      nombre
      descripcion
    }
  }
`;

const ADD_ESPECIALIDAD_MUTATION = gql`
  mutation AddEspecialidad($nombre: String!, $descripcion: String!) {
    addEspecialidad(nombre: $nombre, descripcion: $descripcion) {
      id_especialidad
      nombre
      descripcion
    }
  }
`;

const UPDATE_ESPECIALIDAD_MUTATION = gql`
  mutation UpdateEspecialidad($idEspecialidad: String!, $nombre: String, $descripcion: String) {
    updateEspecialidad(id_especialidad: $idEspecialidad, nombre: $nombre, descripcion: $descripcion) {
      id_especialidad
      nombre
      descripcion
    }
  }
`;

const DELETE_ESPECIALIDAD_MUTATION = gql`
  mutation DeleteEspecialidad($idEspecialidad: String!) {
    deleteEspecialidad(id_especialidad: $idEspecialidad) {
      id_especialidad
    }
  }
`;

export const listEspecialidadesService = async () => {
  try {
    const response = await client.query({
      query: LIST_ESPECIALIDADES_QUERY,
    });
    return response.data.listEspecialidades;
  } catch (error) {
    throw new Error(`Error fetching especialidades: ${error}`);
  }
};

export const getEspecialidadService = async (idEspecialidad: string) => {
  try {
    const response = await client.query({
      query: GET_ESPECIALIDAD_QUERY,
      variables: { idEspecialidad },
    });
    return response.data.getEspecialidad;
  } catch (error) {
    throw new Error(`Error fetching especialidad: ${error}`);
  }
};

export const addEspecialidadService = async (data: { 
  nombre: string; 
  descripcion: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_ESPECIALIDAD_MUTATION,
      variables: data,
    });
    return response.data.addEspecialidad;
  } catch (error) {
    throw new Error(`Error adding especialidad: ${error}`);
  }
};

export const updateEspecialidadService = async (data: {
  idEspecialidad: string;
  nombre?: string;
  descripcion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ESPECIALIDAD_MUTATION,
      variables: data,
    });
    return response.data.updateEspecialidad;
  } catch (error) {
    throw new Error(`Error updating especialidad: ${error}`);
  }
};

export const deleteEspecialidadService = async (idEspecialidad: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_ESPECIALIDAD_MUTATION,
      variables: { idEspecialidad },
    });
    return response.data.deleteEspecialidad;
  } catch (error) {
    throw new Error(`Error deleting especialidad: ${error}`);
  }
};
