import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_REQUERIMIENTO_RECURSO_BY_REQUERIMIENTO_ID = gql`
  query GetRequerimientoRecursoByRequerimientoId($requerimientoId: ID!) {
  getRequerimientoRecursoByRequerimientoId(requerimiento_id: $requerimientoId) {
    id
    tipo
    requerimiento_id
    recurso_id
    nombre
    codigo
    unidad
    cantidad
    cantidad_aprobada
    estado
    notas
    costo_ref
    fecha_limit
    presupuestado
  }
}
`;

const UPDATE_REQUERIMIENTO_RECURSO = gql`
  mutation Mutation($updateRequerimientoRecursoId: ID!, $cantidad: Int,  $cantidad_aprobada: Int, $notas: String, $fecha_limit: DateTime) {
  updateRequerimientoRecurso(id: $updateRequerimientoRecursoId, cantidad: $cantidad, cantidad_aprobada: $cantidad_aprobada, notas: $notas, fecha_limit: $fecha_limit) {
    id
    requerimiento_id
    recurso_id
    nombre
    codigo
    unidad
    cantidad
    cantidad_aprobada
    estado
    notas
    costo_ref
    fecha_limit
    presupuestado
  }
}
`;

const ADD_REQUERIMIENTO_RECURSO = gql`
  mutation Mutation($requerimientoId: ID!, $recursoId: ID!, $cantidad: Int!, $cantidad_aprobada: Int, $notas: String, $costoRef: Decimal, $fecha_limit: DateTime, $metrado: Decimal) {
    addRequerimientoRecurso(requerimiento_id: $requerimientoId, recurso_id: $recursoId, cantidad: $cantidad, cantidad_aprobada: $cantidad_aprobada, notas: $notas, costo_ref: $costoRef, fecha_limit: $fecha_limit, metrado: $metrado) {
    id
    requerimiento_id
    recurso_id
    cantidad
    cantidad_aprobada
    codigo
    costo_ref
    fecha_limit
    nombre
    notas
    cantidad_aprobada
    unidad
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

export const addRequerimientoRecurso = async (data: { requerimiento_id: string; recurso_id: string; cantidad: number; cantidad_aprobada: number; fecha_limit: Date, notas: string }) => {
  try {
    console.log("serviceAddReqRec", data)
    const { data: responseData } = await client.mutate({
      mutation: ADD_REQUERIMIENTO_RECURSO,
      variables: {
        requerimientoId: data.requerimiento_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        cantidad_aprobada: data.cantidad,
        fecha_limit: data.fecha_limit,
        notas: data.notas,
      },
    });
    return responseData.addRequerimientoRecurso;
  } catch (error) {
    throw new Error(`Error adding requerimiento recurso ${error}`);
  }
};

export const updateRequerimientoRecurso = async (data: {
  id: string;
  cantidad_aprobada: number;
  notas: string;
  fecha_limit: Date;
}) => {
  try {
    console.log("serviceUpdReqRec", data)
    const { data: responseData } = await client.mutate({
      mutation: UPDATE_REQUERIMIENTO_RECURSO,
      variables: {
        updateRequerimientoRecursoId: data.id,
        cantidad_aprobada: data.cantidad_aprobada,
        cantidad: data.cantidad_aprobada,
        notas: data.notas,
        fecha_limit: data.fecha_limit,
      },
    });
    return responseData.updateRequerimientoRecurso;
  } catch (error) {
    throw new Error(`Error updating requerimiento recurso ${error}`);
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