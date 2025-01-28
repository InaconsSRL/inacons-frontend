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
  query GetDetallesPartidaByTitulo($idTitulo: String!) {
    getDetallesPartidaByTitulo(id_titulo: $idTitulo) {
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
  mutation AddDetallePartida($idUnidad: String!, $idTitulo: String!, $metrado: Float!, $precio: Float!, $jornada: Float!) {
    addDetallePartida(id_unidad: $idUnidad, id_titulo: $idTitulo, metrado: $metrado, precio: $precio, jornada: $jornada) {
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
  mutation UpdateDetallePartida($idDetallePartida: String!, $idUnidad: String, $metrado: Float, $precio: Float, $jornada: Float) {
    updateDetallePartida(id_detalle_partida: $idDetallePartida, id_unidad: $idUnidad, metrado: $metrado, precio: $precio, jornada: $jornada) {
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
  mutation DeleteDetallePartida($idDetallePartida: String!) {
    deleteDetallePartida(id_detalle_partida: $idDetallePartida) {
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

export const getDetallesPartidaByTituloService = async (idTitulo: string) => {
  try {
    const response = await client.query({
      query: GET_DETALLES_PARTIDA_BY_TITULO_QUERY,
      variables: { idTitulo },
    });
    return response.data.getDetallesPartidaByTitulo;
  } catch (error) {
    throw new Error(`Error fetching detalles partida by titulo: ${error}`);
  }
};

export const addDetallePartidaService = async (data: {
  idUnidad: string;
  idTitulo: string;
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
  idDetallePartida: string;
  idUnidad?: string;
  metrado?: number;
  precio?: number;
  jornada?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_DETALLE_PARTIDA_MUTATION,
      variables: data,
    });
    return response.data.updateDetallePartida;
  } catch (error) {
    throw new Error(`Error updating detalle partida: ${error}`);
  }
};

export const deleteDetallePartidaService = async (idDetallePartida: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_DETALLE_PARTIDA_MUTATION,
      variables: { idDetallePartida },
    });
    return response.data.deleteDetallePartida;
  } catch (error) {
    throw new Error(`Error deleting detalle partida: ${error}`);
  }
};
