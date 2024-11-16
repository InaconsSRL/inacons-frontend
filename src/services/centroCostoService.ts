
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CENTROS_COSTO_QUERY = gql`
  query ListCentrosCosto {
    listCentrosCosto {
      id
      nombre
      tipo
    }
  }
`;

const ADD_CENTRO_COSTO_MUTATION = gql`
  mutation AddCentroCosto($nombre: String!, $tipo: String!) {
    addCentroCosto(nombre: $nombre, tipo: $tipo) {
      id
      nombre
      tipo
    }
  }
`;

const UPDATE_CENTRO_COSTO_MUTATION = gql`
  mutation UpdateCentroCosto($updateCentroCostoId: ID!, $nombre: String, $tipo: String) {
    updateCentroCosto(id: $updateCentroCostoId, nombre: $nombre, tipo: $tipo) {
      id
      nombre
      tipo
    }
  }
`;

const DELETE_CENTRO_COSTO_MUTATION = gql`
  mutation DeleteCentroCosto($deleteCentroCostoId: ID!) {
    deleteCentroCosto(id: $deleteCentroCostoId) {
      id
      nombre
      tipo
    }
  }
`;

export const listCentrosCostoService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_CENTROS_COSTO_QUERY,
    });
    return data.listCentrosCosto;
  } catch (error) {
    throw new Error(`Error fetching centros de costo: ${error}`);
  }
};

export const addCentroCostoService = async (centroCostoData: { nombre: string; tipo: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_CENTRO_COSTO_MUTATION,
      variables: centroCostoData,
    });
    return data.addCentroCosto;
  } catch (error) {
    throw new Error(`Error adding centro de costo: ${error}`);
  }
};

export const updateCentroCostoService = async (centroCosto: { id: string; nombre?: string; tipo?: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_CENTRO_COSTO_MUTATION,
      variables: {
        updateCentroCostoId: centroCosto.id,
        ...centroCosto,
      },
    });
    return data.updateCentroCosto;
  } catch (error) {
    throw new Error(`Error updating centro de costo: ${error}`);
  }
};

export const deleteCentroCostoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_CENTRO_COSTO_MUTATION,
      variables: { deleteCentroCostoId: id },
    });
    return data.deleteCentroCosto;
  } catch (error) {
    throw new Error(`Error deleting centro de costo: ${error}`);
  }
};