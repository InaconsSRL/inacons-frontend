import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CARGOS_QUERY = gql`
  query ListCargo {
    listCargo {
      id
      nombre
      descripcion
    }
  }
`;

const CREATE_CARGO_MUTATION = gql`
  mutation AddCargo($nombre: String!, $descripcion: String!) {
    addCargo(nombre: $nombre, descripcion: $descripcion) {
      descripcion
      nombre
      id
    }
  }
`;

const UPDATE_CARGO_MUTATION = gql`
  mutation UpdateCargo($updateCargoId: ID!, $nombre: String, $descripcion: String) {
    updateCargo(id: $updateCargoId, nombre: $nombre, descripcion: $descripcion) {
      id
      nombre
      descripcion
    }
  }
`;

export const listCargosService = async () => {
  try {
    const response = await client.query({
      query: LIST_CARGOS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }

    return response.data.listCargo;
  } catch (error) {
    console.error('Error al obtener la lista de cargos:', error);
    throw error;
  }
};

export const createCargoService = async (cargoData: { nombre: string; descripcion: string }) => {
  try {
    const response = await client.mutate({
      mutation: CREATE_CARGO_MUTATION,
      variables: cargoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.createCargo;
  } catch (error) {
    console.error('Error al crear el cargo:', error);
    throw error;
  }
};

export const updateCargoService = async (cargo: { id: string; nombre: string; descripcion: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_CARGO_MUTATION,
      variables: cargo,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateCargo;
  } catch (error) {
    console.error('Error al actualizar el cargo:', error);
    throw error;
  }
};