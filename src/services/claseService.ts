import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CLASES_QUERY = gql`
  query ListClases {
    listClases {
      id_clase
      nombre
    }
  }
`;

const GET_CLASE_QUERY = gql`
  query GetClase($id_clase: String!) {
    getClase(id_clase: $id_clase) {
      id_clase
      nombre
    }
  }
`;

const ADD_CLASE_MUTATION = gql`
  mutation AddClase($nombre: String!) {
    addClase(nombre: $nombre) {
      id_clase
      nombre
    }
  }
`;

const UPDATE_CLASE_MUTATION = gql`
  mutation UpdateClase($id_clase: String!, $nombre: String) {
    updateClase(id_clase: $id_clase, nombre: $nombre) {
      id_clase
      nombre
    }
  }
`;

const DELETE_CLASE_MUTATION = gql`
  mutation DeleteClase($id_clase: String!) {
    deleteClase(id_clase: $id_clase) {
      id_clase
      nombre
    }
  }
`;

export const listClasesService = async () => {
  try {
    const response = await client.query({
      query: LIST_CLASES_QUERY,
    });
    return response.data.listClases;
  } catch (error) {
    throw new Error(`Error fetching clases: ${error}`);
  }
};

export const getClaseService = async (id_clase: string) => {
  try {
    const response = await client.query({
      query: GET_CLASE_QUERY,
      variables: { id_clase },
    });
    return response.data.getClase;
  } catch (error) {
    throw new Error(`Error fetching clase: ${error}`);
  }
};

export const addClaseService = async (nombre: string) => {
  try {
    const response = await client.mutate({
      mutation: ADD_CLASE_MUTATION,
      variables: { nombre },
    });
    return response.data.addClase;
  } catch (error) {
    throw new Error(`Error adding clase: ${error}`);
  }
};

export const updateClaseService = async (data: { id_clase: string; nombre?: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_CLASE_MUTATION,
      variables: data,
    });
    return response.data.updateClase;
  } catch (error) {
    throw new Error(`Error updating clase: ${error}`);
  }
};

export const deleteClaseService = async (id_clase: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_CLASE_MUTATION,
      variables: { id_clase },
    });
    return response.data.deleteClase;
  } catch (error) {
    throw new Error(`Error deleting clase: ${error}`);
  }
};
