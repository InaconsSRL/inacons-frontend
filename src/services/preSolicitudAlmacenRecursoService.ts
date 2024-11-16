import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PRE_SOLICITUD_ALMACEN_RECURSOS = gql`
  query ListPreSolicitudAlmacenRecursos {
    listPreSolicitudAlmacenRecursos {
      id
      pre_solicitud_almacen_id
      recurso_id
      cantidad
    }
  }
`;

const ADD_PRE_SOLICITUD_ALMACEN_RECURSO = gql`
  mutation AddPreSolicitudAlmacenRecurso($preSolicitudAlmacenId: ID!, $recursoId: ID!, $cantidad: Int!) {
    addPreSolicitudAlmacenRecurso(pre_solicitud_almacen_id: $preSolicitudAlmacenId, recurso_id: $recursoId, cantidad: $cantidad) {
      id
      pre_solicitud_almacen_id
      recurso_id
      cantidad
    }
  }
`;

const UPDATE_PRE_SOLICITUD_ALMACEN_RECURSO = gql`
  mutation UpdatePreSolicitudAlmacenRecurso($updatePreSolicitudAlmacenRecursoId: ID!, $preSolicitudAlmacenId: ID, $recursoId: ID, $cantidad: Int) {
    updatePreSolicitudAlmacenRecurso(id: $updatePreSolicitudAlmacenRecursoId, pre_solicitud_almacen_id: $preSolicitudAlmacenId, recurso_id: $recursoId, cantidad: $cantidad) {
      id
      pre_solicitud_almacen_id
      recurso_id
      cantidad
    }
  }
`;

const DELETE_PRE_SOLICITUD_ALMACEN_RECURSO = gql`
  mutation DeletePreSolicitudAlmacenRecurso($deletePreSolicitudAlmacenRecursoId: ID!) {
    deletePreSolicitudAlmacenRecurso(id: $deletePreSolicitudAlmacenRecursoId) {
      id
    }
  }
`;

const LIST_PRE_SOLICITUD_ALMACEN_RECURSOS_BY_PRE_SOLICITUD_ID = gql`
  query ListPreSolicitudAlmacenRecursosByPreSolicitudId($id: ID!) {
    listPreSolicitudAlmacenRecursosByPreSolicitudId(id: $id) {
      id
      pre_solicitud_almacen_id
      recurso_id
      cantidad
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

export const listPreSolicitudAlmacenRecursos = async () => {
  try {
    const { data } = await client.query({
      query: LIST_PRE_SOLICITUD_ALMACEN_RECURSOS,
    });
    return data.listPreSolicitudAlmacenRecursos;
  } catch (error) {
    throw new Error(`Error fetching pre solicitud almacen recursos: ${error}`);
  }
};

export const addPreSolicitudAlmacenRecurso = async (preSolicitudAlmacenId: string, recursoId: string, cantidad: number) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_PRE_SOLICITUD_ALMACEN_RECURSO,
      variables: { preSolicitudAlmacenId, recursoId, cantidad },
    });
    return data.addPreSolicitudAlmacenRecurso;
  } catch (error) {
    throw new Error(`Error adding pre solicitud almacen recurso: ${error}`);
  }
};

export const updatePreSolicitudAlmacenRecurso = async (id: string, preSolicitudAlmacenId?: string, recursoId?: string, cantidad?: number) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PRE_SOLICITUD_ALMACEN_RECURSO,
      variables: { updatePreSolicitudAlmacenRecursoId: id, preSolicitudAlmacenId, recursoId, cantidad },
    });
    return data.updatePreSolicitudAlmacenRecurso;
  } catch (error) {
    throw new Error(`Error updating pre solicitud almacen recurso: ${error}`);
  }
};

export const deletePreSolicitudAlmacenRecurso = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRE_SOLICITUD_ALMACEN_RECURSO,
      variables: { deletePreSolicitudAlmacenRecursoId: id },
    });
    return data.deletePreSolicitudAlmacenRecurso;
  } catch (error) {
    throw new Error(`Error deleting pre solicitud almacen recurso: ${error}`);
  }
};

export const listPreSolicitudAlmacenRecursosByPreSolicitudId = async (id: string) => {
  try {
    const { data } = await client.query({
      query: LIST_PRE_SOLICITUD_ALMACEN_RECURSOS_BY_PRE_SOLICITUD_ID,
      variables: { id },
    });
    return data.listPreSolicitudAlmacenRecursosByPreSolicitudId;
  } catch (error) {
    throw new Error(`Error fetching recursos by pre solicitud almacen id: ${error}`);
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
    throw new Error(`Error fetching pre solicitud by requerimiento: ${error}`);
  }
};