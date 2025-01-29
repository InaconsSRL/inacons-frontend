import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PROVINCIAS_QUERY = gql`
  query ListProvincias {
    listProvincias {
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const GET_PROVINCIAS_BY_DEPARTAMENTO_QUERY = gql`
  query GetProvinciasByDepartamento($id_departamento: String!) {
    getProvinciasByDepartamento(id_departamento: $id_departamento) {
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const GET_PROVINCIA_QUERY = gql`
  query GetProvincia($id_provincia: String!) {
    getProvincia(id_provincia: $id_provincia) {
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const ADD_PROVINCIA_MUTATION = gql`
  mutation AddProvincia($nombre_provincia: String!, $id_departamento: String!) {
    addProvincia(nombre_provincia: $nombre_provincia, id_departamento: $id_departamento) {
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const UPDATE_PROVINCIA_MUTATION = gql`
  mutation UpdateProvincia($id_provincia: String!, $nombre_provincia: String, $id_departamento: String) {
    updateProvincia(id_provincia: $id_provincia, nombre_provincia: $nombre_provincia, id_departamento: $id_departamento) {
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const DELETE_PROVINCIA_MUTATION = gql`
  mutation DeleteProvincia($id_provincia: String!) {
    deleteProvincia(id_provincia: $id_provincia) {
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

export const listProvinciasService = async () => {
  try {
    const response = await client.query({
      query: LIST_PROVINCIAS_QUERY,
    });
    return response.data.listProvincias;
  } catch (error) {
    throw new Error(`Error fetching provincias: ${error}`);
  }
};

export const getProvinciasByDepartamentoService = async (id_departamento: string) => {
  try {
    const response = await client.query({
      query: GET_PROVINCIAS_BY_DEPARTAMENTO_QUERY,
      variables: { id_departamento },
    });
    return response.data.getProvinciasByDepartamento;
  } catch (error) {
    throw new Error(`Error fetching provincias by departamento: ${error}`);
  }
};

export const getProvinciaService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_PROVINCIA_QUERY,
      variables: { id_provincia: id },
    });
    return response.data.getProvincia;
  } catch (error) {
    throw new Error(`Error fetching provincia: ${error}`);
  }
};

export const addProvinciaService = async (data: {
  nombre_provincia: string;
  id_departamento: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_PROVINCIA_MUTATION,
      variables: data,
    });
    return response.data.addProvincia;
  } catch (error) {
    throw new Error(`Error adding provincia: ${error}`);
  }
};

export const updateProvinciaService = async (data: {
  id_provincia: string;
  nombre_provincia?: string;
  id_departamento?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_PROVINCIA_MUTATION,
      variables: data,
    });
    return response.data.updateProvincia;
  } catch (error) {
    throw new Error(`Error updating provincia: ${error}`);
  }
};

export const deleteProvinciaService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_PROVINCIA_MUTATION,
      variables: { id_provincia: id },
    });
    return response.data.deleteProvincia;
  } catch (error) {
    throw new Error(`Error deleting provincia: ${error}`);
  }
};
