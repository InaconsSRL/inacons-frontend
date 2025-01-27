import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_DEPARTAMENTOS_QUERY = gql`
  query ListDepartamentos {
    listDepartamentos {
      id_departamento
      nombre_departamento
      ubigeo
    }
  }
`;

const GET_DEPARTAMENTO_QUERY = gql`
  query GetDepartamento($idDepartamento: String!) {
    getDepartamento(id_departamento: $idDepartamento) {
      id_departamento
      nombre_departamento
      ubigeo
    }
  }
`;

const ADD_DEPARTAMENTO_MUTATION = gql`
  mutation AddDepartamento($nombreDepartamento: String!, $ubigeo: String!) {
    addDepartamento(nombre_departamento: $nombreDepartamento, ubigeo: $ubigeo) {
      id_departamento
      nombre_departamento
      ubigeo
    }
  }
`;

const UPDATE_DEPARTAMENTO_MUTATION = gql`
  mutation UpdateDepartamento($idDepartamento: String!, $nombreDepartamento: String, $ubigeo: String) {
    updateDepartamento(id_departamento: $idDepartamento, nombre_departamento: $nombreDepartamento, ubigeo: $ubigeo) {
      id_departamento
      nombre_departamento
      ubigeo
    }
  }
`;

const DELETE_DEPARTAMENTO_MUTATION = gql`
  mutation DeleteDepartamento($idDepartamento: String!) {
    deleteDepartamento(id_departamento: $idDepartamento) {
      id_departamento
      nombre_departamento
      ubigeo
    }
  }
`;

export const listDepartamentosService = async () => {
  try {
    const response = await client.query({
      query: LIST_DEPARTAMENTOS_QUERY,
    });
    return response.data.listDepartamentos;
  } catch (error) {
    throw new Error(`Error fetching departamentos: ${error}`);
  }
};

export const getDepartamentoService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_DEPARTAMENTO_QUERY,
      variables: { idDepartamento: id },
    });
    return response.data.getDepartamento;
  } catch (error) {
    throw new Error(`Error fetching departamento: ${error}`);
  }
};

export const addDepartamentoService = async (data: { 
  nombreDepartamento: string;
  ubigeo: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_DEPARTAMENTO_MUTATION,
      variables: data,
    });
    return response.data.addDepartamento;
  } catch (error) {
    throw new Error(`Error adding departamento: ${error}`);
  }
};

export const updateDepartamentoService = async (data: {
  idDepartamento: string;
  nombreDepartamento?: string;
  ubigeo?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_DEPARTAMENTO_MUTATION,
      variables: data,
    });
    return response.data.updateDepartamento;
  } catch (error) {
    throw new Error(`Error updating departamento: ${error}`);
  }
};

export const deleteDepartamentoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_DEPARTAMENTO_MUTATION,
      variables: { idDepartamento: id },
    });
    return response.data.deleteDepartamento;
  } catch (error) {
    throw new Error(`Error deleting departamento: ${error}`);
  }
};
