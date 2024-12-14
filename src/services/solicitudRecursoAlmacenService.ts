import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_SOLICITUD_RECURSO_ALMACENES_QUERY = gql`
  query ListSolicitudRecursoAlmacenes {
    listSolicitudRecursoAlmacenes {
     id
     costo
     recurso_id {
        cantidad
        codigo
        descripcion
        id
        nombre
        precio_actual
        vigente
        unidad_id
     }
     cantidad
     solicitud_almacen_id {
        id
        fecha
     }
    }
}
`;

const ADD_SOLICITUD_RECURSO_ALMACEN_MUTATION = gql`
  mutation AddSolicitudRecursoAlmacen($recurso_id: ID!, $cantidad: Int!,$costo: Float!, $solicitud_almacen_id: ID!) {
    addSolicitudRecursoAlmacen(recurso_id: $recurso_id, cantidad: $cantidad, costo: $costo, solicitud_almacen_id: $solicitud_almacen_id) {
      id
      costo
      recurso_id {
        cantidad
        codigo
        descripcion
        id
        imagenes {
          file
        }
        nombre
        precio_actual
        vigente
        unidad_id
      }
      cantidad
      solicitud_almacen_id {
        id
        fecha
     }
    }
  }
`;

const UPDATE_SOLICITUD_RECURSO_ALMACEN_MUTATION = gql`
  mutation UpdateSolicitudRecursoAlmacen($updateSolicitudRecursoAlmacenId: ID!, $recursoId: ID!, $cantidad: Int!, $costo: Float, $solicitudAlmacenId: ID!) {
    updateSolicitudRecursoAlmacen(id: $updateSolicitudRecursoAlmacenId, recurso_id: $recursoId, costo: $costo, cantidad: $cantidad, solicitud_almacen_id: $solicitudAlmacenId) {
      id
      costo
      recurso_id {
        cantidad
        codigo
        descripcion
        id
        imagenes {
          file
        }
        nombre
        precio_actual
        vigente
        unidad_id
      }
      cantidad
      solicitud_almacen_id {
        id
        fecha
     }
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

const GET_ORDEN_SOLICITUD_RECURSO_BY_ID = gql`
  query GetOrdenSolicitudRecursoforSolicitudId($getOrdenSolicitudRecursoforSolicitudIdId: ID!) {
    getOrdenSolicitudRecursoforSolicitudId(id: $getOrdenSolicitudRecursoforSolicitudIdId) {
      id
      costo
      recurso_id {
        id
        codigo
        nombre
        descripcion
        cantidad
        unidad_id
        precio_actual
        vigente
      }
      cantidad
      solicitud_almacen_id {
        id
        fecha
      }
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

export const addSolicitudRecursoAlmacenService = async (data: {
  recurso_id: string;
  cantidad: number;
  solicitud_almacen_id: string;
  costo: number;
}) => {
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
    console.error('Error al crear la solicitud de recurso de almacén:', error);
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

export const getOrdenSolicitudRecursoByIdService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_ORDEN_SOLICITUD_RECURSO_BY_ID,
      variables: { getOrdenSolicitudRecursoforSolicitudIdId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getOrdenSolicitudRecursoforSolicitudId;
  } catch (error) {
    console.error('Error al obtener la orden de solicitud de recurso:', error);
    throw error;
  }
};
