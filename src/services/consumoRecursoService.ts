import { gql } from '@apollo/client';
import client from '../apolloClient';
import {
  ConsumoRecursoResponse,
  AddConsumoRecursoInput,
  UpdateConsumoRecursoInput
} from '../types/consumoRecurso';

const LIST_CONSUMO_RECURSOS = gql`
  query ListConsumoRecursos {
    listConsumoRecursos {
      id
      consumo_id {
        id
      }
      recurso_id {
        id
        codigo
      }
      cantidad
      costo
      obra_bodega_id {
        obra_id {
          nombre
          id
        }
        id
        nombre
      }
      observaciones
    }
  }
`;

const LIST_CONSUMO_RECURSOS_BY_CONSUMO_ID = gql`
  query ListConsumoRecursosByConsumoId($consumoId: ID!) {
    listConsumoRecursosByConsumoId(consumoId: $consumoId) {
      id
      consumo_id {
        id
      }
      recurso_id {
        id
        codigo
      }
      cantidad
      costo
      obra_bodega_id {
        obra_id {
          nombre
          id
        }
        id
        nombre
      }
      observaciones
    }
  }
`;

const ADD_CONSUMO_RECURSO = gql`
  mutation AddConsumoRecurso($consumoId: ID!, $recursoId: ID!, $cantidad: Int!, $costo: Float!, $obraBodegaId: ID!) {
    addConsumoRecurso(consumo_id: $consumoId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, obra_bodega_id: $obraBodegaId) {
      id
      consumo_id {
        id
      }
      recurso_id {
        id
        codigo
      }
      cantidad
      costo
      obra_bodega_id {
        obra_id {
          nombre
          id
        }
        id
        nombre
      }
      observaciones
    }
  }
`;

const UPDATE_CONSUMO_RECURSO = gql`
  mutation UpdateConsumoRecurso($updateConsumoRecursoId: ID!, $consumoId: ID!, $recursoId: ID!, $cantidad: Int!, $costo: Float!, $obraBodegaId: ID!, $observaciones: String) {
    updateConsumoRecurso(id: $updateConsumoRecursoId, consumo_id: $consumoId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, obra_bodega_id: $obraBodegaId, observaciones: $observaciones) {
      id
      consumo_id {
        id
      }
      recurso_id {
        id
        codigo
      }
      cantidad
      costo
      obra_bodega_id {
        obra_id {
          nombre
          id
        }
        id
        nombre
      }
      observaciones
    }
  }
`;

const DELETE_CONSUMO_RECURSO = gql`
  mutation DeleteConsumoRecurso($deleteConsumoRecursoId: ID!) {
    deleteConsumoRecurso(id: $deleteConsumoRecursoId) {
      id
    }
  }
`;

// Service functions
export const listConsumoRecursosService = async (): Promise<ConsumoRecursoResponse[]> => {
  try {
    const { data } = await client.query({
      query: LIST_CONSUMO_RECURSOS,
    });
    return data.listConsumoRecursos;
  } catch (error) {
    console.error('Error fetching consumo recursos:', error);
    throw error;
  }
};

export const listConsumoRecursosByConsumoIdService = async (consumoId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_CONSUMO_RECURSOS_BY_CONSUMO_ID,
      variables: { consumoId },
    });
    return data.listConsumoRecursosByConsumoId;
  } catch (error) {
    console.error('Error fetching consumo recursos by consumo id:', error);
    throw error;
  }
};

export const addConsumoRecursoService = async (
  consumoRecursoData: AddConsumoRecursoInput
): Promise<ConsumoRecursoResponse> => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_CONSUMO_RECURSO,
      variables: consumoRecursoData,
    });
    return data.addConsumoRecurso;
  } catch (error) {
    console.error('Error adding consumo recurso:', error);
    throw error;
  }
};

export const updateConsumoRecursoService = async (
  consumoRecursoData: UpdateConsumoRecursoInput
): Promise<ConsumoRecursoResponse> => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_CONSUMO_RECURSO,
      variables: consumoRecursoData,
    });
    return data.updateConsumoRecurso;
  } catch (error) {
    console.error('Error updating consumo recurso:', error);
    throw error;
  }
};

export const deleteConsumoRecursoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_CONSUMO_RECURSO,
      variables: { deleteConsumoRecursoId: id },
    });
    return data.deleteConsumoRecurso.id;
  } catch (error) {
    console.error('Error deleting consumo recurso:', error);
    throw error;
  }
};
