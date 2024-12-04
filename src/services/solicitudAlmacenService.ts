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
        codigo
        estado_atencion
        fecha_final
        fecha_solicitud
        obra_id
        presupuesto_id
        sustento
        usuario_id
      }
      almacen_origen_id {
        id
        nombre
      }
      almacen_destino_id {
        id
        nombre
        estado
        direccion
      }
      fecha
    }
  }
`;

const ADD_SOLICITUD_ALMACEN_MUTATION = gql`
  mutation AddSolicitudAlmacen(
    $usuario_id: ID!
    $requerimiento_id: ID!
    $almacen_origen_id: ID!
    $fecha: DateTime
  ) {
    addSolicitudAlmacen(
      usuario_id: $usuario_id
      requerimiento_id: $requerimiento_id
      almacen_origen_id: $almacen_origen_id
      fecha: $fecha
    ) {
      id
      usuario_id {
        id
        nombres
        apellidos
      }
      requerimiento_id {
        id
        codigo
        estado_atencion
        fecha_final
        fecha_solicitud
        obra_id
        presupuesto_id
        sustento
        usuario_id
      }
      almacen_origen_id {
        id
        nombre
      }
      almacen_destino_id {
        id
        nombre
        estado
        direccion
      }
      fecha
    }
  }
`;

const UPDATE_SOLICITUD_ALMACEN_MUTATION = gql`
  mutation UpdateSolicitudAlmacen(
    $updateSolicitudAlmacenId: ID!
    $usuario_id: ID!
    $requerimiento_id: ID
    $almacen_origen_id: ID
    $fecha: DateTime
  ) {
    updateSolicitudAlmacen(
      id: $updateSolicitudAlmacenId
      usuario_id: $usuario_id
      requerimiento_id: $requerimiento_id
      almacen_origen_id: $almacen_origen_id
      fecha: $fecha
    ) {
      id
      usuario_id {
        id
        nombres
        apellidos
      }
      requerimiento_id {
        id
        codigo
        estado_atencion
        fecha_final
        fecha_solicitud
        obra_id
        presupuesto_id
        sustento
        usuario_id
      }
      almacen_origen_id {
        id
        nombre
      }
      almacen_destino_id {
        id
        nombre
        estado
        direccion
      }
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
  almacen_origen_id: string;
  fecha: Date;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_SOLICITUD_ALMACEN_MUTATION,
      variables: {
        usuario_id: solicitudData.usuario_id,
        requerimiento_id: solicitudData.requerimiento_id,
        almacen_origen_id: solicitudData.almacen_origen_id,
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
  usuario_id: string;
  requerimiento_id: string;
  almacen_origen_id: string;
  fecha: Date;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_SOLICITUD_ALMACEN_MUTATION,
      variables: {
        updateSolicitudAlmacenId: solicitudData.updateSolicitudAlmacenId,
        usuario_id: solicitudData.usuario_id,
        requerimiento_id: solicitudData.requerimiento_id,
        almacen_origen_id: solicitudData.almacen_origen_id,
        fecha: solicitudData.fecha,
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
