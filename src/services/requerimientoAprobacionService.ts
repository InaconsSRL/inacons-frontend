import { gql } from '@apollo/client';
import client from '../apolloClient';

const ADD_REQUERIMIENTO_APROBACION = gql`
  mutation AddRequerimientoAprobacion($requerimiento_id: ID!, $usuario_id: ID!, $estado_aprobacion: String, $fecha_aprobacion: DateTime, $comentario: String, $gerarquia_aprobacion: Number) {
    addRequerimientoAprobacion(requerimiento_id: $requerimiento_id, usuario_id: $usuario_id, estado_aprobacion: $estado_aprobacion, fecha_aprobacion: $fecha_aprobacion, comentario: $comentario, gerarquia_aprobacion: $gerarquia_aprobacion) {
      id
      requerimiento_id
      usuario_id
      estado_aprobacion
      fecha_aprobacion
      comentario
      gerarquia_aprobacion
    }
  }
`;

const UPDATE_REQUERIMIENTO_APROBACION = gql`
  mutation UpdateRequerimientoAprobacion(
    $updateRequerimientoAprobacionId: ID!, 
    $requerimiento_id: ID!, 
    $usuario_id: ID!, 
    $estado_aprobacion: String, 
    $fecha_aprobacion: DateTime, 
    $comentario: String, 
    $gerarquia_aprobacion: Number
  ) {
    updateRequerimientoAprobacion(
      id: $updateRequerimientoAprobacionId, 
      requerimiento_id: $requerimiento_id, 
      usuario_id: $usuario_id, 
      estado_aprobacion: $estado_aprobacion, 
      fecha_aprobacion: $fecha_aprobacion, 
      comentario: $comentario, 
      gerarquia_aprobacion: $gerarquia_aprobacion
    ) {
      id
      requerimiento_id
      usuario_id
      estado_aprobacion
      fecha_aprobacion
      comentario
      gerarquia_aprobacion
    }
  }
`;

const LIST_REQUERIMIENTO_APROBACIONES = gql`
  query ListRequerimientoAprobaciones {
    listRequerimientoAprobaciones {
      id
      requerimiento_id
      usuario_id
      estado_aprobacion
      fecha_aprobacion
      comentario
      gerarquia_aprobacion
    }
  }
`;

const DELETE_REQUERIMIENTO_APROBACION = gql`
  mutation DeleteRequerimientoAprobacion($deleteRequerimientoAprobacionId: ID!) {
    deleteRequerimientoAprobacion(id: $deleteRequerimientoAprobacionId) {
      id
      requerimiento_id
      usuario_id
      estado_aprobacion
      fecha_aprobacion
      comentario
      gerarquia_aprobacion
    }
  }
`;

export const listRequerimientoAprobaciones = async () => {
  try {
    const { data } = await client.query({
      query: LIST_REQUERIMIENTO_APROBACIONES
    });
    return data.listRequerimientoAprobaciones;
  } catch (error) {
    throw new Error(`Error fetching aprobaciones: ${error}`);
  }
};

export const addRequerimientoAprobacion = async (data: {
  requerimiento_id: string;
  usuario_id: string;
  estado_aprobacion: string;
  fecha_aprobacion?: Date;
  comentario?: string;
  gerarquia_aprobacion?: number;
}) => {
  console.log("addService", data);
  try {
    const { data: responseData } = await client.mutate({
      mutation: ADD_REQUERIMIENTO_APROBACION,
      variables: {
        ...data,
        fechaAprobacion: data.fecha_aprobacion || new Date()
      }
    });
    return responseData.addRequerimientoAprobacion;
  } catch (error) {
    throw new Error(`Error adding aprobacion: ${error}`);
  }
};

export const updateRequerimientoAprobacion = async (data: {
  id: string;
  requerimiento_id: string;
  usuario_id: string;
  estado_aprobacion: string;
  fecha_aprobacion?: Date;
  comentario?: string;
  gerarquia_aprobacion?: number;
}) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: UPDATE_REQUERIMIENTO_APROBACION,
      variables: {
        updateRequerimientoAprobacionId: data.id,
        ...data
      }
    });
    return responseData.updateRequerimientoAprobacion;
  } catch (error) {
    throw new Error(`Error updating aprobacion: ${error}`);
  }
};

export const deleteRequerimientoAprobacion = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_REQUERIMIENTO_APROBACION,
      variables: { deleteRequerimientoAprobacionId: id }
    });
    return data.deleteRequerimientoAprobacion;
  } catch (error) {
    throw new Error(`Error deleting aprobacion: ${error}`);
  }
};