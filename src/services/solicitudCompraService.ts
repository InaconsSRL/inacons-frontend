
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_SOLICITUDES_COMPRAS = gql`
  query ListSolicitudesCompras {
    listSolicitudesCompras {
      id
      requerimiento_id {
        id
        presupuesto_id
        fecha_solicitud
        fecha_final
        estado_atencion
        sustento
        obra_id
        codigo
      }
      usuario_id {
        apellidos
        nombres
        id
      }
      fecha
    }
  }
`;

const GET_SOLICITUD_COMPRA = gql`
  query GetSolicitudCompra($getSolicitudCompraId: ID!) {
    getSolicitudCompra(id: $getSolicitudCompraId) {
      id
      requerimiento_id {
        id
        presupuesto_id
        fecha_solicitud
        fecha_final
        estado_atencion
        sustento
        obra_id
        codigo
      }
      usuario_id {
        apellidos
        nombres
        id
      }
      fecha
    }
  }
`;

const ADD_SOLICITUD_COMPRA = gql`
  mutation AddSolicitudCompra($requerimientoId: ID!, $usuarioId: ID!, $fecha: DateTime) {
    addSolicitudCompra(requerimiento_id: $requerimientoId, usuario_id: $usuarioId, fecha: $fecha) {
      id
      requerimiento_id {
        id
        presupuesto_id
        fecha_solicitud
        fecha_final
        estado_atencion
        sustento
        obra_id
        codigo
      }
      usuario_id {
        apellidos
        nombres
        id
      }
      fecha
    }
  }
`;

const UPDATE_SOLICITUD_COMPRA = gql`
  mutation UpdateSolicitudCompra($updateSolicitudCompraId: ID!, $requerimientoId: ID, $usuarioId: ID, $fecha: DateTime) {
    updateSolicitudCompra(id: $updateSolicitudCompraId, requerimiento_id: $requerimientoId, usuario_id: $usuarioId, fecha: $fecha) {
      id
      requerimiento_id {
        id
        presupuesto_id
        fecha_solicitud
        fecha_final
        estado_atencion
        sustento
        obra_id
        codigo
      }
      usuario_id {
        apellidos
        nombres
        id
      }
      fecha
    }
  }
`;

const DELETE_SOLICITUD_COMPRA = gql`
  mutation DeleteSolicitudCompra($deleteSolicitudCompraId: ID!) {
    deleteSolicitudCompra(id: $deleteSolicitudCompraId) {
      id
    }
  }
`;

export const listSolicitudesComprasService = async () => {
  const { data } = await client.query({ query: LIST_SOLICITUDES_COMPRAS });
  return data.listSolicitudesCompras;
};

export const getSolicitudCompraService = async (id: string) => {
  const { data } = await client.query({
    query: GET_SOLICITUD_COMPRA,
    variables: { getSolicitudCompraId: id }
  });
  return data.getSolicitudCompra;
};

export const addSolicitudCompraService = async (solicitudData: {
  requerimientoId: string;
  usuarioId: string;
  fecha: Date;
}) => {
  const { data } = await client.mutate({
    mutation: ADD_SOLICITUD_COMPRA,
    variables: solicitudData
  });
  return data.addSolicitudCompra;
};

export const updateSolicitudCompraService = async (solicitudData: {
  id: string;
  requerimientoId?: string;
  usuarioId?: string;
  fecha?: Date;
}) => {
  const { data } = await client.mutate({
    mutation: UPDATE_SOLICITUD_COMPRA,
    variables: {
      updateSolicitudCompraId: solicitudData.id,
      ...solicitudData
    }
  });
  return data.updateSolicitudCompra;
};

export const deleteSolicitudCompraService = async (id: string) => {
  const { data } = await client.mutate({
    mutation: DELETE_SOLICITUD_COMPRA,
    variables: { deleteSolicitudCompraId: id }
  });
  return data.deleteSolicitudCompra;
};