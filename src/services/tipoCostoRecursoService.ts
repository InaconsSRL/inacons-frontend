import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TIPO_COSTO_RECURSO_QUERY = gql`
  query ListTipoCostoRecurso {
    listTipoCostoRecurso {
      id
      nombre
    }
  }
`;

const ADD_TIPO_COSTO_RECURSO_MUTATION = gql`
  mutation AddTipoCostoRecurso($nombre: String) {
    addTipoCostoRecurso(nombre: $nombre) {
      id
      nombre
    }
  }
`;

const UPDATE_TIPO_COSTO_RECURSO_MUTATION = gql`
  mutation UpdateTipoCostoRecurso($updateTipoCostoRecursoId: ID!, $nombre: String) {
    updateTipoCostoRecurso(id: $updateTipoCostoRecursoId, nombre: $nombre) {
      id
      nombre
    }
  }
`;

export const listTipoCostoRecursoService = async () => {
  try {
    const response = await client.query({
      query: LIST_TIPO_COSTO_RECURSO_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data.listTipoCostoRecurso;
  } catch (error) {
    console.error('Error al obtener la lista de tipos de costo de recurso:', error);
    throw error;
  }
};

export const addTipoCostoRecursoService = async (tipoCostoRecursoData: { nombre: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_TIPO_COSTO_RECURSO_MUTATION,
      variables: tipoCostoRecursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addTipoCostoRecurso;
  } catch (error) {
    console.error('Error al crear el tipo de costo de recurso:', error);
    throw error;
  }
};

export const updateTipoCostoRecursoService = async (tipoCostoRecurso: { id: string; nombre: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_TIPO_COSTO_RECURSO_MUTATION,
      variables: { updateTipoCostoRecursoId: tipoCostoRecurso.id, ...tipoCostoRecurso },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateTipoCostoRecurso;
  } catch (error) {
    console.error('Error al actualizar el tipo de costo de recurso:', error);
    throw error;
  }
};