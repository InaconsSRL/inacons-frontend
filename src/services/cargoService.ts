import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CARGOS_QUERY = gql`
  query ListCargo {
    listCargo {
      id
      nombre
      descripcion
      gerarquia
    }
  }
`;

const ADD_CARGO_MUTATION = gql`
  mutation AddCargo($nombre: String!, $descripcion: String!, $gerarquia: Int) {
    addCargo(nombre: $nombre, descripcion: $descripcion, gerarquia: $gerarquia) {
      id
      nombre
      descripcion
      gerarquia
    }
  }
`;

const UPDATE_CARGO_MUTATION = gql`
  mutation UpdateCargo($id: ID!, $nombre: String, $descripcion: String, $gerarquia: Int) {
    updateCargo(id: $id, nombre: $nombre, descripcion: $descripcion, gerarquia: $gerarquia) {
      id
      nombre
      descripcion
      gerarquia
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

export const addCargoService = async (cargoData: { nombre: string; descripcion: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_CARGO_MUTATION,
      variables: cargoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addCargo;
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