import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_SOLICITUD_ALMACENES_QUERY = gql`
  query ListSolicitudAlmacenes {
    listSolicitudAlmacenes {
      id
      usuario_id
      requerimiento_id
      almacen_origen_id
      almacen_destino_id
      fecha
    }
  }
`;

const ADD_SOLICITUD_ALMACEN_MUTATION = gql`
  mutation AddSolicitudAlmacen(
    $usuarioId: ID!
    $requerimientoId: ID!
    $almacenOrigenId: ID!
    $almacenDestinoId: ID!
    $fecha: DateTime!
  ) {
    addSolicitudAlmacen(
      usuario_id: $usuarioId
      requerimiento_id: $requerimientoId
      almacen_origen_id: $almacenOrigenId
      almacen_destino_id: $almacenDestinoId
      fecha: $fecha
    ) {
      id
      usuario_id
      requerimiento_id
      almacen_origen_id
      almacen_destino_id
      fecha
    }
  }
`;

const UPDATE_SOLICITUD_ALMACEN_MUTATION = gql`
  mutation UpdateSolicitudAlmacen($updateSolicitudAlmacenId: ID!, $usuarioId: ID!, $requerimientoId: ID!, $almacenOrigenId: ID!, $almacenDestinoId: ID!, $fecha: DateTime!) {
    updateSolicitudAlmacen(id: $updateSolicitudAlmacenId, usuario_id: $usuarioId, requerimiento_id: $requerimientoId, almacen_origen_id: $almacenOrigenId, almacen_destino_id: $almacenDestinoId, fecha: $fecha) {
      id
      usuario_id
      requerimiento_id
      almacen_origen_id
      almacen_destino_id
      fecha
    }
  }
`;

const DELETE_SOLICITUD_ALMACEN_MUTATION = gql`
  mutation DeleteSolicitudAlmacen($deleteSolicitudAlmacenId: ID!) {
    deleteSolicitudAlmacen(id: $deleteSolicitudAlmacenId) {
      id
    }
  }
`;

export const listSolicitudAlmacenesService = async () => {
  try {
    const response = await client.query({
      query: LIST_SOLICITUD_ALMACENES_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listSolicitudAlmacenes;
  } catch (error) {
    console.error('Error al obtener la lista de solicitudes:', error);
    throw error;
  }
};

export const addSolicitudAlmacenService = async (solicitudData: {
  usuarioId: string;
  requerimientoId: string;
  almacenOrigenId: string;
  almacenDestinoId: string;
  fecha: Date;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_SOLICITUD_ALMACEN_MUTATION,
      variables: {
        usuarioId: solicitudData.usuarioId,
        requerimientoId: solicitudData.requerimientoId,
        almacenOrigenId: solicitudData.almacenOrigenId,
        almacenDestinoId: solicitudData.almacenDestinoId,
        fecha: solicitudData.fecha,
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addSolicitudAlmacen;
  } catch (error) {
    console.error('Error al crear la solicitud de almacén:', error);
    throw error;
  }
};

export const updateSolicitudAlmacenService = async (solicitudData: {
  updateSolicitudAlmacenId: string;
  usuarioId: string;
  requerimientoId: string;
  almacenOrigenId: string;
  almacenDestinoId: string;
  fecha: Date;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_SOLICITUD_ALMACEN_MUTATION,
      variables: solicitudData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateSolicitudAlmacen;
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
    throw error;
  }
};

export const deleteSolicitudAlmacenService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_SOLICITUD_ALMACEN_MUTATION,
      variables: { deleteSolicitudAlmacenId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteSolicitudAlmacen;
  } catch (error) {
    console.error('Error al eliminar la solicitud:', error);
    throw error;
  }
};
