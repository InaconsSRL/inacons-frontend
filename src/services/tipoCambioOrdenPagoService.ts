import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TIPOS_CAMBIO = gql`
  query ListTiposCambio {
    listTiposCambio {
      id
      cambio
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        observaciones
        comprobante
        fecha
      }
    }
  }
`;

const GET_TIPO_CAMBIO_BY_ORDEN_PAGO = gql`
  query GetTipoCambioByOrdenPago($ordenPagoId: ID!) {
    getTipoCambioByOrdenPago(ordenPagoId: $ordenPagoId) {
      id
      cambio
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        observaciones
        comprobante
        fecha
      }
    }
  }
`;

const ADD_TIPO_CAMBIO = gql`
  mutation AddTipoCambio($orden_pago_id: ID!, $cambio: Float!) {
    addTipoCambio(orden_pago_id: $orden_pago_id, cambio: $cambio) {
      id
      cambio
      orden_pago_id {
        id
        codigo
        monto_solicitado
      }
    }
  }
`;

const UPDATE_TIPO_CAMBIO = gql`
  mutation UpdateTipoCambio($id: ID!, $orden_pago_id: ID, $cambio: Float) {
    updateTipoCambio(id: $id, orden_pago_id: $orden_pago_id, cambio: $cambio) {
      id
      cambio
      orden_pago_id {
        id
        codigo
        monto_solicitado
      }
    }
  }
`;

const DELETE_TIPO_CAMBIO = gql`
  mutation DeleteTipoCambio($id: ID!) {
    deleteTipoCambio(id: $id) {
      id
    }
  }
`;

export interface TipoCambioInput {
  orden_pago_id: string;
  cambio: number;
}

export const listTiposCambioService = async () => {
  try {
    const { data } = await client.query({ query: LIST_TIPOS_CAMBIO });
    return data.listTiposCambio;
  } catch (error) {
    throw new Error(`Error fetching tipos cambio: ${error}`);
  }
};

export const getTipoCambioByOrdenPagoService = async (ordenPagoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_TIPO_CAMBIO_BY_ORDEN_PAGO,
      variables: { ordenPagoId },
    });
    return data.getTipoCambioByOrdenPago;
  } catch (error) {
    throw new Error(`Error fetching tipo cambio by orden pago: ${error}`);
  }
};

export const addTipoCambioService = async (input: TipoCambioInput) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_TIPO_CAMBIO,
      variables: input,
    });
    return data.addTipoCambio;
  } catch (error) {
    throw new Error(`Error adding tipo cambio: ${error}`);
  }
};

export const updateTipoCambioService = async (id: string, input: Partial<TipoCambioInput>) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_TIPO_CAMBIO,
      variables: { id, ...input },
    });
    return data.updateTipoCambio;
  } catch (error) {
    throw new Error(`Error updating tipo cambio: ${error}`);
  }
};

export const deleteTipoCambioService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_TIPO_CAMBIO,
      variables: { id },
    });
    return data.deleteTipoCambio;
  } catch (error) {
    throw new Error(`Error deleting tipo cambio: ${error}`);
  }
};
