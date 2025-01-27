import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_DISTRITOS_QUERY = gql`
  query ListDistritos {
    listDistritos {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const GET_DISTRITOS_BY_PROVINCIA_QUERY = gql`
  query GetDistritosByProvincia($idProvincia: String!) {
    getDistritosByProvincia(id_provincia: $idProvincia) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const GET_DISTRITO_QUERY = gql`
  query GetDistrito($idDistrito: String!) {
    getDistrito(id_distrito: $idDistrito) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const ADD_DISTRITO_MUTATION = gql`
  mutation AddDistrito($nombreDistrito: String!, $idProvincia: String!) {
    addDistrito(nombre_distrito: $nombreDistrito, id_provincia: $idProvincia) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const UPDATE_DISTRITO_MUTATION = gql`
  mutation UpdateDistrito($idDistrito: String!, $idProvincia: String, $nombreDistrito: String) {
    updateDistrito(id_distrito: $idDistrito, id_provincia: $idProvincia, nombre_distrito: $nombreDistrito) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const DELETE_DISTRITO_MUTATION = gql`
  mutation DeleteDistrito($idDistrito: String!) {
    deleteDistrito(id_distrito: $idDistrito) {
      id_distrito
    }
  }
`;

export const listDistritosService = async () => {
  try {
    const response = await client.query({
      query: LIST_DISTRITOS_QUERY,
    });
    return response.data.listDistritos;
  } catch (error) {
    throw new Error(`Error fetching distritos: ${error}`);
  }
};

export const getDistritosByProvinciaService = async (idProvincia: string) => {
  try {
    const response = await client.query({
      query: GET_DISTRITOS_BY_PROVINCIA_QUERY,
      variables: { idProvincia },
    });
    return response.data.getDistritosByProvincia;
  } catch (error) {
    throw new Error(`Error fetching distritos by provincia: ${error}`);
  }
};

export const getDistritoService = async (idDistrito: string) => {
  try {
    const response = await client.query({
      query: GET_DISTRITO_QUERY,
      variables: { idDistrito },
    });
    return response.data.getDistrito;
  } catch (error) {
    throw new Error(`Error fetching distrito: ${error}`);
  }
};

export const addDistritoService = async (data: { nombreDistrito: string; idProvincia: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_DISTRITO_MUTATION,
      variables: data,
    });
    return response.data.addDistrito;
  } catch (error) {
    throw new Error(`Error adding distrito: ${error}`);
  }
};

export const updateDistritoService = async (data: {
  idDistrito: string;
  idProvincia?: string;
  nombreDistrito?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_DISTRITO_MUTATION,
      variables: data,
    });
    return response.data.updateDistrito;
  } catch (error) {
    throw new Error(`Error updating distrito: ${error}`);
  }
};

export const deleteDistritoService = async (idDistrito: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_DISTRITO_MUTATION,
      variables: { idDistrito },
    });
    return response.data.deleteDistrito;
  } catch (error) {
    throw new Error(`Error deleting distrito: ${error}`);
  }
};
