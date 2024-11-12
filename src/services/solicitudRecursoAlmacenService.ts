import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_SOLICITUD_RECURSO_ALMACENES_QUERY = gql`
  query ListSolicitudRecursoAlmacenes {
    listSolicitudRecursoAlmacenes {
      id
      recurso_id
      cantidad
      solicitud_almacen_id
    }
  }
`;

const ADD_SOLICITUD_RECURSO_ALMACEN_MUTATION = gql`
  mutation AddSolicitudRecursoAlmacen($recursoId: ID!, $cantidad: Int!, $solicitudAlmacenId: ID!) {
    addSolicitudRecursoAlmacen(recurso_id: $recursoId, cantidad: $cantidad, solicitud_almacen_id: $solicitudAlmacenId) {
      id
      recurso_id
      cantidad
      solicitud_almacen_id
    }
  }
`;

const UPDATE_SOLICITUD_RECURSO_ALMACEN_MUTATION = gql`
  mutation UpdateSolicitudRecursoAlmacen($updateSolicitudRecursoAlmacenId: ID!, $recursoId: ID!, $cantidad: Int!, $solicitudAlmacenId: ID!) {
    updateSolicitudRecursoAlmacen(id: $updateSolicitudRecursoAlmacenId, recurso_id: $recursoId, cantidad: $cantidad, solicitud_almacen_id: $solicitudAlmacenId) {
      id
      recurso_id
      cantidad
      solicitud_almacen_id
    }
  }
`;

const DELETE_SOLICITUD_RECURSO_ALMACEN_MUTATION = gql`
  mutation DeleteSolicitudRecursoAlmacen($deleteSolicitudRecursoAlmacenId: ID!) {
    deleteSolicitudRecursoAlmacen(id: $deleteSolicitudRecursoAlmacenId) {
      id
    }
  }
`;

export const listSolicitudRecursoAlmacenesService = async () => {
  try {
    const response = await client.query({
      query: LIST_SOLICITUD_RECURSO_ALMACENES_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listSolicitudRecursoAlmacenes;
  } catch (error) {
    console.error('Error al obtener la lista de solicitudes de recursos:', error);
    throw error;
  }
};

export const addSolicitudRecursoAlmacenService = async (data: { recursoId: string; cantidad: number; solicitudAlmacenId: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_SOLICITUD_RECURSO_ALMACEN_MUTATION,
      variables: data,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addSolicitudRecursoAlmacen;
  } catch (error) {
    console.error('Error al crear la solicitud de recurso:', error);
    throw error;
  }
};

export const updateSolicitudRecursoAlmacenService = async (data: { updateSolicitudRecursoAlmacenId: string; recursoId: string; cantidad: number; solicitudAlmacenId: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_SOLICITUD_RECURSO_ALMACEN_MUTATION,
      variables: data,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateSolicitudRecursoAlmacen;
  } catch (error) {
    console.error('Error al actualizar la solicitud de recurso:', error);
    throw error;
  }
};

export const deleteSolicitudRecursoAlmacenService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_SOLICITUD_RECURSO_ALMACEN_MUTATION,
      variables: { deleteSolicitudRecursoAlmacenId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteSolicitudRecursoAlmacen;
  } catch (error) {
    console.error('Error al eliminar la solicitud de recurso:', error);
    throw error;
  }
};
