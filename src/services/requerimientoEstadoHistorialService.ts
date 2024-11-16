
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_REQUERIMIENTO_ESTADO_HISTORIALES = gql`
  query ListRequerimientoEstadoHistoriales {
    listRequerimientoEstadoHistoriales {
      id
      requerimiento_id
      estado_anterior
      estado_nuevo
      fecha_cambio
      usuario_id
      comentario
    }
  }
`;

const ADD_REQUERIMIENTO_ESTADO_HISTORIAL = gql`
  mutation AddRequerimientoEstadoHistorial(
    $requerimientoId: ID!, 
    $estadoAnterior: String!, 
    $estadoNuevo: String!, 
    $fechaCambio: DateTime!, 
    $usuarioId: ID!, 
    $comentario: String!
  ) {
    addRequerimientoEstadoHistorial(
      requerimiento_id: $requerimientoId,
      estado_anterior: $estadoAnterior,
      estado_nuevo: $estadoNuevo,
      fecha_cambio: $fechaCambio,
      usuario_id: $usuarioId,
      comentario: $comentario
    ) {
      id
      requerimiento_id
      estado_anterior
      estado_nuevo
      fecha_cambio
      usuario_id
      comentario
    }
  }
`;

const UPDATE_REQUERIMIENTO_ESTADO_HISTORIAL = gql`
  mutation UpdateRequerimientoEstadoHistorial(
    $updateRequerimientoEstadoHistorialId: ID!,
    $requerimientoId: ID!,
    $estadoAnterior: String!,
    $estadoNuevo: String!,
    $fechaCambio: DateTime!,
    $usuarioId: ID!,
    $comentario: String!
  ) {
    updateRequerimientoEstadoHistorial(
      id: $updateRequerimientoEstadoHistorialId,
      requerimiento_id: $requerimientoId,
      estado_anterior: $estadoAnterior,
      estado_nuevo: $estadoNuevo,
      fecha_cambio: $fechaCambio,
      usuario_id: $usuarioId,
      comentario: $comentario
    ) {
      id
      requerimiento_id
      estado_anterior
      estado_nuevo
      fecha_cambio
      usuario_id
      comentario
    }
  }
`;

const DELETE_REQUERIMIENTO_ESTADO_HISTORIAL = gql`
  mutation DeleteRequerimientoEstadoHistorial($deleteRequerimientoEstadoHistorialId: ID!) {
    deleteRequerimientoEstadoHistorial(id: $deleteRequerimientoEstadoHistorialId) {
      id
    }
  }
`;

export const listRequerimientoEstadoHistorialesService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_REQUERIMIENTO_ESTADO_HISTORIALES,
    });
    return data.listRequerimientoEstadoHistoriales;
  } catch (error) {
    throw new Error(`Error fetching requerimiento estado historiales: ${error}`);
  }
};

export interface AddHistorialData {
  requerimientoId: string;
  estadoAnterior: string;
  estadoNuevo: string;
  fechaCambio: Date;
  usuarioId: string;
  comentario: string;
}

export const addRequerimientoEstadoHistorialService = async (historialData: AddHistorialData) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_REQUERIMIENTO_ESTADO_HISTORIAL,
      variables: historialData,
    });
    return data.addRequerimientoEstadoHistorial;
  } catch (error) {
    throw new Error(`Error adding requerimiento estado historial: ${error}`);
  }
};

export interface UpdateHistorialData extends AddHistorialData {
  id: string;
}

export const updateRequerimientoEstadoHistorialService = async (historialData: UpdateHistorialData) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_REQUERIMIENTO_ESTADO_HISTORIAL,
      variables: {
        updateRequerimientoEstadoHistorialId: historialData.id,
        ...historialData
      },
    });
    return data.updateRequerimientoEstadoHistorial;
  } catch (error) {
    throw new Error(`Error updating requerimiento estado historial: ${error}`);
  }
};

export const deleteRequerimientoEstadoHistorialService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_REQUERIMIENTO_ESTADO_HISTORIAL,
      variables: { deleteRequerimientoEstadoHistorialId: id },
    });
    return data.deleteRequerimientoEstadoHistorial;
  } catch (error) {
    throw new Error(`Error deleting requerimiento estado historial: ${error}`);
  }
};