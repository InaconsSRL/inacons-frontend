import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_DETALLES_PARTIDA_QUERY = gql`
  query ListDetallesPartida {
    listDetallesPartida {
      id_detalle_partida
      id_unidad
      id_titulo
      metrado
      precio
      jornada
    }
  }
`;

const GET_DETALLES_PARTIDA_BY_TITULO_QUERY = gql`
  query GetDetallesPartidaByTitulo($id_titulo: String!) {
    getDetallesPartidaByTitulo(id_titulo: $id_titulo) {
      id_detalle_partida
      id_unidad
      id_titulo
      metrado
      precio
      jornada
    }
  }
`;

const ADD_DETALLE_PARTIDA_MUTATION = gql`
  mutation AddDetallePartida($id_unidad: String!, $id_titulo: String!, $metrado: Float!, $precio: Float!, $jornada: Float!) {
    addDetallePartida(id_unidad: $id_unidad, id_titulo: $id_titulo, metrado: $metrado, precio: $precio, jornada: $jornada) {
      id_detalle_partida
      id_unidad
      id_titulo
      metrado
      precio
      jornada
    }
  }
`;

const UPDATE_DETALLE_PARTIDA_MUTATION = gql`
  mutation UpdateDetallePartida($id_detalle_partida: String!, $id_unidad: String, $metrado: Float, $precio: Float, $jornada: Float) {
    updateDetallePartida(id_detalle_partida: $id_detalle_partida, id_unidad: $id_unidad, metrado: $metrado, precio: $precio, jornada: $jornada) {
      id_detalle_partida
      id_unidad
      id_titulo
      metrado
      precio
      jornada
    }
  }
`;

const DELETE_DETALLE_PARTIDA_MUTATION = gql`
  mutation DeleteDetallePartida($id_detalle_partida: String!) {
    deleteDetallePartida(id_detalle_partida: $id_detalle_partida) {
      id_detalle_partida
    }
  }
`;

export const listDetallesPartidaService = async () => {
  try {
    const response = await client.query({
      query: LIST_DETALLES_PARTIDA_QUERY,
    });
    return response.data.listDetallesPartida;
  } catch (error) {
    throw new Error(`Error fetching detalles partida: ${error}`);
  }
};

export const getDetallesPartidaByTituloService = async (id_titulo: string) => {
  try {
    const response = await client.query({
      query: GET_DETALLES_PARTIDA_BY_TITULO_QUERY,
      variables: { id_titulo },
    });
    return response.data.getDetallesPartidaByTitulo;
  } catch (error) {
    throw new Error(`Error fetching detalles partida by titulo: ${error}`);
  }
};

export const addDetallePartidaService = async (data: {
  id_unidad: string;
  id_titulo: string;
  metrado: number;
  precio: number;
  jornada: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_DETALLE_PARTIDA_MUTATION,
      variables: data,
    });
    return response.data.addDetallePartida;
  } catch (error) {
    throw new Error(`Error adding detalle partida: ${error}`);
  }
};

export const updateDetallePartidaService = async (data: {
  id_detalle_partida: string;
  id_unidad?: string;
  metrado?: number;
  precio?: number;
  jornada?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_DETALLE_PARTIDA_MUTATION,
      variables: data,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating detalle partida: ${error}`);
  }
};

export const deleteDetallePartidaService = async (id_detalle_partida: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_DETALLE_PARTIDA_MUTATION,
      variables: { id_detalle_partida },
    });
    return response.data.deleteDetallePartida;
  } catch (error) {
    throw new Error(`Error deleting detalle partida: ${error}`);
  }
};
