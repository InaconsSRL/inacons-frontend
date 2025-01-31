import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_EMPRESAS_QUERY = gql`
  query ListEmpresas {
    listEmpresas {
      id
      nombre_comercial
      razon_social
      descripcion
      estado
      regimen_fiscal
      ruc
    }
  }
`;

const GET_EMPRESA_QUERY = gql`
  query GetEmpresa($getEmpresaId: ID!) {
    getEmpresa(id: $getEmpresaId) {
      id
      nombre_comercial
      razon_social
      descripcion
      estado
      regimen_fiscal
      ruc
    }
  }
`;

const ADD_EMPRESA_MUTATION = gql`
  mutation AddEmpresa($nombre_comercial: String!, $razon_social: String!, $estado: String!, $regimen_fiscal: String!, $ruc: String!, $descripcion: String) {
    addEmpresa(nombre_comercial: $nombre_comercial, razon_social: $razon_social, estado: $estado, regimen_fiscal: $regimen_fiscal, ruc: $ruc, descripcion: $descripcion) {
      id
      nombre_comercial
      razon_social
      descripcion
      estado
      regimen_fiscal
      ruc
    }
  }
`;

const UPDATE_EMPRESA_MUTATION = gql`
  mutation UpdateEmpresa($updateEmpresaId: ID!, $ruc: String, $estado: String, $regimen_fiscal: String, $descripcion: String, $razon_social: String, $nombre_comercial: String) {
    updateEmpresa(id: $updateEmpresaId, ruc: $ruc, estado: $estado, regimen_fiscal: $regimen_fiscal, descripcion: $descripcion, razon_social: $razon_social, nombre_comercial: $nombre_comercial) {
      id
      nombre_comercial
      razon_social
      descripcion
      estado
      regimen_fiscal
      ruc
    }
  }
`;

const DELETE_EMPRESA_MUTATION = gql`
  mutation DeleteEmpresa($deleteEmpresaId: ID!) {
    deleteEmpresa(id: $deleteEmpresaId) {
      id
    }
  }
`;

export const listEmpresasService = async () => {
  try {
    const response = await client.query({
      query: LIST_EMPRESAS_QUERY,
    });
    return response.data.listEmpresas;
  } catch (error) {
    throw new Error(`Error fetching empresas: ${error}`);
  }
};

export const getEmpresaService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_EMPRESA_QUERY,
      variables: { getEmpresaId: id },
    });
    return response.data.getEmpresa;
  } catch (error) {
    throw new Error(`Error fetching empresa: ${error}`);
  }
};

export const addEmpresaService = async (data: {
  nombre_comercial: string;
  razon_social: string;
  estado: string;
  regimen_fiscal: string;
  ruc: string;
  descripcion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_EMPRESA_MUTATION,
      variables: data,
    });
    return response.data.addEmpresa;
  } catch (error) {
    throw new Error(`Error adding empresa: ${error}`);
  }
};

export const updateEmpresaService = async (data: {
  updateEmpresaId: string;
  nombre_comercial?: string;
  razon_social?: string;
  estado?: string;
  regimen_fiscal?: string;
  ruc?: string;
  descripcion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_EMPRESA_MUTATION,
      variables: data,
    });
    return response.data.updateEmpresa;
  } catch (error) {
    throw new Error(`Error updating empresa: ${error}`);
  }
};

export const deleteEmpresaService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_EMPRESA_MUTATION,
      variables: { deleteEmpresaId: id },
    });
    return response.data.deleteEmpresa;
  } catch (error) {
    throw new Error(`Error deleting empresa: ${error}`);
  }
};
