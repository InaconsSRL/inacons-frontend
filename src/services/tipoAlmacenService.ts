import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TIPO_ALMACENES = gql`
  query ListTipoAlmacenes {
    listTipoAlmacenes {
      id
      nombre
    }
  }
`;

const ADD_TIPO_ALMACEN = gql`
  mutation AddTipoAlmacen($nombre: String!) {
    addTipoAlmacen(nombre: $nombre) {
      id
      nombre
    }
  }
`;

const UPDATE_TIPO_ALMACEN = gql`
  mutation UpdateTipoAlmacen($updateTipoAlmacenId: ID!, $nombre: String!) {
    updateTipoAlmacen(id: $updateTipoAlmacenId, nombre: $nombre) {
      id
      nombre
    }
  }
`;

const DELETE_TIPO_ALMACEN = gql`
  mutation DeleteTipoAlmacen($deleteTipoAlmacenId: ID!) {
    deleteTipoAlmacen(id: $deleteTipoAlmacenId) {
      id
      nombre
    }
  }
`;

export const listTipoAlmacenesService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_TIPO_ALMACENES,
    });
    return data.listTipoAlmacenes;
  } catch (error) {
    throw new Error(`Error fetching tipo almacenes: ${error}`);
  }
};

export const addTipoAlmacenService = async (nombre: string) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_TIPO_ALMACEN,
      variables: { nombre },
    });
    return data.addTipoAlmacen;
  } catch (error) {
    throw new Error(`Error adding tipo almacen: ${error}`);
  }
};

export const updateTipoAlmacenService = async ({ id, nombre }: { id: string; nombre: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_TIPO_ALMACEN,
      variables: { updateTipoAlmacenId: id, nombre },
    });
    return data.updateTipoAlmacen;
  } catch (error) {
    throw new Error(`Error updating tipo almacen: ${error}`);
  }
};

export const deleteTipoAlmacenService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_TIPO_ALMACEN,
      variables: { deleteTipoAlmacenId: id },
    });
    return data.deleteTipoAlmacen;
  } catch (error) {
    throw new Error(`Error deleting tipo almacen: ${error}`);
  }
};