import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_REQUERIMIENTOS_QUERY = gql`
  query ListRequerimientos {
    listRequerimientos {
      id
      usuario_id
      usuario
      presupuesto_id
      fecha_solicitud
      fecha_final
      estado_atencion
      sustento
      obra_id
      codigo
      aprobacion {
        id_usuario
        id_aprobacion
        cargo
        gerarquia
        nombres
        apellidos
      }
    }
  }
`;

const ADD_REQUERIMIENTO_MUTATION = gql`
  mutation AddRequerimiento($usuario_id: String!, $presupuesto_id: String, $fecha_solicitud: DateTime, $fecha_final: DateTime, $estado_atencion: String, $sustento: String, $obra_id: String) {
    addRequerimiento(usuario_id: $usuario_id, presupuesto_id: $presupuesto_id, fecha_solicitud: $fecha_solicitud, fecha_final: $fecha_final, estado_atencion: $estado_atencion, sustento: $sustento, obra_id: $obra_id) {
      id
      usuario_id
      usuario
      presupuesto_id
      fecha_solicitud
      fecha_final
      estado_atencion
      sustento
      obra_id
      codigo
      aprobacion {
        id_usuario
        id_aprobacion
        cargo
        gerarquia
      }
    }
  }
`;

const UPDATE_REQUERIMIENTO_MUTATION = gql`
  mutation UpdateRequerimiento($updateRequerimientoId: ID!, $usuario_id: String, $presupuesto_id: String, $fecha_solicitud: DateTime, $fecha_final: DateTime, $estado_atencion: String, $sustento: String, $obra_id: String) {
    updateRequerimiento(id: $updateRequerimientoId, usuario_id: $usuario_id, presupuesto_id: $presupuesto_id, fecha_solicitud: $fecha_solicitud, fecha_final: $fecha_final, estado_atencion: $estado_atencion, sustento: $sustento, obra_id: $obra_id) {
      id
      usuario_id
      usuario
      presupuesto_id
      fecha_solicitud
      fecha_final
      estado_atencion
      sustento
      obra_id
      codigo
      aprobacion {
        id_usuario
        id_aprobacion
        cargo
        gerarquia
      }
    }
  }
`;

const GET_REQUERIMIENTO_QUERY = gql`
  query GetRequerimiento($getRequerimientoId: ID!) {
    getRequerimiento(id: $getRequerimientoId) {
      id
      usuario_id 
      usuario
      presupuesto_id
      fecha_solicitud
      fecha_final
      estado_atencion
      sustento
      obra_id
      codigo
      aprobacion {
        id_usuario
        id_aprobacion
        cargo
        gerarquia
      }
    }
  }
`;

const DELETE_REQUERIMIENTO_MUTATION = gql`
  mutation DeleteRequerimiento($deleteRequerimientoId: ID!) {
    deleteRequerimiento(id: $deleteRequerimientoId) {
      id
    }
  }
`;

export const listRequerimientosService = async () => {
  try {
    const response = await client.query({
      query: LIST_REQUERIMIENTOS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listRequerimientos;
  } catch (error) {
    console.error('Error al obtener la lista de requerimientos:', error);
    throw error;
  }
};

export const addRequerimientoService = async (requerimientoData: { usuario_id: string; obra_id: string; sustento: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_REQUERIMIENTO_MUTATION,
      variables: requerimientoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addRequerimiento;
  } catch (error) {
    console.error('Error al crear el requerimiento:', error);
    throw error;
  }
};

export const updateRequerimientoService = async (requerimiento: { id: string; usuario_id: string; obra_id: string; sustento: string; estado_atencion: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_REQUERIMIENTO_MUTATION,
      variables: { updateRequerimientoId: requerimiento.id, ...requerimiento },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateRequerimiento;
  } catch (error) {
    console.error('Error al actualizar el requerimiento:', error);
    throw error;
  }
};

export const getRequerimientoService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_REQUERIMIENTO_QUERY,
      variables: { getRequerimientoId: id }
    });

    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }

    return response.data.getRequerimiento;
  } catch (error) {
    console.error('Error al actualizar el requerimiento:', error);
    throw error;
  }
};

export const deleteRequerimientoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_REQUERIMIENTO_MUTATION,
      variables: { deleteRequerimientoId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteRequerimiento;
  } catch (error) {
    console.error('Error al eliminar el requerimiento:', error);
    throw error;
  }
};