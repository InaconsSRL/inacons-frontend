import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CUESTIONARIOS_HOMOLOGACION = gql`
  query ListCuestionariosHomologacion {
    listCuestionariosHomologacion {
      id
      denominacion
    }
  }
`;

const ADD_CUESTIONARIO_HOMOLOGACION = gql`
  mutation AddCuestionarioHomologacion($denominacion: String!) {
    addCuestionarioHomologacion(denominacion: $denominacion) {
      denominacion
      id
    }
  }
`;

const UPDATE_CUESTIONARIO_HOMOLOGACION = gql`
  mutation UpdateCuestionarioHomologacion($updateCuestionarioHomologacionId: ID!, $denominacion: String!) {
    updateCuestionarioHomologacion(id: $updateCuestionarioHomologacionId, denominacion: $denominacion) {
      denominacion
      id
    }
  }
`;

const DELETE_CUESTIONARIO_HOMOLOGACION = gql`
  mutation DeleteCuestionarioHomologacion($deleteCuestionarioHomologacionId: ID!) {
    deleteCuestionarioHomologacion(id: $deleteCuestionarioHomologacionId) {
      id
      denominacion
    }
  }
`;

export const listCuestionariosHomologacionService = async () => {
  try {
    const response = await client.query({
      query: LIST_CUESTIONARIOS_HOMOLOGACION,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listCuestionariosHomologacion;
  } catch (error) {
    console.error('Error al obtener la lista de cuestionarios:', error);
    throw error;
  }
};

export const addCuestionarioHomologacionService = async (denominacion: string) => {
  try {
    const response = await client.mutate({
      mutation: ADD_CUESTIONARIO_HOMOLOGACION,
      variables: { denominacion },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addCuestionarioHomologacion;
  } catch (error) {
    console.error('Error al crear el cuestionario:', error);
    throw error;
  }
};

export const updateCuestionarioHomologacionService = async (id: string, denominacion: string) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_CUESTIONARIO_HOMOLOGACION,
      variables: { 
        updateCuestionarioHomologacionId: id, 
        denominacion 
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateCuestionarioHomologacion;
  } catch (error) {
    console.error('Error al actualizar el cuestionario:', error);
    throw error;
  }
};

export const deleteCuestionarioHomologacionService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_CUESTIONARIO_HOMOLOGACION,
      variables: { deleteCuestionarioHomologacionId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteCuestionarioHomologacion;
  } catch (error) {
    console.error('Error al eliminar el cuestionario:', error);
    throw error;
  }
};