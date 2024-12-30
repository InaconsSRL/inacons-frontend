import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_SOLICITUD_ALMACENES_QUERY = gql`
  query ListSolicitudAlmacenes {
    listSolicitudAlmacenes {
      id
      usuario_id {
        id
        nombres
        apellidos
      }
      requerimiento_id {
        id
        usuario
        obra_id
        fecha_solicitud
        fecha_final
        estado_atencion
        codigo
      }
      obra_origen_id {
        id
        nombre
        titulo
      }
      obra_destino_id {
        id
        nombre
        titulo
      }
      estado
      fecha
    }
  }
`;

const ADD_SOLICITUD_ALMACEN_MUTATION = gql`
  mutation AddSolicitudAlmacen(
    $usuarioId: ID!,
    $requerimientoId: ID!,
    $obraOrigenId: ID!,
    $obraDestinoId: ID!,
    $estado: String!
  ) {
    addSolicitudAlmacen(
      usuario_id: $usuarioId,
      requerimiento_id: $requerimientoId,
      obra_origen_id: $obraOrigenId,
      obra_destino_id: $obraDestinoId,
      estado: $estado
    ) {
      id
      usuario_id {
        id
        nombres
        apellidos
      }
      requerimiento_id {
        id
        usuario
        obra_id
        fecha_solicitud
        fecha_final
        estado_atencion
        codigo
      }
      obra_origen_id {
        id
        nombre
        titulo
      }
      obra_destino_id {
        id
        nombre
        titulo
      }
      estado
      fecha
    }
  }
`;

const UPDATE_SOLICITUD_ALMACEN_MUTATION = gql`
  mutation UpdateSolicitudAlmacen(
    $updateSolicitudAlmacenId: ID!,
    $usuarioId: ID!,
    $obraDestinoId: ID,
    $obraOrigenId: ID,
    $requerimientoId: ID,
    $estado: String
  ) {
    updateSolicitudAlmacen(
      id: $updateSolicitudAlmacenId,
      usuario_id: $usuarioId,
      obra_destino_id: $obraDestinoId,
      obra_origen_id: $obraOrigenId,
      requerimiento_id: $requerimientoId,
      estado: $estado
    ) {
      id
      usuario_id {
        id
        nombres
        apellidos
      }
      requerimiento_id {
        id
        usuario
        obra_id
        fecha_solicitud
        fecha_final
        estado_atencion
        codigo
      }
      obra_origen_id {
        id
        nombre
        titulo
      }
      obra_destino_id {
        id
        nombre
        titulo
      }
      estado
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
  usuario_id: string;
  requerimiento_id: string;
  obra_origen_id: string;
  obra_destino_id: string;
  estado: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_SOLICITUD_ALMACEN_MUTATION,
      variables: {
        usuarioId: solicitudData.usuario_id,
        requerimientoId: solicitudData.requerimiento_id,
        obraOrigenId: solicitudData.obra_origen_id,
        obraDestinoId: solicitudData.obra_destino_id,
        estado: solicitudData.estado || 'pendiente',
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
  usuario_id: string;
  requerimiento_id: string;
  obra_origen_id: string;
  obra_destino_id: string;
  estado: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_SOLICITUD_ALMACEN_MUTATION,
      variables: {
        updateSolicitudAlmacenId: solicitudData.updateSolicitudAlmacenId,
        usuarioId: solicitudData.usuario_id,
        requerimientoId: solicitudData.requerimiento_id,
        obraOrigenId: solicitudData.obra_origen_id,
        obraDestinoId: solicitudData.obra_destino_id,
        estado: solicitudData.estado,
      },
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
