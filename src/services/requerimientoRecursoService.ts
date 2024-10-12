import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_REQUERIMIENTO_RECURSO_BY_REQUERIMIENTO_ID = gql`
  query ($requerimientoId: ID!) {
    getRequerimientoRecursoByRequerimientoId(requerimiento_id: $requerimientoId) {
      id
      requerimiento_id
      recurso_id
      cantidad
      cantidad_aprobada
      estado
      tipo_solicitud
      presupuestado
      nombre
      codigo
    }
  }
`;

const ADD_REQUERIMIENTO_RECURSO = gql`
  mutation Mutation($requerimientoId: ID!, $recursoId: ID!, $cantidad: Int!) {
    addRequerimientoRecurso(requerimiento_id: $requerimientoId, recurso_id: $recursoId, cantidad: $cantidad) {
      id
      codigo
      nombre
      recurso_id
      requerimiento_id
      cantidad
    }
  }
`;

const DELETE_REQUERIMIENTO_RECURSO = gql`
  mutation Mutation($deleteRequerimientoRecursoId: ID!) {
    deleteRequerimientoRecurso(id: $deleteRequerimientoRecursoId) {
      id
    }
  }
`;

export const getRequerimientoRecursoByRequerimientoId = async (requerimientoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_REQUERIMIENTO_RECURSO_BY_REQUERIMIENTO_ID,
      variables: { requerimientoId },
    });
    return data.getRequerimientoRecursoByRequerimientoId;
  } catch (error) {
    throw new Error(`Error fetching requerimiento recursos ${error}`);
  }
};

export const addRequerimientoRecurso = async (data: { requerimiento_id: string; recurso_id: string; cantidad: number }) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: ADD_REQUERIMIENTO_RECURSO,
      variables: {
        requerimientoId: data.requerimiento_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
      },
    });
    return responseData.addRequerimientoRecurso;
  } catch (error) {
    throw new Error(`Error adding requerimiento recurso ${error}`);
  }
};

export const deleteRequerimientoRecurso = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_REQUERIMIENTO_RECURSO,
      variables: { deleteRequerimientoRecursoId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteRequerimientoRecurso;
  } catch (error) {
    console.error('Error al eliminar el requerimiento de recurso:', error);
    throw error;
  }
};