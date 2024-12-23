import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_OBRA_BODEGAS = gql`
  query ListObraBodegas {
    listObraBodegas {
      id
      obra_id {
        id
        nombre
        titulo
      }
      codigo
      nombre
      descripcion
      estado
    }
  }
`;

const ADD_OBRA_BODEGA = gql`
  mutation AddObraBodega($obraId: ID!, $estado: String!, $codigo: String, $nombre: String, $descripcion: String) {
    addObraBodega(obra_id: $obraId, estado: $estado, codigo: $codigo, nombre: $nombre, descripcion: $descripcion) {
      id
      obra_id {
        id
        nombre
      }
      codigo
      nombre
      descripcion
      estado
    }
  }
`;

const UPDATE_OBRA_BODEGA = gql`
  mutation UpdateObraBodega($updateObraBodegaId: ID!, $obraId: ID!, $estado: String!, $codigo: String, $nombre: String, $descripcion: String) {
    updateObraBodega(id: $updateObraBodegaId, obra_id: $obraId, estado: $estado, codigo: $codigo, nombre: $nombre, descripcion: $descripcion) {
      id
      obra_id {
        id
        nombre
      }
      codigo
      nombre
      descripcion
      estado
    }
  }
`;

const DELETE_OBRA_BODEGA = gql`
  mutation DeleteObraBodega($deleteObraBodegaId: ID!) {
    deleteObraBodega(id: $deleteObraBodegaId) {
      id
    }
  }
`;

export const listObraBodegasService = async () => {
  try {
    const response = await client.query({
      query: LIST_OBRA_BODEGAS,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listObraBodegas;
  } catch (error) {
    console.error('Error al obtener la lista de bodegas de obra:', error);
    throw error;
  }
};

export const addObraBodegaService = async (bodegaData: {
  obraId: string;
  estado: string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_OBRA_BODEGA,
      variables: bodegaData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addObraBodega;
  } catch (error) {
    console.error('Error al crear la bodega de obra:', error);
    throw error;
  }
};

export const updateObraBodegaService = async (bodegaData: {
  updateObraBodegaId: string;
  obraId: string;
  estado: string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_OBRA_BODEGA,
      variables: bodegaData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateObraBodega;
  } catch (error) {
    console.error('Error al actualizar la bodega de obra:', error);
    throw error;
  }
};

export const deleteObraBodegaService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_OBRA_BODEGA,
      variables: { deleteObraBodegaId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteObraBodega;
  } catch (error) {
    console.error('Error al eliminar la bodega de obra:', error);
    throw error;
  }
};
