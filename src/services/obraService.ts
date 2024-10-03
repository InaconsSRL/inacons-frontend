import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_OBRA_QUERY = gql`
  query ListObras {
    listObras {
      id
      titulo
      nombre
      descripcion
    }
  }
`;

const ADD_OBRA_MUTATION = gql`
  mutation AddObra($descripcion: String, $nombre: String, $titulo: String) {
    addObra(descripcion: $descripcion, nombre: $nombre, titulo: $titulo) {
      id
      titulo
      nombre
      descripcion
    }
  }
`;

const UPDATE_OBRA_MUTATION = gql`
  mutation UpdateObra($updateObraId: ID!, $descripcion: String, $nombre: String, $titulo: String) {
    updateObra(id: $updateObraId, descripcion: $descripcion, nombre: $nombre, titulo: $titulo) {
      id
      titulo
      nombre
      descripcion
    }
  }
`;

export const listObrasService = async () => {
  try {
    const response = await client.query({
      query: LIST_OBRA_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data.listObras;
  } catch (error) {
    console.error('Error al obtener la lista de obras:', error);
    throw error;
  }
};

export const addObraService = async (obraData: { titulo: string; nombre: string; descripcion: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_OBRA_MUTATION,
      variables: obraData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addObra;
  } catch (error) {
    console.error('Error al crear la obra:', error);
    throw error;
  }
};

export const updateObraService = async (obra: { id: string; titulo: string; nombre: string; descripcion: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_OBRA_MUTATION,
      variables: { updateObraId: obra.id, ...obra },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateObra;
  } catch (error) {
    console.error('Error al actualizar la obra:', error);
    throw error;
  }
};