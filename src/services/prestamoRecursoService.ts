import { gql } from '@apollo/client';
import client from '../apolloClient';
import {
  PrestamoRecursoResponse,
  AddPrestamoRecursoInput,
  UpdatePrestamoRecursoInput
} from '../types/prestamoRecurso';

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
      recurso_id {
        nombre
        codigo
        id
        tipo_recurso_id
        unidad_id
      }
    }
    cantidad
    observaciones
    
  }
}
`;

const GET_PRESTAMO_RECURSOS_BY_PRESTAMO_ID = gql`
  query GetPrestamoRecursosByPrestamoId($prestamoId: ID!) {
    getPrestamoRecursosByPrestamoId(prestamoId: $prestamoId) {
      id
    prestamo_id {
      id
    }
    obrabodega_recurso_id {
      id
      recurso_id {
        nombre
        codigo
        id
        tipo_recurso_id
        unidad_id
      }
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
      recurso_id {
        nombre
        codigo
        id
        tipo_recurso_id
        unidad_id
      }
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
      recurso_id {
        nombre
        codigo
        id
        tipo_recurso_id
        unidad_id
      }
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
export const listPrestamoRecursosService = async (): Promise<PrestamoRecursoResponse[]> => {
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

export const getPrestamoRecursosByPrestamoIdService = async (prestamoId: string): Promise<PrestamoRecursoResponse[]> => {
  try {
    const { data } = await client.query({
      query: GET_PRESTAMO_RECURSOS_BY_PRESTAMO_ID,
      variables: { prestamoId },
    });
    return data.getPrestamoRecursosByPrestamoId;
  } catch (error) {
    console.error('Error fetching prestamo recursos by prestamo id:', error);
    throw error;
  }
};

export const addPrestamoRecursoService = async (
  prestamoRecursoData: AddPrestamoRecursoInput
): Promise<PrestamoRecursoResponse> => {
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

export const updatePrestamoRecursoService = async (
  prestamoRecursoData: UpdatePrestamoRecursoInput
): Promise<PrestamoRecursoResponse> => {
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
