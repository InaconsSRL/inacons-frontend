import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PAGOS_ORDEN_PAGO = gql`
  query ListPagosOrdenPago {
    listPagosOrdenPago {
      id
      fecha_pago
      monto
      tipo_monedas
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
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
    }
  }
`;

const GET_PAGOS_BY_ORDEN_PAGO = gql`
  query GetPagosByOrdenPago($ordenPagoId: ID!) {
    getPagosByOrdenPago(ordenPagoId: $ordenPagoId) {
      id
      fecha_pago
      monto
      tipo_monedas
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
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
    }
  }
`;

const ADD_PAGO_ORDEN_PAGO = gql`
  mutation AddPagoOrdenPago(
    $fecha_pago: String!
    $monto: Float!
    $tipo_monedas: String!
    $orden_pago_id: ID!
    $usuario_id: ID!
  ) {
    addPagoOrdenPago(
      fecha_pago: $fecha_pago
      monto: $monto
      tipo_monedas: $tipo_monedas
      orden_pago_id: $orden_pago_id
      usuario_id: $usuario_id
    ) {
      id
      fecha_pago
      monto
      tipo_monedas
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
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
    }
  }
`;

const UPDATE_PAGO_ORDEN_PAGO = gql`
  mutation UpdatePagoOrdenPago(
    $id: ID!
    $fecha_pago: String!
    $monto: Float!
    $tipo_monedas: String!
    $orden_pago_id: ID!
    $usuario_id: ID!
  ) {
    updatePagoOrdenPago(
      id: $id
      fecha_pago: $fecha_pago
      monto: $monto
      tipo_monedas: $tipo_monedas
      orden_pago_id: $orden_pago_id
      usuario_id: $usuario_id
    ) {
      id
      fecha_pago
      monto
      tipo_monedas
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
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
    }
  }
`;

const DELETE_PAGO_ORDEN_PAGO = gql`
  mutation DeletePagoOrdenPago($id: ID!) {
    deletePagoOrdenPago(id: $id) {
      id
    }
  }
`;

export interface PagoOrdenPagoInput {
  fecha_pago: string;
  monto: number;
  tipo_monedas: string;
  orden_pago_id: string;
  usuario_id: string;
}

// Servicios
export const listPagosOrdenPagoService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_PAGOS_ORDEN_PAGO,
    });
    return data.listPagosOrdenPago;
  } catch (error) {
    throw new Error(`Error fetching pagos orden pago: ${error}`);
  }
};

export const getPagosByOrdenPagoService = async (ordenPagoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_PAGOS_BY_ORDEN_PAGO,
      variables: { ordenPagoId },
    });
    return data.getPagosByOrdenPago;
  } catch (error) {
    throw new Error(`Error fetching pagos by orden pago: ${error}`);
  }
};

export const addPagoOrdenPagoService = async (input: PagoOrdenPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_PAGO_ORDEN_PAGO,
      variables: input,
    });
    return data.addPagoOrdenPago;
  } catch (error) {
    throw new Error(`Error adding pago orden pago: ${error}`);
  }
};

export const updatePagoOrdenPagoService = async (id: string, input: PagoOrdenPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PAGO_ORDEN_PAGO,
      variables: { id, ...input },
    });
    return data.updatePagoOrdenPago;
  } catch (error) {
    throw new Error(`Error updating pago orden pago: ${error}`);
  }
};

export const deletePagoOrdenPagoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PAGO_ORDEN_PAGO,
      variables: { id },
    });
    return data.deletePagoOrdenPago;
  } catch (error) {
    throw new Error(`Error deleting pago orden pago: ${error}`);
  }
};
