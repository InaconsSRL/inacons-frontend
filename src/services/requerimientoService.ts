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
  mutation AddRequerimiento($usuarioId: String!, $fechaFinal: DateTime, $presupuestoId: String, $sustento: String, $obraId: String) {
  addRequerimiento(usuario_id: $usuarioId, fecha_final: $fechaFinal, presupuesto_id: $presupuestoId, sustento: $sustento, obra_id: $obraId) {
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
  mutation UpdateRequerimiento($updateRequerimientoId: ID!, $presupuestoId: String, $fechaFinal: DateTime, $sustento: String, $obraId: String) {
  updateRequerimiento(id: $updateRequerimientoId, presupuesto_id: $presupuestoId, fecha_final: $fechaFinal, sustento: $sustento, obra_id: $obraId) {
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