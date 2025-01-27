import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_APROBACIONES_ORDEN_PAGO = gql`
  query ListAprobacionesOrdenPago {
    listAprobacionesOrdenPago {
      id
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      estado
      fecha
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

const ADD_APROBACION_ORDEN_PAGO = gql`
  mutation AddAprobacionOrdenPago(
    $usuario_id: ID!
    $estado: String!
    $orden_pago_id: ID!
  ) {
    addAprobacionOrdenPago(
      usuario_id: $usuario_id
      estado: $estado
      orden_pago_id: $orden_pago_id
    ) {
      id
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      estado
      fecha
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

const UPDATE_APROBACION_ORDEN_PAGO = gql`
  mutation UpdateAprobacionOrdenPago(
    $id: ID!
    $usuario_id: ID!
    $estado: String!
    $fecha: String!
    $orden_pago_id: ID!
  ) {
    updateAprobacionOrdenPago(
      id: $id
      usuario_id: $usuario_id
      estado: $estado
      fecha: $fecha
      orden_pago_id: $orden_pago_id
    ) {
      id
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      estado
      fecha
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

const DELETE_APROBACION_ORDEN_PAGO = gql`
  mutation DeleteAprobacionOrdenPago($id: ID!) {
    deleteAprobacionOrdenPago(id: $id) {
      id
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      estado
      fecha
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

// Agregar nueva consulta GraphQL
const GET_APROBACIONES_BY_ORDEN_PAGO = gql`
  query GetAprobacionesByOrdenPago($ordenPagoId: ID!) {
    getAprobacionesByOrdenPago(ordenPagoId: $ordenPagoId) {
      id
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      estado
      fecha
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

export interface AprobacionOrdenPagoInput {
  usuario_id: string;
  estado: string;
  orden_pago_id: string;
}

export const listAprobacionesOrdenPagoService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_APROBACIONES_ORDEN_PAGO,
    });
    return data.listAprobacionesOrdenPago;
  } catch (error) {
    throw new Error(`Error fetching aprobaciones orden pago: ${error}`);
  }
};

export const addAprobacionOrdenPagoService = async (input: AprobacionOrdenPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_APROBACION_ORDEN_PAGO,
      variables: input, // Ya no enviamos la fecha, el backend la manejará
    });
    return data.addAprobacionOrdenPago;
  } catch (error) {
    throw new Error(`Error adding aprobacion orden pago: ${error}`);
  }
};

export const updateAprobacionOrdenPagoService = async (id: string, input: AprobacionOrdenPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_APROBACION_ORDEN_PAGO,
      variables: { id, ...input },
    });
    return data.updateAprobacionOrdenPago;
  } catch (error) {
    throw new Error(`Error updating aprobacion orden pago: ${error}`);
  }
};

export const deleteAprobacionOrdenPagoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_APROBACION_ORDEN_PAGO,
      variables: { id },
    });
    return data.deleteAprobacionOrdenPago;
  } catch (error) {
    throw new Error(`Error deleting aprobacion orden pago: ${error}`);
  }
};

// Agregar nuevo servicio
export const getAprobacionesByOrdenPagoService = async (ordenPagoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_APROBACIONES_BY_ORDEN_PAGO,
      variables: { ordenPagoId },
    });
    return data.getAprobacionesByOrdenPago;
  } catch (error) {
    throw new Error(`Error fetching aprobaciones by orden pago: ${error}`);
  }
};
