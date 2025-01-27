import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PROVINCIAS_QUERY = gql`
  query ListProvincias {
    listProvincias {
      _id
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const GET_PROVINCIAS_BY_DEPARTAMENTO_QUERY = gql`
  query GetProvinciasByDepartamento($idDepartamento: String!) {
    getProvinciasByDepartamento(id_departamento: $idDepartamento) {
      _id
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const GET_PROVINCIA_QUERY = gql`
  query GetProvincia($idProvincia: String!) {
    getProvincia(id_provincia: $idProvincia) {
      _id
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const ADD_PROVINCIA_MUTATION = gql`
  mutation AddProvincia($nombreProvincia: String!, $idDepartamento: String!) {
    addProvincia(nombre_provincia: $nombreProvincia, id_departamento: $idDepartamento) {
      _id
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const UPDATE_PROVINCIA_MUTATION = gql`
  mutation UpdateProvincia($idProvincia: String!, $nombreProvincia: String, $idDepartamento: String) {
    updateProvincia(id_provincia: $idProvincia, nombre_provincia: $nombreProvincia, id_departamento: $idDepartamento) {
      _id
      id_provincia
      id_departamento
      nombre_provincia
    }
  }
`;

const DELETE_PROVINCIA_MUTATION = gql`
  mutation DeleteProvincia($idProvincia: String!) {
    deleteProvincia(id_provincia: $idProvincia) {
      _id
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

export const getProvinciasByDepartamentoService = async (idDepartamento: string) => {
  try {
    const response = await client.query({
      query: GET_PROVINCIAS_BY_DEPARTAMENTO_QUERY,
      variables: { idDepartamento },
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
      variables: { idProvincia: id },
    });
    return response.data.getProvincia;
  } catch (error) {
    throw new Error(`Error fetching provincia: ${error}`);
  }
};

export const addProvinciaService = async (data: {
  nombreProvincia: string;
  idDepartamento: string;
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
  idProvincia: string;
  nombreProvincia?: string;
  idDepartamento?: string;
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
      variables: { idProvincia: id },
    });
    return response.data.deleteProvincia;
  } catch (error) {
    throw new Error(`Error deleting provincia: ${error}`);
  }
};
