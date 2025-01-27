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
  query GetLocalidadesByDistrito($idDistrito: String!) {
    getLocalidadesByDistrito(id_distrito: $idDistrito) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const GET_LOCALIDAD_QUERY = gql`
  query GetLocalidad($idLocalidad: String!) {
    getLocalidad(id_localidad: $idLocalidad) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const ADD_LOCALIDAD_MUTATION = gql`
  mutation AddLocalidad($nombreLocalidad: String!, $idDistrito: String!) {
    addLocalidad(nombre_localidad: $nombreLocalidad, id_distrito: $idDistrito) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const UPDATE_LOCALIDAD_MUTATION = gql`
  mutation UpdateLocalidad($idLocalidad: String!, $nombreLocalidad: String, $idDistrito: String) {
    updateLocalidad(id_localidad: $idLocalidad, nombre_localidad: $nombreLocalidad, id_distrito: $idDistrito) {
      id_localidad
      id_distrito
      nombre_localidad
    }
  }
`;

const DELETE_LOCALIDAD_MUTATION = gql`
  mutation DeleteLocalidad($idLocalidad: String!) {
    deleteLocalidad(id_localidad: $idLocalidad) {
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

export const getLocalidadesByDistritoService = async (idDistrito: string) => {
  try {
    const response = await client.query({
      query: GET_LOCALIDADES_BY_DISTRITO_QUERY,
      variables: { idDistrito },
    });
    return response.data.getLocalidadesByDistrito;
  } catch (error) {
    throw new Error(`Error fetching localidades by distrito: ${error}`);
  }
};

export const getLocalidadService = async (idLocalidad: string) => {
  try {
    const response = await client.query({
      query: GET_LOCALIDAD_QUERY,
      variables: { idLocalidad },
    });
    return response.data.getLocalidad;
  } catch (error) {
    throw new Error(`Error fetching localidad: ${error}`);
  }
};

export const addLocalidadService = async (data: { nombreLocalidad: string; idDistrito: string }) => {
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
  idLocalidad: string;
  nombreLocalidad?: string;
  idDistrito?: string;
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

export const deleteLocalidadService = async (idLocalidad: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_LOCALIDAD_MUTATION,
      variables: { idLocalidad },
    });
    return response.data.deleteLocalidad;
  } catch (error) {
    throw new Error(`Error deleting localidad: ${error}`);
  }
};
