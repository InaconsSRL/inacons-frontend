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
      estado
      sustento
      obra_id
      codigo
    }
  }
`;

const ADD_REQUERIMIENTO_MUTATION = gql`
  mutation AddRequerimiento($usuario_id: String!, $fecha_final: DateTime, $presupuesto_id: String, $sustento: String, $obra_id: String) {
  addRequerimiento(usuario_id: $usuario_id, fecha_final: $fecha_final, presupuesto_id: $presupuesto_id, sustento: $sustento, obra_id: $obra_id) {
    id
    codigo
    usuario_id
    usuario
    presupuesto_id
    fecha_solicitud
    fecha_final
    estado
    sustento
    obra_id
  }
}
`;

const UPDATE_REQUERIMIENTO_MUTATION = gql`
  mutation UpdateRequerimiento($updateRequerimientoId: ID!, $presupuesto_id: String, $fecha_final: DateTime, $sustento: String, $obra_id: String) {
  updateRequerimiento(id: $updateRequerimientoId, presupuesto_id: $presupuesto_id, fecha_final: $fecha_final, sustento: $sustento, obra_id: $obra_id) {
    id
    codigo
    usuario_id
    usuario
    presupuesto_id
    fecha_solicitud
    fecha_final
    estado
    sustento
    obra_id
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

export const updateRequerimientoService = async (requerimiento: { id: string; usuario_id: string; obra_id: string; sustento: string }) => {
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