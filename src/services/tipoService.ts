import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TIPOS_QUERY = gql`
  query ListTipos {
    listTipos {
      id_tipo
      descripcion
      codigo
    }
  }
`;

const GET_TIPO_QUERY = gql`
  query GetTipo($idTipo: String!) {
    getTipo(id_tipo: $idTipo) {
      id_tipo
      descripcion
      codigo
    }
  }
`;

const ADD_TIPO_MUTATION = gql`
  mutation AddTipo($descripcion: String!, $codigo: String!) {
    addTipo(descripcion: $descripcion, codigo: $codigo) {
      id_tipo
      descripcion
      codigo
    }
  }
`;

const UPDATE_TIPO_MUTATION = gql`
  mutation UpdateTipo($idTipo: String!, $descripcion: String, $codigo: String) {
    updateTipo(id_tipo: $idTipo, descripcion: $descripcion, codigo: $codigo) {
      id_tipo
      descripcion
      codigo
    }
  }
`;

const DELETE_TIPO_MUTATION = gql`
  mutation DeleteTipo($idTipo: String!) {
    deleteTipo(id_tipo: $idTipo) {
      id_tipo
    }
  }
`;

export const listTiposService = async () => {
  try {
    const response = await client.query({
      query: LIST_TIPOS_QUERY,
    });
    return response.data.listTipos;
  } catch (error) {
    throw new Error(`Error fetching tipos: ${error}`);
  }
};

export const getTipoService = async (idTipo: string) => {
  try {
    const response = await client.query({
      query: GET_TIPO_QUERY,
      variables: { idTipo },
    });
    return response.data.getTipo;
  } catch (error) {
    throw new Error(`Error fetching tipo: ${error}`);
  }
};

export const addTipoService = async (data: { descripcion: string; codigo: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_TIPO_MUTATION,
      variables: data,
    });
    return response.data.addTipo;
  } catch (error) {
    throw new Error(`Error adding tipo: ${error}`);
  }
};

export const updateTipoService = async (data: {
  idTipo: string;
  descripcion?: string;
  codigo?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_TIPO_MUTATION,
      variables: data,
    });
    return response.data.updateTipo;
  } catch (error) {
    throw new Error(`Error updating tipo: ${error}`);
  }
};

export const deleteTipoService = async (idTipo: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_TIPO_MUTATION,
      variables: { idTipo },
    });
    return response.data.deleteTipo;
  } catch (error) {
    throw new Error(`Error deleting tipo: ${error}`);
  }
};
