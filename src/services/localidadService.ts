import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_LOCALIDADES_QUERY = gql`
  query ListLocalidades {
    listLocalidades {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const GET_LOCALIDADES_BY_DISTRITO_QUERY = gql`
  query GetLocalidadesByDistrito($id_distrito: String!) {
    getLocalidadesByDistrito(id_distrito: $id_distrito) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const GET_LOCALIDAD_QUERY = gql`
  query GetLocalidad($id_localidad: String!) {
    getLocalidad(id_localidad: $id_localidad) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const ADD_LOCALIDAD_MUTATION = gql`
  mutation AddLocalidad($nombre_localidad: String!, $id_distrito: String!) {
    addLocalidad(nombre_localidad: $nombre_localidad, id_distrito: $id_distrito) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const UPDATE_LOCALIDAD_MUTATION = gql`
  mutation UpdateLocalidad($id_localidad: String!, $nombre_localidad: String, $id_distrito: String) {
    updateLocalidad(id_localidad: $id_localidad, nombre_localidad: $nombre_localidad, id_distrito: $id_distrito) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const DELETE_LOCALIDAD_MUTATION = gql`
  mutation DeleteLocalidad($id_localidad: String!) {
    deleteLocalidad(id_localidad: $id_localidad) {
      id_localidad
    }
  }
`;

export const listLocalidadesService = async () => {
  try {
    const response = await client.query({
      query: LIST_LOCALIDADES_QUERY,
    });
    return response.data.listLocalidades;
  } catch (error) {
    throw new Error(`Error fetching localidades: ${error}`);
  }
};

export const getLocalidadesByDistritoService = async (id_distrito: string) => {
  try {
    const response = await client.query({
      query: GET_LOCALIDADES_BY_DISTRITO_QUERY,
      variables: { id_distrito },
    });
    return response.data.getLocalidadesByDistrito;
  } catch (error) {
    throw new Error(`Error fetching localidades by distrito: ${error}`);
  }
};

export const getLocalidadService = async (id_localidad: string) => {
  try {
    const response = await client.query({
      query: GET_LOCALIDAD_QUERY,
      variables: { id_localidad },
    });
    return response.data.getLocalidad;
  } catch (error) {
    throw new Error(`Error fetching localidad: ${error}`);
  }
};

export const addLocalidadService = async (data: { nombre_localidad: string; id_distrito: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_LOCALIDAD_MUTATION,
      variables: data,
    });
    return response.data.addLocalidad;
  } catch (error) {
    throw new Error(`Error adding localidad: ${error}`);
  }
};

export const updateLocalidadService = async (data: {
  id_localidad: string;
  nombre_localidad?: string;
  id_distrito?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_LOCALIDAD_MUTATION,
      variables: data,
    });
    return response.data.updateLocalidad;
  } catch (error) {
    throw new Error(`Error updating localidad: ${error}`);
  }
};

export const deleteLocalidadService = async (id_localidad: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_LOCALIDAD_MUTATION,
      variables: { id_localidad },
    });
    return response.data.deleteLocalidad;
  } catch (error) {
    throw new Error(`Error deleting localidad: ${error}`);
  }
};
