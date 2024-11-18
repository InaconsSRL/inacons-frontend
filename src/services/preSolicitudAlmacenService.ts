import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PRE_SOLICITUDES_QUERY = gql`
  query ListPreSolicitudAlmacenes {
    listPreSolicitudAlmacenes {
      id
      requerimiento_id
      fecha
      usuario_id
      almacen_id
    }
  }
`;

const ADD_PRE_SOLICITUD_MUTATION = gql`
  mutation AddPreSolicitudAlmacen($requerimientoId: ID!, $usuarioId: ID!, $almacenId: ID!, $fecha: DateTime!) {
    addPreSolicitudAlmacen(requerimiento_id: $requerimientoId, usuario_id: $usuarioId, almacen_id: $almacenId, fecha: $fecha) {
      id
      requerimiento_id
      fecha
      usuario_id
      almacen_id
    }
  }
`;

const UPDATE_PRE_SOLICITUD_MUTATION = gql`
  mutation UpdatePreSolicitudAlmacen($updatePreSolicitudAlmacenId: ID!, $requerimientoId: ID, $usuarioId: ID, $almacenId: ID) {
    updatePreSolicitudAlmacen(id: $updatePreSolicitudAlmacenId, requerimiento_id: $requerimientoId, usuario_id: $usuarioId, almacen_id: $almacenId) {
      id
      requerimiento_id
      fecha
      usuario_id
      almacen_id
    }
  }
`;

const DELETE_PRE_SOLICITUD_MUTATION = gql`
  mutation DeletePreSolicitudAlmacen($deletePreSolicitudAlmacenId: ID!) {
    deletePreSolicitudAlmacen(id: $deletePreSolicitudAlmacenId) {
      id
    }
  }
`;

const FIND_PRE_SOLICITUD_BY_REQUERIMIENTO = gql`
  query FindPreSolicitudByRequerimiento($requerimientoId: ID!) {
    findPreSolicitudByRequerimiento(requerimiento_id: $requerimientoId) {
      id
      requerimiento_id
      usuario_id
      almacen_id
      recursos {
        cantidad
        recurso_id
      }
    }
  }
`;

export const listPreSolicitudesService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_PRE_SOLICITUDES_QUERY,
    });
    return data.listPreSolicitudAlmacenes;
  } catch (error) {
    throw new Error(`Error fetching pre-solicitudes: ${error}`);
  }
};

export const addPreSolicitudService = async (preSolicitudData: {
  requerimiento_id: string;
  usuario_id: string;
  almacen_id: string;
  fecha: Date;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_PRE_SOLICITUD_MUTATION,
      variables: {
        requerimientoId: preSolicitudData.requerimiento_id,
        usuarioId: preSolicitudData.usuario_id,
        almacenId: preSolicitudData.almacen_id,
        fecha: preSolicitudData.fecha,
      },
    });
    return data.addPreSolicitudAlmacen;
  } catch (error) {
    throw new Error(`Error adding pre-solicitud: ${error}`);
  }
};

export const updatePreSolicitudService = async (preSolicitudData: {
  id: string;
  requerimiento_id?: string;
  usuario_id?: string;
  almacen_id?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PRE_SOLICITUD_MUTATION,
      variables: {
        updatePreSolicitudAlmacenId: preSolicitudData.id,
        requerimientoId: preSolicitudData.requerimiento_id,
        usuarioId: preSolicitudData.usuario_id,
        almacenId: preSolicitudData.almacen_id,
      },
    });
    return data.updatePreSolicitudAlmacen;
  } catch (error) {
    throw new Error(`Error updating pre-solicitud: ${error}`);
  }
};

export const deletePreSolicitudService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRE_SOLICITUD_MUTATION,
      variables: { deletePreSolicitudAlmacenId: id },
    });
    return data.deletePreSolicitudAlmacen;
  } catch (error) {
    throw new Error(`Error deleting pre-solicitud: ${error}`);
  }
};

export const findPreSolicitudByRequerimiento = async (requerimientoId: string) => {
  try {
    const { data } = await client.query({
      query: FIND_PRE_SOLICITUD_BY_REQUERIMIENTO,
      variables: { requerimientoId },
    });
    return data.findPreSolicitudByRequerimiento;
  } catch (error) {
    throw new Error(`Error al obtener la pre-solicitud por requerimiento: ${error}`);
  }
};