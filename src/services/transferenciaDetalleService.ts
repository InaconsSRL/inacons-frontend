import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIA_DETALLES = gql`
  query ListTransferenciaDetalles {
    listTransferenciaDetalles {
      id
      transferencia_id
      referencia_id
      fecha
      tipo
      referencia
    }
  }
`;

const LIST_TRANSFERENCIA_DETALLES_BY_TRANSFERENCIA_ID = gql`
  query ListTransferenciaDetallesByTransferenciaId($transferenciaId: ID!) {
    listTransferenciaDetallesByTransferenciaId(transferencia_id: $transferenciaId) {
      id
      transferencia_id
      referencia_id
      fecha
      tipo
      referencia
    }
  }
`;

const ADD_TRANSFERENCIA_DETALLE = gql`
  mutation AddTransferenciaDetalle($transferenciaId: ID!, $referenciaId: Int!, $fecha: DateTime!, $tipo: String!, $referencia: String!) {
    addTransferenciaDetalle(transferencia_id: $transferenciaId, referencia_id: $referenciaId, fecha: $fecha, tipo: $tipo, referencia: $referencia) {
      id
      transferencia_id
      referencia_id
      fecha
      tipo
      referencia
    }
  }
`;

const UPDATE_TRANSFERENCIA_DETALLE = gql`
  mutation UpdateTransferenciaDetalle($updateTransferenciaDetalleId: ID!, $transferenciaId: ID, $referenciaId: Int, $fecha: DateTime, $tipo: String, $referencia: String) {
    updateTransferenciaDetalle(id: $updateTransferenciaDetalleId, transferencia_id: $transferenciaId, referencia_id: $referenciaId, fecha: $fecha, tipo: $tipo, referencia: $referencia) {
      id
      transferencia_id
      referencia_id
      fecha
      tipo
      referencia
    }
  }
`;

const DELETE_TRANSFERENCIA_DETALLE = gql`
  mutation DeleteTransferenciaDetalle($deleteTransferenciaDetalleId: ID!) {
    deleteTransferenciaDetalle(id: $deleteTransferenciaDetalleId) {
      id
    }
  }
`;

export const listTransferenciaDetallesService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_TRANSFERENCIA_DETALLES,
    });
    return data.listTransferenciaDetalles;
  } catch (error) {
    throw new Error(`Error fetching transferencia detalles: ${error}`);
  }
};

export const listTransferenciaDetallesByTransferenciaIdService = async (transferenciaId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_TRANSFERENCIA_DETALLES_BY_TRANSFERENCIA_ID,
      variables: { transferenciaId },
    });
    return data.listTransferenciaDetallesByTransferenciaId;
  } catch (error) {
    throw new Error(`Error fetching transferencia detalles by id: ${error}`);
  }
};

export const addTransferenciaDetalleService = async (transferenciaDetalle: {
  transferencia_id: string;
  referencia_id: number;
  fecha: Date;
  tipo: string;
  referencia: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_TRANSFERENCIA_DETALLE,
      variables: transferenciaDetalle,
    });
    return data.addTransferenciaDetalle;
  } catch (error) {
    throw new Error(`Error adding transferencia detalle: ${error}`);
  }
};

export const updateTransferenciaDetalleService = async (transferenciaDetalle: {
  id: string;
  transferencia_id?: string;
  referencia_id?: number;
  fecha?: Date;
  tipo?: string;
  referencia?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_TRANSFERENCIA_DETALLE,
      variables: {
        updateTransferenciaDetalleId: transferenciaDetalle.id,
        ...transferenciaDetalle,
      },
    });
    return data.updateTransferenciaDetalle;
  } catch (error) {
    throw new Error(`Error updating transferencia detalle: ${error}`);
  }
};

export const deleteTransferenciaDetalleService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_TRANSFERENCIA_DETALLE,
      variables: { deleteTransferenciaDetalleId: id },
    });
    return data.deleteTransferenciaDetalle;
  } catch (error) {
    throw new Error(`Error deleting transferencia detalle: ${error}`);
  }
};
