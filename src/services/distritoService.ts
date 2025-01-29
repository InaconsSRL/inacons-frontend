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
  query GetDistritosByProvincia($id_provincia: String!) {
    getDistritosByProvincia(id_provincia: $id_provincia) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const GET_DISTRITO_QUERY = gql`
  query GetDistrito($id_distrito: String!) {
    getDistrito(id_distrito: $id_distrito) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const ADD_DISTRITO_MUTATION = gql`
  mutation AddDistrito($nombre_distrito: String!, $id_provincia: String!) {
    addDistrito(nombre_distrito: $nombre_distrito, id_provincia: $id_provincia) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const UPDATE_DISTRITO_MUTATION = gql`
  mutation UpdateDistrito($id_distrito: String!, $id_provincia: String, $nombre_distrito: String) {
    updateDistrito(id_distrito: $id_distrito, id_provincia: $id_provincia, nombre_distrito: $nombre_distrito) {
      id_distrito
      id_provincia
      nombre_distrito
    }
  }
`;

const DELETE_DISTRITO_MUTATION = gql`
  mutation DeleteDistrito($id_distrito: String!) {
    deleteDistrito(id_distrito: $id_distrito) {
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

export const getDistritosByProvinciaService = async (id_provincia: string) => {
  try {
    const response = await client.query({
      query: GET_DISTRITOS_BY_PROVINCIA_QUERY,
      variables: { id_provincia },
    });
    return response.data.getDistritosByProvincia;
  } catch (error) {
    throw new Error(`Error fetching distritos by provincia: ${error}`);
  }
};

export const getDistritoService = async (id_distrito: string) => {
  try {
    const response = await client.query({
      query: GET_DISTRITO_QUERY,
      variables: { id_distrito },
    });
    return response.data.getDistrito;
  } catch (error) {
    throw new Error(`Error fetching distrito: ${error}`);
  }
};

export const addDistritoService = async (data: { nombre_distrito: string; id_provincia: string }) => {
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
  id_distrito: string;
  id_provincia?: string;
  nombre_distrito?: string;
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

export const deleteDistritoService = async (id_distrito: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_DISTRITO_MUTATION,
      variables: { id_distrito },
    });
    return response.data.deleteDistrito;
  } catch (error) {
    throw new Error(`Error deleting distrito: ${error}`);
  }
};
