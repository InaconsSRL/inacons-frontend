import { gql } from '@apollo/client';
import client from '../apolloClient';

// Definición de las consultas GraphQL
const LIST_ORDEN_PAGO_DESCUENTOS = gql`
  query ListOrdenesPagoDescuento {
    listOrdenesPagoDescuento {
      id
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
      codigo
      monto
      tipo
      detalle
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

const ADD_ORDEN_PAGO_DESCUENTO = gql`
  mutation AddOrdenPagoDescuento(
    $orden_pago_id: ID!
    $monto: Float!
    $tipo: String!
    $detalle: String!
    $usuario_id: ID!
  ) {
    addOrdenPagoDescuento(
      orden_pago_id: $orden_pago_id
      monto: $monto
      tipo: $tipo
      detalle: $detalle
      usuario_id: $usuario_id
    ) {
      id
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
      codigo
      monto
      tipo
      detalle
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

const UPDATE_ORDEN_PAGO_DESCUENTO = gql`
  mutation UpdateOrdenPagoDescuento(
    $id: ID!
    $orden_pago_id: ID!
    $codigo: String!
    $monto: Float!
    $tipo: String!
    $detalle: String!
    $usuario_id: ID!
  ) {
    updateOrdenPagoDescuento(
      id: $id
      orden_pago_id: $orden_pago_id
      codigo: $codigo
      monto: $monto
      tipo: $tipo
      detalle: $detalle
      usuario_id: $usuario_id
    ) {
      id
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
      codigo
      monto
      tipo
      detalle
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

const DELETE_ORDEN_PAGO_DESCUENTO = gql`
  mutation DeleteOrdenPagoDescuento($id: ID!) {
    deleteOrdenPagoDescuento(id: $id) {
      id
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
      codigo
      monto
      tipo
      detalle
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

const GET_DESCUENTOS_BY_ORDEN_PAGO = gql`
  query GetDescuentosByOrdenPago($ordenPagoId: ID!) {
    getDescuentosByOrdenPago(ordenPagoId: $ordenPagoId) {
      id
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
      codigo
      monto
      tipo
      detalle
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
      }
    }
  }
`;


// Interface para el input
interface OrdenPagoDescuentoInput {
  orden_pago_id: string;
  monto: number;
  tipo: string;
  detalle: string;
  usuario_id: string;
  codigo?: string;
}

// Servicios
export const listOrdenPagoDescuentosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_ORDEN_PAGO_DESCUENTOS,
    });
    return data.listOrdenesPagoDescuento;
  } catch (error) {
    throw new Error(`Error al obtener los descuentos de orden de pago: ${error}`);
  }
};

export const addOrdenPagoDescuentoService = async (input: OrdenPagoDescuentoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_ORDEN_PAGO_DESCUENTO,
      variables: input,
    });
    return data.addOrdenPagoDescuento;
  } catch (error) {
    throw new Error(`Error al agregar descuento de orden de pago: ${error}`);
  }
};

export const updateOrdenPagoDescuentoService = async (id: string, input: OrdenPagoDescuentoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_ORDEN_PAGO_DESCUENTO,
      variables: { id, ...input },
    });
    return data.updateOrdenPagoDescuento;
  } catch (error) {
    throw new Error(`Error al actualizar descuento de orden de pago: ${error}`);
  }
};

export const deleteOrdenPagoDescuentoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_ORDEN_PAGO_DESCUENTO,
      variables: { id },
    });
    return data.deleteOrdenPagoDescuento;
  } catch (error) {
    throw new Error(`Error al eliminar descuento de orden de pago: ${error}`);
  }
};

export const getDescuentosByOrdenPagoService = async (ordenPagoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_DESCUENTOS_BY_ORDEN_PAGO,
      variables: { ordenPagoId },
    });
    return data.getDescuentosByOrdenPago;
  } catch (error) {
    throw new Error(`Error al obtener los descuentos de la orden de pago: ${error}`);
  }
};
