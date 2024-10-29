import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_REQUERIMIENTO_RECURSO_BY_REQUERIMIENTO_ID = gql`
    query ($requerimientoId: ID!) {
    getRequerimientoRecursoByRequerimientoId(requerimiento_id: $requerimientoId) {
    id
    requerimiento_id
    recurso_id
    nombre
    codigo
    cantidad
    cantidad_aprobada
    estado
    notas
    costo_ref
    metrado
    fecha_limit
    presupuestado
  }
}
`;

const UPDATE_REQUERIMIENTO_RECURSO = gql`
  mutation Mutation($updateRequerimientoRecursoId: ID!, $requerimiento_id: ID, $recurso_id: ID, $cantidad: Int, $cantidad_aprobada: Int, $estado: String, $notas: String, $costo_ref: Decimal, $metrado: Decimal, $fecha_limit: DateTime, $presupuestado: String) {
  updateRequerimientoRecurso(id: $updateRequerimientoRecursoId, requerimiento_id: $requerimiento_id, recurso_id: $recurso_id, cantidad: $cantidad, cantidad_aprobada: $cantidad_aprobada, estado: $estado, notas: $notas, costo_ref: $costo_ref, metrado: $metrado, fecha_limit: $fecha_limit, presupuestado: $presupuestado) {
    id
    requerimiento_id
    recurso_id
    nombre
    codigo
    cantidad
    cantidad_aprobada
    estado
    notas
    costo_ref
    metrado
    fecha_limit
    presupuestado
  }
}
`;

const ADD_REQUERIMIENTO_RECURSO = gql`
  mutation Mutation($requerimientoId: ID!, $recursoId: ID!, $cantidad: Int!, $cantidad_aprobada: Int, $notas: String, $costoRef: Decimal, $fechaLimit: DateTime, $metrado: Decimal) {
    addRequerimientoRecurso(requerimiento_id: $requerimientoId, recurso_id: $recursoId, cantidad: $cantidad, cantidad_aprobada: $cantidad_aprobada, notas: $notas, costo_ref: $costoRef, fecha_limit: $fechaLimit, metrado: $metrado) {
    id
    requerimiento_id
    recurso_id
    cantidad
    codigo
    costo_ref
    fecha_limit
    metrado
    nombre
    notas
    cantidad_aprobada
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

export const addRequerimientoRecurso = async (data: { requerimiento_id: string; recurso_id: string; cantidad: number; cantidad_aprobada: number }) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: ADD_REQUERIMIENTO_RECURSO,
      variables: {
        requerimientoId: data.requerimiento_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        cantidad_aprobada: data.cantidad,
      },
    });
    return responseData.addRequerimientoRecurso;
  } catch (error) {
    throw new Error(`Error adding requerimiento recurso ${error}`);
  }
};

export const updateRequerimientoRecurso = async (data: {
  id: string;
  requerimiento_id: string;
  recurso_id: string;
  cantidad: number;
  cantidad_aprobada: number;
  estado: string;
  notas: string;
  costo_ref: number;
  metrado: number;
  fecha_limit: Date;
  presupuestado: string;
}) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: UPDATE_REQUERIMIENTO_RECURSO,
      variables: {
        updateRequerimientoRecursoId: data.id,
        requerimiento_id: data.requerimiento_id,
        recurso_id: data.recurso_id,
        cantidad: data.cantidad,
        cantidad_aprobada: data.cantidad_aprobada,
        estado: data.estado,
        notas: data.notas,
        costo_ref: data.costo_ref,
        metrado: data.metrado,
        fecha_limit: data.fecha_limit,
        presupuestado: data.presupuestado,
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