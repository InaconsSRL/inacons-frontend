import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CLASIFICACION_RECURSO_QUERY = gql`
  query ListClasificacionRecurso {
    listClasificacionRecurso {
      id
      nombre
      parent_id
      childs {
        id
        nombre
        parent_id
        childs {
          id
          nombre
          parent_id
        }
      }
    }
  }
`;

const ADD_CLASIFICACION_RECURSO_MUTATION = gql`
  mutation AddClasificacionRecurso($nombre: String!, $parentId: ID) {
    addClasificacionRecurso(nombre: $nombre, parent_id: $parentId) {
      id
      nombre
      parent_id
    }
  }
`;

const UPDATE_CLASIFICACION_RECURSO_MUTATION = gql`
  mutation UpdateClasificacionRecurso($updateClasificacionRecursoId: ID!, $nombre: String, $parentId: ID) {
    updateClasificacionRecurso(id: $updateClasificacionRecursoId, nombre: $nombre, parent_id: $parentId) {
      id
      nombre
      parent_id
    }
  }
`;

export const listClasificacionesRecursoService = async () => {
  try {
    const response = await client.query({
      query: LIST_CLASIFICACION_RECURSO_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listClasificacionRecurso;
  } catch (error) {
    console.error('Error al obtener la lista de clasificaciones de recurso:', error);
    throw error;
  }
};

export const addClasificacionRecursoService = async (clasificacionRecursoData: { nombre: string; parentId: string | null }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_CLASIFICACION_RECURSO_MUTATION,
      variables: clasificacionRecursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addClasificacionRecurso;
  } catch (error) {
    console.error('Error al crear la clasificación de recurso:', error);
    throw error;
  }
};

export const updateClasificacionRecursoService = async (clasificacionRecurso: { id: string; nombre: string; parentId: string | null }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_CLASIFICACION_RECURSO_MUTATION,
      variables: { updateClasificacionRecursoId: clasificacionRecurso.id, nombre: clasificacionRecurso.nombre, parentId: clasificacionRecurso.parentId },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateClasificacionRecurso;
  } catch (error) {
    console.error('Error al actualizar la clasificación de recurso:', error);
    throw error;
  }
};