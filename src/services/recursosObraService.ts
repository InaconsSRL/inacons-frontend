import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_RECURSOS_OBRA = gql`
  query ListRecursosObra {
    listRecursosObra {
      id
      obra_id
      recurso_id
      cantidad
      costo
      bodega_id
    }
  }
`;

const LIST_RECURSOS_OBRA_POR_OBRA = gql`
  query ListRecursosObraPorObra($obraId: ID!) {
    listRecursosObraPorObra(obraId: $obraId) {
      id
      obra_id
      recurso_id
      cantidad
      costo
      bodega_id
    }
  }
`;

const ADD_RECURSO_OBRA = gql`
  mutation AddRecursoObra($obraId: ID!, $recursoId: ID!, $cantidad: Int!, $costo: Float!, $bodegaId: ID!) {
    addRecursoObra(obra_id: $obraId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, bodega_id: $bodegaId) {
      id
      obra_id
      recurso_id
      cantidad
      costo
      bodega_id
    }
  }
`;

const UPDATE_RECURSO_OBRA = gql`
  mutation UpdateRecursoObra($updateRecursoObraId: ID!, $obraId: ID, $recursoId: ID, $cantidad: Int, $costo: Float, $bodegaId: ID) {
    updateRecursoObra(id: $updateRecursoObraId, obra_id: $obraId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, bodega_id: $bodegaId) {
      id
      obra_id
      recurso_id
      cantidad
      costo
      bodega_id
    }
  }
`;

const DELETE_RECURSO_OBRA = gql`
  mutation DeleteRecursoObra($deleteRecursoObraId: ID!) {
    deleteRecursoObra(id: $deleteRecursoObraId) {
      id
    }
  }
`;

export const listRecursosObraService = async () => {
  try {
    const { data } = await client.query({ query: LIST_RECURSOS_OBRA });
    return data.listRecursosObra;
  } catch (error) {
    throw new Error(`Error fetching recursos obra: ${error}`);
  }
};

export const listRecursosObraPorObraService = async (obraId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_RECURSOS_OBRA_POR_OBRA,
      variables: { obraId }
    });
    return data.listRecursosObraPorObra;
  } catch (error) {
    throw new Error(`Error fetching recursos obra por obra: ${error}`);
  }
};

export const addRecursoObraService = async (data: {
  obra_id: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
  bodega_id: string;
}) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: ADD_RECURSO_OBRA,
      variables: {
        obraId: data.obra_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        costo: data.costo,
        bodegaId: data.bodega_id
      }
    });
    return responseData.addRecursoObra;
  } catch (error) {
    throw new Error(`Error adding recurso obra: ${error}`);
  }
};

export const updateRecursoObraService = async (data: {
  id: string;
  obra_id?: string;
  recurso_id?: string;
  cantidad?: number;
  costo?: number;
  bodega_id?: string;
}) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: UPDATE_RECURSO_OBRA,
      variables: {
        updateRecursoObraId: data.id,
        obraId: data.obra_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        costo: data.costo,
        bodegaId: data.bodega_id
      }
    });
    return responseData.updateRecursoObra;
  } catch (error) {
    throw new Error(`Error updating recurso obra: ${error}`);
  }
};

export const deleteRecursoObraService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_RECURSO_OBRA,
      variables: { deleteRecursoObraId: id }
    });
    return data.deleteRecursoObra;
  } catch (error) {
    throw new Error(`Error deleting recurso obra: ${error}`);
  }
};