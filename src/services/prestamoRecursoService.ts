import { gql } from '@apollo/client';
import client from '../apolloClient';

// Queries
const LIST_PRESTAMO_RECURSOS = gql`
  query ListPrestamoRecursos {
    listPrestamoRecursos {
      id
      prestamo_id {
        id
      }
      obrabodega_recurso_id {
        id
      }
      cantidad
      observaciones
    }
  }
`;

const ADD_PRESTAMO_RECURSO = gql`
  mutation AddPrestamoRecurso(
    $prestamoId: ID!
    $obrabodegaRecursoId: ID!
    $cantidad: Int!
    $observaciones: String
  ) {
    addPrestamoRecurso(
      prestamo_id: $prestamoId
      obrabodega_recurso_id: $obrabodegaRecursoId
      cantidad: $cantidad
      observaciones: $observaciones
    ) {
      id
      prestamo_id {
        id
      }
      obrabodega_recurso_id {
        id
      }
      cantidad
      observaciones
    }
  }
`;

const UPDATE_PRESTAMO_RECURSO = gql`
  mutation UpdatePrestamoRecurso(
    $id: ID!
    $prestamoId: ID!
    $obrabodegaRecursoId: ID!
    $cantidad: Int!
    $observaciones: String
  ) {
    updatePrestamoRecurso(
      id: $id
      prestamo_id: $prestamoId
      obrabodega_recurso_id: $obrabodegaRecursoId
      cantidad: $cantidad
      observaciones: $observaciones
    ) {
      id
      prestamo_id {
        id
      }
      obrabodega_recurso_id {
        id
      }
      cantidad
      observaciones
    }
  }
`;

const DELETE_PRESTAMO_RECURSO = gql`
  mutation DeletePrestamoRecurso($id: ID!) {
    deletePrestamoRecurso(id: $id) {
      id
    }
  }
`;

// Service functions
export const listPrestamoRecursosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_PRESTAMO_RECURSOS,
    });
    return data.listPrestamoRecursos;
  } catch (error) {
    console.error('Error fetching prestamo recursos:', error);
    throw error;
  }
};

export const addPrestamoRecursoService = async (prestamoRecursoData: {
  cantidad: number;
  prestamoId: string;
  obrabodegaRecursoId: string;
  observaciones?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_PRESTAMO_RECURSO,
      variables: prestamoRecursoData,
    });
    return data.addPrestamoRecurso;
  } catch (error) {
    console.error('Error adding prestamo recurso:', error);
    throw error;
  }
};

export const updatePrestamoRecursoService = async (prestamoRecursoData: {
  id: string;
  prestamoId: string;
  obrabodegaRecursoId: string;
  cantidad: number;
  observaciones?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PRESTAMO_RECURSO,
      variables: prestamoRecursoData,
    });
    return data.updatePrestamoRecurso;
  } catch (error) {
    console.error('Error updating prestamo recurso:', error);
    throw error;
  }
};

export const deletePrestamoRecursoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRESTAMO_RECURSO,
      variables: { id },
    });
    return data.deletePrestamoRecurso.id;
  } catch (error) {
    console.error('Error deleting prestamo recurso:', error);
    throw error;
  }
};
