
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_MOVIMIENTOS = gql`
  query ListMovimientos {
    listMovimientos {
      id
      nombre
      descripcion
      tipo
    }
  }
`;

const ADD_MOVIMIENTO = gql`
  mutation AddMovimiento($nombre: String!, $tipo: String!, $descripcion: String) {
    addMovimiento(nombre: $nombre, tipo: $tipo, descripcion: $descripcion) {
      id
      nombre
      descripcion
      tipo
    }
  }
`;

const UPDATE_MOVIMIENTO = gql`
  mutation UpdateMovimiento($updateMovimientoId: ID!, $nombre: String, $descripcion: String, $tipo: String) {
    updateMovimiento(id: $updateMovimientoId, nombre: $nombre, descripcion: $descripcion, tipo: $tipo) {
      id
      nombre
      descripcion
      tipo
    }
  }
`;

const DELETE_MOVIMIENTO = gql`
  mutation DeleteMovimiento($deleteMovimientoId: ID!) {
    deleteMovimiento(id: $deleteMovimientoId) {
      id
    }
  }
`;

export const listMovimientosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_MOVIMIENTOS,
    });
    return data.listMovimientos;
  } catch (error) {
    throw new Error(`Error fetching movimientos: ${error}`);
  }
};

export const addMovimientoService = async (movimientoData: { nombre: string; tipo: string; descripcion?: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_MOVIMIENTO,
      variables: movimientoData,
    });
    return data.addMovimiento;
  } catch (error) {
    throw new Error(`Error adding movimiento: ${error}`);
  }
};

export const updateMovimientoService = async (
  id: string,
  movimientoData: { nombre?: string; tipo?: string; descripcion?: string }
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_MOVIMIENTO,
      variables: { updateMovimientoId: id, ...movimientoData },
    });
    return data.updateMovimiento;
  } catch (error) {
    throw new Error(`Error updating movimiento: ${error}`);
  }
};

export const deleteMovimientoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_MOVIMIENTO,
      variables: { deleteMovimientoId: id },
    });
    return data.deleteMovimiento;
  } catch (error) {
    throw new Error(`Error deleting movimiento: ${error}`);
  }
};