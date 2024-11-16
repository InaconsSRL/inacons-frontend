
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_BODEGAS_QUERY = gql`
  query ListBodegas {
    listBodegas {
      id
      codigo
      descripcion
    }
  }
`;

const ADD_BODEGA_MUTATION = gql`
  mutation AddBodega($codigo: String!, $descripcion: String!) {
    addBodega(codigo: $codigo, descripcion: $descripcion) {
      id
      codigo
      descripcion
    }
  }
`;

const UPDATE_BODEGA_MUTATION = gql`
  mutation UpdateBodega($updateBodegaId: ID!, $codigo: String, $descripcion: String) {
    updateBodega(id: $updateBodegaId, codigo: $codigo, descripcion: $descripcion) {
      id
      codigo
      descripcion
    }
  }
`;

const DELETE_BODEGA_MUTATION = gql`
  mutation DeleteBodega($deleteBodegaId: ID!) {
    deleteBodega(id: $deleteBodegaId) {
      id
      codigo
      descripcion
    }
  }
`;

export const listBodegasService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_BODEGAS_QUERY
    });
    return data.listBodegas;
  } catch (error) {
    throw new Error(`Error fetching bodegas: ${error}`);
  }
};

export const addBodegaService = async (bodegaData: { codigo: string; descripcion: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_BODEGA_MUTATION,
      variables: bodegaData
    });
    return data.addBodega;
  } catch (error) {
    throw new Error(`Error adding bodega: ${error}`);
  }
};

export const updateBodegaService = async (id: string, bodegaData: { codigo?: string; descripcion?: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_BODEGA_MUTATION,
      variables: { updateBodegaId: id, ...bodegaData }
    });
    return data.updateBodega;
  } catch (error) {
    throw new Error(`Error updating bodega: ${error}`);
  }
};

export const deleteBodegaService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_BODEGA_MUTATION,
      variables: { deleteBodegaId: id }
    });
    return data.deleteBodega;
  } catch (error) {
    throw new Error(`Error deleting bodega: ${error}`);
  }
};